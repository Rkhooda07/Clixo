"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThumbnailUploaderProps {
  initialFiles?: File[];
  onFilesChange: (files: File[]) => void;
}

interface UploadEntry {
  id: string;
  file: File;
}

const toEntry = (file: File): UploadEntry => ({ id: crypto.randomUUID(), file });

export function ThumbnailUploader({ initialFiles, onFilesChange }: ThumbnailUploaderProps) {
  const [entries, setEntries] = useState<UploadEntry[]>(() => (initialFiles ?? []).map(toEntry));
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const next = [...entries, ...acceptedFiles.map(toEntry)];
      if (next.length > 10) {
        setError("Maximum 10 option files.");
        return;
      }
      setEntries(next);
      onFilesChange(next.map((e) => e.file));
    },
    [entries, onFilesChange]
  );

  const removeEntry = (id: string) => {
    setError(null);
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    onFilesChange(next.map((e) => e.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <div
        {...getRootProps({
          className: cn(
            "cursor-pointer rounded-lg border border-dashed border-line px-6 py-8 text-center transition-colors duration-150 hover:border-dim",
            isDragActive && "border-dim bg-raised"
          ),
        })}
      >
        <input {...getInputProps()} />
        <Upload size={16} className="mx-auto mb-2 text-dim" aria-hidden />
        <p className="mb-1 text-[13px] text-lo">
          {isDragActive ? "Drop files here" : "Drop your option images here or click to browse"}
        </p>
        <p className="font-mono text-[10px] tracking-[0.04em] text-dim">
          2 to 10 options · JPG, PNG, or WebP
        </p>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-red/60 px-3 py-2 font-mono text-[11px] tracking-[0.02em] text-red"
        >
          {error}
        </p>
      )}

      {/* Preview grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
          <AnimatePresence initial={false}>
            {entries.map((entry, index) => (
              <m.div
                key={entry.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.18 }}
              >
                <PreviewItem
                  file={entry.file}
                  index={index}
                  onRemove={() => removeEntry(entry.id)}
                />
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function PreviewItem({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  // One object URL per file, revoked exactly once on cleanup.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="group relative aspect-video">
      <div className="absolute inset-0 overflow-hidden rounded-sm border border-line">
        {src && <Image src={src} alt={`Option ${index + 1}`} fill className="object-cover" />}
      </div>

      {/* Index label */}
      <span className="absolute bottom-1 left-1.5 rounded-xs bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] text-lo">
        {index + 1}
      </span>

      {/* Remove button — appears on hover / keyboard focus */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove option ${index + 1}`}
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm border border-line bg-ink text-lo opacity-0 transition-opacity duration-150 hover:text-hi focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X size={11} />
      </button>
    </div>
  );
}
