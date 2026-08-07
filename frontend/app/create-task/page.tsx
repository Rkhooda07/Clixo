"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { Eip1193Provider } from "ethers";
import axios from "axios";
import { toast } from "sonner";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { StepIndicator } from "@/components/create-task/StepIndicator";
import { StepDetails } from "@/components/create-task/StepDetails";
import { StepOptions } from "@/components/create-task/StepOptions";
import { StepReview } from "@/components/create-task/StepReview";
import { StepSuccess } from "@/components/create-task/StepSuccess";
import { taskApi, uploadApi } from "@/lib/api";
import { useEthPrice } from "@/hooks/useEthPrice";

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";
const SERVER_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_SERVER_WALLET_ADDRESS ||
  "0x2a8cAd35800C4322bEC6A8E165DB7a0a18FC746D";
const ETH_PER_CREDIT = 0.001;
const FUNDING_GAS_LIMIT = 21000n;

const STEPS = [
  { n: 1, label: "Details" },
  { n: 2, label: "Upload" },
  { n: 3, label: "Confirm" },
];

export default function CreateTaskPage() {
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minVotes, setMinVotes] = useState(5);
  const [thumbnails, setThumbnails] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState("");
  const [createdTaskId, setCreatedTaskId] = useState<number | null>(null);

  const reduceMotion = useReducedMotion();

  // Warm the ethers chunk (~350 kB) as soon as the user starts uploading, so
  // Confirm doesn't pay for the download. Webpack caches the module, so the
  // await in handleSubmit resolves instantly.
  useEffect(() => {
    if (step >= 2) void import("ethers");
  }, [step]);

  const ethPrice = useEthPrice() ?? 3200;
  const rewardEth = (minVotes * ETH_PER_CREDIT).toFixed(3);
  const usdEstimate = (Number(rewardEth) * ethPrice).toFixed(2);

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !description.trim()) {
        toast.error("Please fill in the title and description.");
        return;
      }
      if (minVotes < 5 || minVotes > 500) {
        toast.error("Min votes must be between 5 and 500.");
        return;
      }
    }
    if (step === 2) {
      if (thumbnails.length < 2) {
        toast.error("Upload at least 2 option files.");
        return;
      }
      if (thumbnails.length > 10) {
        toast.error("Maximum of 10 option files.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const ensureSepoliaNetwork = async () => {
    if (!window.ethereum) throw new Error("No Ethereum browser extension found.");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (switchError) {
      const errorCode =
        typeof switchError === "object" && switchError !== null && "code" in switchError
          ? (switchError as { code?: number }).code
          : undefined;
      if (errorCode !== 4902) throw switchError;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia",
          nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://rpc.sepolia.org"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        }],
      });
    }
  };

  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; errors?: string[]; error?: string } | undefined;
      const details = data?.errors?.length ? `: ${data.errors.join(", ")}` : "";
      return `${data?.message || data?.error || err.message}${details}`;
    }
    return err instanceof Error ? err.message : "Failed to create campaign";
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionProgress(`Uploading options... 0/${thumbnails.length}`);
    toast.loading("Creating campaign...", { id: "create-campaign" });

    try {
      // Kick the import off but don't await it yet — the uploads below don't
      // need ethers, so downloading it in parallel with them costs nothing.
      const ethersPromise = import("ethers");

      let settled = 0;
      const uploadedOptions = await Promise.all(
        thumbnails.map(async (file, i) => {
          const res = await uploadApi.uploadFile(file);
          if (!res.ok) throw new Error(`Failed to upload option ${i + 1}`);
          settled += 1;
          setSubmissionProgress(`Uploading options... ${settled}/${thumbnails.length}`);
          return { ipfs_cid: res.cid, gateway_url: res.gatewayUrl, ipfs_uri: res.ipfs_uri };
        })
      );

      setSubmissionProgress("Registering task...");
      const trimmedDescription = description.trim();
      const taskRes = await taskApi.create({
        title,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
        budget: minVotes,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        options: uploadedOptions,
      });

      if (!taskRes.success) throw new Error(taskRes.message || "Failed to create campaign");
      const taskId = taskRes.task.id;

      setSubmissionProgress("Funding escrow...");
      if (!window.ethereum) throw new Error("No Ethereum browser extension found.");

      const { ethers } = await ethersPromise;

      await ensureSepoliaNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);

      setSubmissionProgress("Checking balance and fees...");

      // These three reads are independent of each other; awaiting them in
      // sequence used to add several RPC round trips of dead time between the
      // click and the wallet prompt.
      const [signer, network, feeData] = await Promise.all([
        provider.getSigner(),
        provider.getNetwork(),
        provider.getFeeData(),
      ]);
      const signerAddress = await signer.getAddress();

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        throw new Error("Switch your wallet to Sepolia and try again.");
      }

      const txValue = ethers.parseEther(rewardEth);
      const balance = await provider.getBalance(signerAddress);
      const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice ?? 0n;
      const estimatedGasCost = maxFeePerGas * FUNDING_GAS_LIMIT;

      if (balance < txValue + estimatedGasCost) {
        throw new Error(
          `Insufficient Sepolia ETH. Need ${ethers.formatEther(txValue + estimatedGasCost)} ETH, have ${ethers.formatEther(balance)} ETH.`
        );
      }

      toast.loading("Confirm the transaction in your wallet...", { id: "create-campaign" });
      const tx = await signer.sendTransaction({
        to: SERVER_WALLET_ADDRESS,
        value: txValue,
        gasLimit: FUNDING_GAS_LIMIT,
      });

      setSubmissionProgress("Waiting for confirmation...");
      await tx.wait();

      setSubmissionProgress("Activating campaign...");
      await taskApi.fund(taskId, tx.hash);

      setCreatedTaskId(taskId);
      toast.success("Campaign created.", { id: "create-campaign" });
      setStep(4);
    } catch (err: unknown) {
      console.error("Task creation error:", err);
      toast.error(getErrorMessage(err), { id: "create-campaign" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WalletGuard>
      <PageWrapper>
        <div className="mx-auto max-w-[800px] pb-12 pt-10">
          {step < 4 ? (
            <>
              <StepIndicator steps={STEPS} current={step} />

              <div className="flex items-start gap-6">
                {/* Main form card */}
                <Card className="min-w-0 flex-1 overflow-hidden p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={step}
                      className="flex flex-col gap-5"
                      initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step === 1 && (
                        <StepDetails
                          title={title}
                          description={description}
                          minVotes={minVotes}
                          onTitleChange={(v) => setTitle(v.slice(0, 80))}
                          onDescriptionChange={(v) => setDescription(v.slice(0, 300))}
                          onMinVotesChange={(v) => setMinVotes(Math.max(5, Math.min(500, v)))}
                          onNext={handleNext}
                        />
                      )}
                      {step === 2 && (
                        <StepOptions
                          files={thumbnails}
                          onFilesChange={setThumbnails}
                          onBack={handleBack}
                          onNext={handleNext}
                        />
                      )}
                      {step === 3 && (
                        <StepReview
                          rewardEth={rewardEth}
                          usdEstimate={usdEstimate}
                          minVotes={minVotes}
                          ethPerCredit={ETH_PER_CREDIT}
                          isSubmitting={isSubmitting}
                          submissionProgress={submissionProgress}
                          onBack={handleBack}
                          onSubmit={handleSubmit}
                        />
                      )}
                    </m.div>
                  </AnimatePresence>
                </Card>

                {/* Summary sidebar — desktop only */}
                <div className="hidden w-[220px] shrink-0 lg:block">
                  <Card className="sticky top-[72px] p-4">
                    <div className="eyebrow mb-4">Task summary</div>
                    <div className="flex flex-col gap-3">
                      <SummaryRow label="Title">
                        <span className="line-clamp-2 text-xs leading-snug text-lo">
                          {title || <span className="text-dim">—</span>}
                        </span>
                      </SummaryRow>
                      <SummaryRow label="Options">
                        <span className="font-mono text-xs text-lo">
                          {thumbnails.length || "—"}
                        </span>
                      </SummaryRow>
                      <SummaryRow label="Opinions">
                        <span className="font-mono text-xs text-lo">{minVotes}</span>
                      </SummaryRow>
                      <SummaryRow label="Reward">
                        <span className="font-mono text-xs text-amber">Ξ {rewardEth} ETH</span>
                      </SummaryRow>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <StepSuccess taskId={createdTaskId} />
          )}
        </div>
      </PageWrapper>
    </WalletGuard>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-0.5">{label}</div>
      {children}
    </div>
  );
}
