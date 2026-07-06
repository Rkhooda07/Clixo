"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { ThumbnailUploader } from "@/components/tasks/ThumbnailUploader";
import { taskApi, uploadApi } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { ethers } from "ethers";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

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

interface InputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  step?: string;
  min?: number;
  max?: number;
}

function StyledInput({ value, onChange, type = "text", placeholder, readOnly, step, min, max }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      step={step}
      min={min}
      max={max}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "var(--surface-2)",
        border: `1px solid ${focused ? "var(--text-3)" : "var(--line)"}`,
        borderRadius: "5px",
        padding: "10px 14px",
        fontFamily: inter,
        fontSize: "13px",
        color: readOnly ? "var(--text-2)" : "var(--text-1)",
        outline: "none",
        transition: "border-color 0.1s",
        boxSizing: "border-box",
      }}
    />
  );
}

function StyledTextarea({ value, onChange, rows = 4, placeholder }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "var(--surface-2)",
        border: `1px solid ${focused ? "var(--text-3)" : "var(--line)"}`,
        borderRadius: "5px",
        padding: "10px 14px",
        fontFamily: inter,
        fontSize: "13px",
        color: "var(--text-1)",
        outline: "none",
        resize: "none",
        transition: "border-color 0.1s",
        boxSizing: "border-box",
      }}
    />
  );
}

function PrimaryButton({ onClick, disabled, children }: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: "10px 18px",
        fontFamily: geist,
        fontSize: "13px",
        fontWeight: 500,
        background: disabled ? "var(--surface-2)" : hovered ? "var(--surface-2)" : "var(--text-1)",
        color: disabled ? "var(--text-3)" : hovered ? "var(--text-1)" : "var(--ink)",
        border: `1px solid ${disabled ? "var(--line)" : hovered ? "var(--text-1)" : "var(--text-1)"}`,
        borderRadius: "5px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 150ms, color 150ms",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: "10px 18px",
        fontFamily: geist,
        fontSize: "13px",
        fontWeight: 500,
        background: hovered ? "var(--surface-2)" : "transparent",
        color: "var(--text-2)",
        border: "1px solid var(--line)",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background 150ms, border-color 150ms",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: "10px",
        color: "var(--text-3)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "6px",
      }}
    >
      {children}
    </div>
  );
}

function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: "10px",
        color: "var(--text-3)",
        textAlign: "right",
        marginTop: "4px",
      }}
    >
      {current}/{max}
    </div>
  );
}

export default function CreateTaskPage() {
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minVotes, setMinVotes] = useState(5);
  const [thumbnails, setThumbnails] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState("");
  const [createdTaskId, setCreatedTaskId] = useState<number | null>(null);

  const ethPrice = 3200;
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
    setSubmissionProgress("Uploading option files to IPFS...");
    toast.loading("Creating campaign...", { id: "create-campaign" });

    try {
      const uploadedOptions: { ipfs_cid: string; gateway_url: string; ipfs_uri: string }[] = [];
      for (let i = 0; i < thumbnails.length; i++) {
        setSubmissionProgress(`Uploading option ${i + 1} of ${thumbnails.length}...`);
        const res = await uploadApi.uploadFile(thumbnails[i]);
        if (res.ok) {
          uploadedOptions.push({ ipfs_cid: res.cid, gateway_url: res.gatewayUrl, ipfs_uri: res.ipfs_uri });
        } else {
          throw new Error(`Failed to upload option ${i + 1}`);
        }
      }

      setSubmissionProgress("Registering task...");
      const taskRes = await taskApi.create({
        title,
        budget: minVotes,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        options: uploadedOptions,
      });

      if (!taskRes.success) throw new Error(taskRes.message || "Failed to create campaign");
      const taskId = taskRes.task.id;

      setSubmissionProgress("Funding escrow...");
      if (!window.ethereum) throw new Error("No Ethereum browser extension found.");

      await ensureSepoliaNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const signerAddress = await signer.getAddress();

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        throw new Error("Switch your wallet to Sepolia and try again.");
      }

      const txValue = ethers.parseEther(rewardEth);
      const balance = await provider.getBalance(signerAddress);
      const feeData = await provider.getFeeData();
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
      <div className="px-4 md:px-10" style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "40px", paddingBottom: "48px" }}>

        {step < 4 && (
          <>
            {/* Step indicator */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.n}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: "10px",
                          color: step >= s.n ? "var(--text-1)" : "var(--text-3)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {s.n < 10 ? `0${s.n}` : s.n}
                      </span>
                      <span
                        style={{
                          fontFamily: geist,
                          fontSize: "12px",
                          fontWeight: 500,
                          color: step === s.n ? "var(--text-1)" : "var(--text-3)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: step > s.n ? "var(--text-3)" : "var(--line)",
                          margin: "0 16px",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form area */}
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

              {/* Main form card */}
              <div
                style={{
                  flex: 1,
                  background: "var(--surface-1)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Step 1: Details */}
                {step === 1 && (
                  <>
                    <div
                      style={{
                        fontFamily: geist,
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "var(--text-1)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Campaign Details
                    </div>

                    <div>
                      <FieldLabel>Title</FieldLabel>
                      <StyledInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                        placeholder="Which thumbnail should we use for this video?"
                      />
                      <CharCount current={title.length} max={80} />
                    </div>

                    <div>
                      <FieldLabel>Context for voters</FieldLabel>
                      <StyledTextarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                        rows={4}
                        placeholder="Describe the video topic and what workers should consider when choosing..."
                      />
                      <CharCount current={description.length} max={300} />
                    </div>

                    <div>
                      <FieldLabel>Minimum voters required</FieldLabel>
                      <StyledInput
                        type="number"
                        value={minVotes}
                        onChange={(e) =>
                          setMinVotes(Math.max(5, Math.min(500, Number(e.target.value))))
                        }
                        min={5}
                        max={500}
                      />
                      <div
                        style={{
                          fontFamily: inter,
                          fontSize: "12px",
                          color: "var(--text-3)",
                          marginTop: "6px",
                          lineHeight: 1.5,
                        }}
                      >
                        5–500 voters. More voters produce a stronger signal.
                      </div>
                    </div>

                    <PrimaryButton onClick={handleNext}>
                      Next: Upload options →
                    </PrimaryButton>
                  </>
                )}

                {/* Step 2: Uploads */}
                {step === 2 && (
                  <>
                    <div
                      style={{
                        fontFamily: geist,
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "var(--text-1)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Upload Options
                    </div>

                    <ThumbnailUploader onFilesChange={setThumbnails} />

                    <div style={{ display: "flex", gap: "10px" }}>
                      <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                      <PrimaryButton onClick={handleNext}>
                        Next: Review &amp; confirm →
                      </PrimaryButton>
                    </div>
                  </>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                  <>
                    <div
                      style={{
                        fontFamily: geist,
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "var(--text-1)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Confirm &amp; Stake
                    </div>

                    <div>
                      <FieldLabel>Sepolia ETH reward pool</FieldLabel>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <span
                            style={{
                              position: "absolute",
                              left: "14px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontFamily: mono,
                              fontSize: "13px",
                              color: "var(--amber)",
                              pointerEvents: "none",
                            }}
                          >
                            Ξ
                          </span>
                          <input
                            type="number"
                            step="0.001"
                            value={rewardEth}
                            readOnly
                            style={{
                              width: "100%",
                              background: "var(--surface-2)",
                              border: "1px solid var(--line)",
                              borderRadius: "5px",
                              padding: "10px 14px 10px 28px",
                              fontFamily: mono,
                              fontSize: "13px",
                              color: "var(--amber)",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            background: "var(--surface-2)",
                            border: "1px solid var(--line)",
                            borderRadius: "5px",
                            padding: "10px 14px",
                            fontFamily: mono,
                            fontSize: "12px",
                            color: "var(--text-3)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          ~${usdEstimate}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: inter,
                          fontSize: "12px",
                          color: "var(--text-3)",
                          marginTop: "6px",
                          lineHeight: 1.5,
                        }}
                      >
                        {minVotes} credits × {ETH_PER_CREDIT.toFixed(3)} ETH. Split equally among winning-option voters at close.
                      </div>
                    </div>

                    {isSubmitting ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          padding: "16px 0",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: "10px",
                            color: "var(--text-3)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {submissionProgress}
                        </div>
                        <div
                          style={{
                            height: "2px",
                            background: "var(--line)",
                            borderRadius: "1px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: "40%",
                              background: "var(--text-2)",
                              animation: "none",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                        <PrimaryButton onClick={handleSubmit}>
                          Confirm &amp; Pay →
                        </PrimaryButton>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Summary sidebar — desktop only */}
              <div
                className="hidden lg:block"
                style={{ width: "220px", flexShrink: 0 }}
              >
                <div
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--line)",
                    borderRadius: "6px",
                    padding: "16px",
                    position: "sticky",
                    top: "72px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: "10px",
                      color: "var(--text-3)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    Summary
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <SummaryRow label="Title">
                      <span
                        style={{
                          fontFamily: inter,
                          fontSize: "12px",
                          color: "var(--text-2)",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {title || <span style={{ color: "var(--text-3)" }}>—</span>}
                      </span>
                    </SummaryRow>

                    <SummaryRow label="Options">
                      <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-2)" }}>
                        {thumbnails.length || "—"}
                      </span>
                    </SummaryRow>

                    <SummaryRow label="Voters">
                      <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--text-2)" }}>
                        {minVotes}
                      </span>
                    </SummaryRow>

                    <SummaryRow label="Reward">
                      <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--amber)" }}>
                        Ξ {rewardEth} ETH
                      </span>
                    </SummaryRow>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto",
              textAlign: "center",
              paddingTop: "40px",
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Campaign Created
            </div>

            <h2
              style={{
                fontFamily: geist,
                fontSize: "24px",
                fontWeight: 500,
                color: "var(--text-1)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Your campaign is live.
            </h2>

            <p
              style={{
                fontFamily: inter,
                fontSize: "13px",
                color: "var(--text-2)",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Funded and active. Workers can start voting now. You'll see results as votes come in.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href={`/tasks/${createdTaskId}`}
                style={{
                  display: "block",
                  padding: "10px 18px",
                  fontFamily: geist,
                  fontSize: "13px",
                  fontWeight: 500,
                  background: "var(--text-1)",
                  color: "var(--ink)",
                  border: "1px solid var(--text-1)",
                  borderRadius: "5px",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                View Results →
              </Link>
              <Link
                href="/dashboard"
                style={{
                  display: "block",
                  padding: "10px 18px",
                  fontFamily: geist,
                  fontSize: "13px",
                  fontWeight: 500,
                  background: "transparent",
                  color: "var(--text-2)",
                  border: "1px solid var(--line)",
                  borderRadius: "5px",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </WalletGuard>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "3px",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
