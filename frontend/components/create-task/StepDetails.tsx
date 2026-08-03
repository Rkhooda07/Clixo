"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CharCount, FieldLabel } from "./Field";

interface StepDetailsProps {
  title: string;
  description: string;
  minVotes: number;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMinVotesChange: (value: number) => void;
  onNext: () => void;
}

export function StepDetails({
  title,
  description,
  minVotes,
  onTitleChange,
  onDescriptionChange,
  onMinVotesChange,
  onNext,
}: StepDetailsProps) {
  return (
    <>
      <h2 className="text-base font-medium text-hi">Task Details</h2>

      <div>
        <FieldLabel>What&apos;s your question or decision?</FieldLabel>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Which logo feels more trustworthy?"
        />
        <CharCount current={title.length} max={80} />
      </div>

      <div>
        <FieldLabel>Give people context</FieldLabel>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          placeholder="What should contributors know before giving their opinion? The more context, the better the answers."
        />
        <CharCount current={description.length} max={300} />
      </div>

      <div>
        <FieldLabel>How many opinions do you need?</FieldLabel>
        <Input
          type="number"
          value={minVotes}
          onChange={(e) => onMinVotesChange(Number(e.target.value))}
          min={5}
          max={500}
        />
        <p className="mt-1.5 text-xs leading-normal text-dim">
          5–500 opinions. More opinions produce a stronger signal.
        </p>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={onNext}>
        Next: Add your options →
      </Button>
    </>
  );
}
