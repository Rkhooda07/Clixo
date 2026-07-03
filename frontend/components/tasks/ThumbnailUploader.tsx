"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import Image from "next/image";

interface ThumbnailUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const mono = "JetBrains Mono, monospace";
const inter = "Inter, system-ui, sans-serif";

export function ThumbnailUploader({ onFilesChange }: ThumbnailUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dropHovered, setDropHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const updatedFiles = [...files, ...acceptedFiles];
      if (updatedFiles.length > 10) {
        setError("Maximum 10 option files.");
        return;
      }
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const removeFile = (index: number) => {
    setError(null);
    URL.revokeObjectURL(previews[index]);
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        onMouseEnter={() => setDropHovered(true)}
        onMouseLeave={() => setDropHovered(false)}
        style={{
          border: `1px dashed ${isDragActive ? "var(--text-3)" : dropHovered ? "var(--text-3)" : "var(--line)"}`,
          borderRadius: "5px",
          padding: "32px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragActive ? "var(--surface-2)" : "transparent",
          transition: "border-color 0.1s, background 0.1s",
        }}
      >
        <input {...getInputProps()} />
        <div
          style={{
            fontFamily: inter,
            fontSize: "13px",
            color: "var(--text-2)",
            marginBottom: "4px",
          }}
        >
          {isDragActive ? "Drop files here" : "Drag & drop image files here"}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "var(--text-3)",
            letterSpacing: "0.04em",
          }}
        >
          JPEG · PNG · WEBP — min 2, max 10 files
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--red)",
            padding: "8px 12px",
            border: "1px solid var(--red)",
            borderRadius: "5px",
            letterSpacing: "0.02em",
            opacity: 0.85,
          }}
        >
          {error}
        </div>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "10px",
          }}
        >
          {previews.map((preview, index) => (
            <PreviewItem
              key={index}
              src={preview}
              index={index}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewItem({
  src,
  index,
  onRemove,
}: {
  src: string;
  index: number;
  onRemove: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", aspectRatio: "16 / 9" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "3px",
          overflow: "hidden",
          border: "1px solid var(--line)",
        }}
      >
        <Image
          src={src}
          alt={`Option ${index + 1}`}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Index label */}
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          left: "6px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          color: "var(--text-3)",
          letterSpacing: "0.04em",
          background: "rgba(12,12,14,0.7)",
          padding: "2px 5px",
          borderRadius: "2px",
        }}
      >
        {index + 1}
      </div>

      {/* Remove button — appears on hover */}
      {hovered && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--ink)",
            border: "1px solid var(--line)",
            borderRadius: "3px",
            cursor: "pointer",
            color: "var(--text-2)",
            padding: 0,
          }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
