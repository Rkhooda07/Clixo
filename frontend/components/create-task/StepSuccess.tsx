import React from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/buttonVariants";

interface StepSuccessProps {
  taskId: number | null;
}

export function StepSuccess({ taskId }: StepSuccessProps) {
  return (
    <div className="mx-auto max-w-[480px] pt-10 text-center">
      <CircleCheck size={40} strokeWidth={1.5} className="mx-auto mb-4 text-green" aria-hidden />
      <div className="eyebrow mb-4">Task Posted</div>
      <h2 className="mb-3 text-2xl">Task posted.</h2>
      <p className="mb-8 text-[13px] leading-relaxed text-lo">
        Contributors can now give their opinions and earn your staked ETH reward.
      </p>

      <div className="flex flex-col gap-2.5">
        <Link
          href={`/tasks/${taskId}`}
          className={buttonVariants({ variant: "primary", size: "lg" })}
        >
          View Task →
        </Link>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Back to Dashboard →
        </Link>
      </div>
    </div>
  );
}
