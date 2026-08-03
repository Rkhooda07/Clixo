"use client";

import React from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Thumbnail } from "@/types";
import { cn } from "@/lib/utils";

interface ThumbnailGalleryProps {
  options: Thumbnail[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function ThumbnailItem({
  option,
  index,
  isSelected,
  hasAnySelection,
  onSelect,
}: {
  option: Thumbnail;
  index: number;
  isSelected: boolean;
  hasAnySelection: boolean;
  onSelect: () => void;
}) {
  const shouldReduce = useReducedMotion();
  const src = option.gateway_url || option.image_url || "";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`Option ${index + 1}`}
      onClick={onSelect}
      className={cn(
        "group relative aspect-video shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-colors duration-100",
        isSelected ? "border-hi" : "border-line hover:border-dim"
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 30vw"
          className={cn(
            "object-cover transition-[filter] duration-150",
            hasAnySelection &&
              !isSelected &&
              "brightness-75 group-hover:brightness-100"
          )}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-raised font-mono text-[10px] text-dim">
          no image
        </span>
      )}

      {/* Selected checkmark — top-left, 16px circle */}
      {isSelected && (
        <m.span
          initial={shouldReduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink"
          aria-hidden="true"
        >
          <Check size={9} strokeWidth={3} className="text-hi" />
        </m.span>
      )}
    </button>
  );
}

export function ThumbnailGallery({
  options,
  selectedId,
  onSelect,
}: ThumbnailGalleryProps) {
  const cols = options.length > 4 ? 3 : 2;

  return (
    <div
      role="radiogroup"
      aria-label="Voting options"
      className={cn(
        "grid grid-cols-2 gap-2",
        cols === 3 && "md:grid-cols-3"
      )}
    >
      {options.map((option, index) => (
        <ThumbnailItem
          key={option.id}
          option={option}
          index={index}
          isSelected={selectedId === option.id}
          hasAnySelection={selectedId !== null}
          onSelect={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}
