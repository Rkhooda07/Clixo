"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldLabel } from "./Field";

interface StepReviewProps {
  rewardEth: string;
  usdEstimate: string;
  minVotes: number;
  ethPerCredit: number;
  isSubmitting: boolean;
  submissionProgress: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReview({
  rewardEth,
  usdEstimate,
  minVotes,
  ethPerCredit,
  isSubmitting,
  submissionProgress,
  onBack,
  onSubmit,
}: StepReviewProps) {
  return (
    <>
      <h2 className="text-base font-medium text-hi">Set your reward</h2>

      <div>
        <FieldLabel>ETH reward for contributors</FieldLabel>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-amber"
              aria-hidden
            >
              Ξ
            </span>
            <Input
              type="number"
              step="0.001"
              value={rewardEth}
              readOnly
              aria-label="ETH reward"
              className="pl-7 font-mono text-amber"
            />
          </div>
          <div className="shrink-0 whitespace-nowrap rounded-md border border-line bg-surface px-3.5 py-2 font-mono text-xs text-dim">
            ~${usdEstimate}
          </div>
        </div>
        <p className="mt-1.5 text-xs leading-normal text-dim">
          {minVotes} opinions × {ethPerCredit.toFixed(3)} ETH. Split equally among
          winning-option contributors at close.
        </p>
      </div>

      {isSubmitting && (
        <div className="font-mono text-[10px] tracking-[0.08em] text-dim" role="status">
          {submissionProgress}
        </div>
      )}

      <div className="flex gap-2.5">
        <Button variant="ghost" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={onSubmit}
          loading={isSubmitting}
        >
          Post Task &amp; Stake ETH
        </Button>
      </div>
    </>
  );
}
