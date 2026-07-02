"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ThumbnailUploaderProps {
  onFilesChange: (files: File[]) => void;
}

export function ThumbnailUploader({ onFilesChange }: ThumbnailUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const updatedFiles = [...files, ...acceptedFiles];

      if (updatedFiles.length > 10) {
        setError("You can upload a maximum of 10 option files.");
        return;
      }

      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const removeFile = (index: number) => {
    setError(null);
    const updatedFiles = files.filter((_, i) => i !== index);
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  useEffect(() => {
    // Generate object URLs for previewing images
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Cleanup URLs on unmount
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
    minSize: 0,
    multiple: true,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-purple-500 bg-purple-950/10"
            : "border-zinc-800 bg-[#111118]/60 hover:border-zinc-700"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-white">
              {isDragActive ? "Drop files here" : "Drag & drop option files here"}
            </p>
            <p className="text-zinc-400 text-xs">
              Supports JPEG, PNG, WEBP (Min 2, Max 10 option files)
            </p>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/10 border border-red-900/30 text-red-400 rounded-lg text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative aspect-video border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950"
            >
              <Image
                src={preview}
                alt={`Option preview ${index + 1}`}
                fill
                className="object-cover"
              />
              {/* Hover Delete Action */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-semibold text-zinc-300">
                Option #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
