"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Thumbnail } from "@/types";
import { Check } from "lucide-react";

interface ThumbnailGalleryProps {
  options: Thumbnail[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function ThumbnailItem({
  option,
  isSelected,
  onClick,
}: {
  option: Thumbnail;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const src = option.gateway_url || option.image_url || "";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        borderRadius: "3px",
        overflow: "hidden",
        border: `1px solid ${
          isSelected ? "var(--text-1)" : hovered ? "var(--text-3)" : "var(--line)"
        }`,
        cursor: "pointer",
        transition: "border-color 0.1s",
        flexShrink: 0,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt="Thumbnail option"
          fill
          sizes="(max-width: 768px) 50vw, 30vw"
          style={{
            objectFit: "cover",
            filter: isSelected || hovered ? "brightness(1.0)" : "brightness(0.85)",
            transition: "filter 0.15s",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-2)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "var(--text-3)",
          }}
        >
          no image
        </div>
      )}

      {/* Selected checkmark — top-left, 16px circle */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Check size={9} color="var(--text-1)" strokeWidth={3} />
        </div>
      )}
    </div>
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
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "8px",
      }}
    >
      {options.map((option) => (
        <ThumbnailItem
          key={option.id}
          option={option}
          isSelected={selectedId === option.id}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}
