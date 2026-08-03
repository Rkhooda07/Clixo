"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ThumbnailUploader } from "@/components/tasks/ThumbnailUploader";

interface StepOptionsProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepOptions({ files, onFilesChange, onBack, onNext }: StepOptionsProps) {
  return (
    <>
      <h2 className="text-base font-medium text-hi">Add your options</h2>
      <p className="text-[13px] leading-normal text-lo">
        Upload images, screenshots, mockups — or skip to Step 3 if your options are text-based.
      </p>

      <ThumbnailUploader initialFiles={files} onFilesChange={onFilesChange} />

      <div className="flex gap-2.5">
        <Button variant="ghost" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={onNext}>
          Next: Review &amp; confirm →
        </Button>
      </div>
    </>
  );
}
