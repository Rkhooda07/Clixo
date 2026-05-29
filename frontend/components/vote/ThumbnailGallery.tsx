"use client";

import React, { useState } from "react";
import { Thumbnail } from "@/types";
import { Check, Loader2 } from "lucide-react";

interface ThumbnailGalleryProps {
  options: Thumbnail[];
  onVote: (optionId: number) => Promise<void>;
}

export function ThumbnailGallery({ options, onVote }: ThumbnailGalleryProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (selectedId === null) return;
    setIsSubmitting(true);
    try {
      await onVote(selectedId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
              selectedId === option.id
                ? "border-purple-500 shadow-2xl shadow-purple-900/40 scale-[1.02]"
                : "border-zinc-800 hover:border-zinc-600 grayscale-[0.3] hover:grayscale-0"
            }`}
          >
            <div className="aspect-video relative">
              <img
                src={option.gateway_url || option.image_url || ""}
                alt="Task option"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {selectedId === option.id && (
                <div className="absolute inset-0 bg-purple-600/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-purple-500 text-white p-3 rounded-full shadow-2xl animate-in zoom-in duration-300">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-4 transition-colors ${
              selectedId === option.id ? "bg-purple-900/20" : "bg-zinc-900/80"
            }`}>
              <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
                {selectedId === option.id ? "Selected Option" : "Click to select"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleVote}
          disabled={selectedId === null || isSubmitting}
          className={`px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center gap-3 ${
            selectedId !== null && !isSubmitting
              ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-purple-900/40"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Recording Vote...
            </>
          ) : (
            "Submit Final Vote"
          )}
        </button>
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
          Votes are permanent and secured by the blockchain
        </p>
      </div>
    </div>
  );
}
