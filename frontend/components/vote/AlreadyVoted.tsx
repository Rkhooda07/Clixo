"use client";

import React from "react";
import Image from "next/image";
import { Thumbnail } from "@/types";
import { Check } from "lucide-react";

interface AlreadyVotedProps {
  votedOption: Thumbnail | undefined;
  options: Thumbnail[];
  totalVotes: number;
}

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";

export function AlreadyVoted({
  votedOption,
  options,
  totalVotes,
}: AlreadyVotedProps) {
  const votedSrc =
    votedOption?.gateway_url || votedOption?.image_url || "";

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "var(--text-3)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Vote Recorded
        </div>
        <h2
          style={{
            fontFamily: geist,
            fontSize: "24px",
            fontWeight: 500,
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Your vote is locked in.
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "13px",
            color: "var(--text-2)",
            marginTop: "8px",
            lineHeight: 1.6,
          }}
        >
          You'll earn ETH once this task closes and votes are settled.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--line)" }} />

      {/* Content: voted image + standings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Your selection */}
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Your Selection
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: "3px",
              overflow: "hidden",
              border: "1px solid var(--text-1)",
            }}
          >
            {votedSrc ? (
              <Image
                src={votedSrc}
                alt="Your selected thumbnail"
                fill
                sizes="50vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--text-3)",
                }}
              >
                no image
              </div>
            )}
            {/* Voted badge */}
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
              }}
            >
              <Check size={9} color="var(--text-1)" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Current standings */}
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Current Standings
          </div>
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--line)",
              borderRadius: "5px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {options.map((opt, i) => {
              const pct =
                totalVotes > 0
                  ? Math.round(((opt.votes || 0) / totalVotes) * 100)
                  : 0;
              const isMyVote = opt.id === votedOption?.id;

              return (
                <div key={opt.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: "10px",
                        color: isMyVote ? "var(--text-1)" : "var(--text-3)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Option {String.fromCharCode(65 + i)}
                      {isMyVote && " ·  your vote"}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: "11px",
                        color: isMyVote ? "var(--text-1)" : "var(--text-3)",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "2px",
                      background: "var(--line)",
                      borderRadius: "1px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: isMyVote ? "var(--text-1)" : "var(--text-3)",
                        transition: "width 0.5s ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Totals */}
            <div
              style={{
                paddingTop: "12px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "var(--text-3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Total votes
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: "var(--text-2)",
                }}
              >
                {totalVotes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
