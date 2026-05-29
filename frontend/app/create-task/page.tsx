"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WalletGuard } from "@/components/wallet/WalletGuard";
import { ThumbnailUploader } from "@/components/tasks/ThumbnailUploader";
import { taskApi, uploadApi } from "@/lib/api";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { useWalletUser } from "@/hooks/useWalletUser";
import { ethers } from "ethers";
import {
  FileText,
  Image,
  Coins,
  CheckCircle,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function CreateTaskPage() {
  const { userId } = useAppStore();
  const { address } = useWalletUser();
  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minVotes, setMinVotes] = useState(20);
  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [rewardEth, setRewardEth] = useState("0.02");

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState("");
  const [createdTaskId, setCreatedTaskId] = useState<number | null>(null);

  // Simulated USD Estimate
  const ethPrice = 3200; // Mock ETH Price
  const usdEstimate = Number(rewardEth) ? (Number(rewardEth) * ethPrice).toFixed(2) : "0.00";

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
        toast.error("Please upload at least 2 option files.");
        return;
      }
      if (thumbnails.length > 10) {
        toast.error("You can upload a maximum of 10 option files.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionProgress("Uploading option files to IPFS...");
    const toastId = toast.loading("Creating campaign draft...", { id: "create-campaign" });

    try {
      // 1. Upload files first to get Pinata CIDs and Gateway URLs
      const uploadedOptions: { ipfs_cid: string; gateway_url: string; ipfs_uri: string }[] = [];

      for (let i = 0; i < thumbnails.length; i++) {
        setSubmissionProgress(`Uploading option #${i + 1} to IPFS...`);
        const res = await uploadApi.uploadFile(thumbnails[i]);
        if (res.ok) {
          uploadedOptions.push({
            ipfs_cid: res.cid,
            gateway_url: res.gatewayUrl,
            ipfs_uri: res.ipfs_uri,
          });
        } else {
          throw new Error(`Failed to upload option #${i + 1}`);
        }
      }

      // 2. Submit task campaign metadata to backend
      setSubmissionProgress("Registering task campaign draft on-chain...");
      const budgetCredits = minVotes; // 1 credit = 1 vote count

      const taskRes = await taskApi.create({
        title,
        budget: budgetCredits,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        options: uploadedOptions,
        user_id: userId || 1, // fallback to 1
      });

      if (!taskRes.success) {
        throw new Error(taskRes.message || "Failed to create campaign draft");
      }

      const taskId = taskRes.task.id;

      // 3. Prompt user for blockchain transaction simulation to fund the campaign!
      // In a real application, you'd trigger a metamask sendTransaction.
      // We will perform the transaction using ethers and the server wallet
      setSubmissionProgress("Funding campaign escrow contract...");
      
      if (!window.ethereum) {
        throw new Error("No Ethereum browser extension found.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      // We send the funds to the backend server wallet address:
      const serverWalletAddress = process.env.NEXT_PUBLIC_SERVER_WALLET_ADDRESS || "0x8cb784B156c304291cE896AF7881F627BB4633BE";
      const txValue = ethers.parseEther(rewardEth);

      toast.loading("Please confirm the escrow funding transaction in your wallet...", { id: "create-campaign" });
      const tx = await signer.sendTransaction({
        to: serverWalletAddress,
        value: txValue,
      });

      setSubmissionProgress("Waiting for transaction confirmation on-chain...");
      await tx.wait();

      // 4. Notify backend of transaction success to activate task
      setSubmissionProgress("Activating campaign on backend...");
      await taskApi.fund(taskId, tx.hash);

      setCreatedTaskId(taskId);
      toast.success("Campaign created and funded successfully!", { id: "create-campaign" });
      setStep(4); // Success step
    } catch (err: any) {
      console.error("Task creation error:", err);
      toast.error(err?.message || "Failed to create or fund campaign", { id: "create-campaign" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0a0a0f] text-zinc-100">
      <WalletGuard>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col items-center select-none">
          {/* Progress Indicators */}
          {step < 4 && (
            <div className="w-full max-w-2xl mb-12 flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-800 -translate-y-1/2 -z-10" />
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-purple-500 -translate-y-1/2 -z-10 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    step >= 1 ? "bg-purple-700 text-white border-purple-500" : "bg-zinc-950 text-zinc-500 border-zinc-800"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2">Details</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    step >= 2 ? "bg-purple-700 text-white border-purple-500" : "bg-zinc-950 text-zinc-500 border-zinc-800"
                  }`}
                >
                  <Image className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2">Uploads</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    step >= 3 ? "bg-purple-700 text-white border-purple-500" : "bg-zinc-950 text-zinc-500 border-zinc-800"
                  }`}
                >
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2">Confirm</span>
              </div>
            </div>
          )}

          {/* Core Multi-step Layout with Sidebar */}
          {step < 4 ? (
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
              
              {/* Form Side */}
              <div className="w-full lg:max-w-2xl border border-zinc-800 bg-[#111118]/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                
                {/* Step 1: Details */}
                {step === 1 && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold text-white mb-2">Campaign Details</h2>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                        Campaign Title (max 80 chars)
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                        placeholder="e.g. Which label, category, design, or option should we choose?"
                        className="bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-zinc-500 self-end font-mono">
                        {title.length}/80
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                        Context / Instructions (max 300 chars)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                        rows={4}
                        placeholder="Explain the context, decision criteria, and what workers should consider when labeling or choosing..."
                        className="bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                      />
                      <span className="text-[10px] text-zinc-500 self-end font-mono">
                        {description.length}/300
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                        Minimum Voters Required
                      </label>
                      <input
                        type="number"
                        value={minVotes}
                        onChange={(e) => setMinVotes(Math.max(5, Math.min(500, Number(e.target.value))))}
                        className="bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-zinc-500 leading-normal">
                        Select between 5 and 500 voters. Higher budgets prompt faster, high-fidelity signals.
                      </span>
                    </div>

                    <button
                      onClick={handleNext}
                      className="mt-4 bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                    >
                      Next: Upload options
                    </button>
                  </div>
                )}

                {/* Step 2: Uploads */}
                {step === 2 && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold text-white mb-2">Upload Options</h2>
                    
                    <ThumbnailUploader onFilesChange={setThumbnails} />

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={handleBack}
                        className="flex-1 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-semibold text-sm py-3 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                      >
                        Next: Set Reward
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirm & Budget */}
                {step === 3 && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold text-white mb-2">Confirm & Stake</h2>
                    
                    {/* ETH Reward Stake */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                        Sepolia ETH Reward Pool
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-500 font-bold">Ξ</span>
                          <input
                            type="number"
                            step="0.001"
                            value={rewardEth}
                            onChange={(e) => setRewardEth(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 font-mono">
                          ~ ${usdEstimate} USD
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-normal">
                        Staked pool split equally among winning options voters. (Note: {minVotes} credits will be funded, each equivalent to 0.001 ETH).
                      </span>
                    </div>

                    {isSubmitting ? (
                      <div className="flex flex-col items-center justify-center py-6 gap-3">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        <span className="text-xs font-semibold text-purple-400 font-mono">{submissionProgress}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={handleBack}
                          className="flex-1 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-semibold text-sm py-3 rounded-xl transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                        >
                          Confirm & Pay
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Sticky Panel */}
              <div className="hidden lg:block w-[280px] border border-zinc-800 bg-[#111118]/80 backdrop-blur-md rounded-2xl p-5 shadow-xl sticky top-24">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Campaign Summary</h3>
                
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Title</span>
                    <span className="text-zinc-300 line-clamp-2 leading-relaxed">
                      {title || <span className="italic text-zinc-600">Draft Title</span>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Options</span>
                    <span className="text-zinc-300 font-semibold">{thumbnails.length} variations</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Min Voters</span>
                    <span className="text-zinc-300 font-semibold font-mono">{minVotes}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Reward Stake</span>
                    <span className="text-amber-500 font-bold font-mono">Ξ {rewardEth} ETH</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Step 4: Success View */
            <div className="w-full max-w-md border border-zinc-800 bg-[#111118]/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              
              <div className="inline-flex p-4 rounded-full bg-emerald-950/40 text-emerald-400 mb-6 border border-emerald-500/20 shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">🎉 Campaign Created!</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                Your labeling campaign has been initialized and funded in the smart escrow contract. Workers can start voting now.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/tasks/${createdTaskId}`}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                >
                  View Live Analytics
                </Link>
                <Link
                  href="/dashboard"
                  className="border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-semibold text-sm py-3 rounded-xl transition-all"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </main>
      </WalletGuard>
    </div>
  );
}
