import Link from "next/link";
import { LiveStats } from "@/components/home/LiveStats";

const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--ink)" }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100dvh - 52px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Two-column layout: content left, mockup right (desktop only) */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center">

          {/* Left: headline content */}
          <div className="flex-1 flex flex-col justify-center px-6 md:flex-none md:w-1/2 md:pl-[14%] md:pr-16">
            {/* 1. Label */}
            <div
              style={{
                borderLeft: "1px solid var(--line)",
                paddingLeft: "12px",
                fontFamily: mono,
                fontSize: "11px",
                color: "var(--text-3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              Thumbnail Testing · Powered by Ethereum
            </div>

            {/* 2. Headline */}
            <h1
              style={{
                fontFamily: geist,
                fontSize: "clamp(44px, 5.5vw, 72px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              <span style={{ color: "var(--text-1)", display: "block" }}>
                Which thumbnail
              </span>
              <span style={{ color: "var(--text-2)", display: "block" }}>
                actually works?
              </span>
            </h1>

            {/* 3. Subtext */}
            <p
              style={{
                fontSize: "13px",
                fontFamily: inter,
                color: "var(--text-2)",
                maxWidth: "400px",
                marginTop: "20px",
                lineHeight: 1.6,
              }}
            >
              Upload options. Stake ETH. Get real votes. Know before you publish.
            </p>

            {/* 4. CTAs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginTop: "32px",
              }}
            >
              <Link
                href="/create-task"
                className="transition-opacity hover:opacity-85"
                style={{
                  background: "var(--text-1)",
                  color: "var(--ink)",
                  fontSize: "13px",
                  fontFamily: geist,
                  fontWeight: 500,
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  display: "inline-block",
                }}
              >
                Create a Task
              </Link>

              <Link
                href="/browse"
                className="transition-colors hover:text-hi"
                style={{
                  color: "var(--text-2)",
                  fontSize: "13px",
                  padding: "10px 0",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Browse Tasks →
              </Link>
            </div>

            {/* 5. Live stats */}
            <div style={{ marginTop: "64px" }}>
              <LiveStats />
            </div>
          </div>

          {/* Right: mini results mockup — desktop only */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center pr-[10%]">
            <MiniResultsCard />
          </div>

        </div>

        {/* Bottom border + scroll indicator */}
        <div>
          <div style={{ height: "1px", background: "var(--line)" }} />
          <div
            style={{
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              color: "var(--text-3)",
              userSelect: "none",
            }}
          >
            ↓
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0", background: "var(--ink)" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 40px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              color: "var(--text-3)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "48px",
            }}
          >
            Process
          </div>

          {/* 3-column grid — stacks to 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Upload",
                body: "Upload 2 to 10 thumbnail options. Add context so voters understand what the video is about. Stake ETH as the reward.",
              },
              {
                n: "02",
                title: "Vote",
                body: "Workers browse open tasks and pick the thumbnail they'd click on. No vote counts shown until after they submit — no anchoring bias.",
              },
              {
                n: "03",
                title: "Earn",
                body: "Task closes when minimum votes are hit. The creator sees ranked results. Workers split the staked ETH proportionally.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className={i > 0 ? "pt-10 md:pt-0" : ""}
                style={{
                  paddingLeft: "40px",
                  paddingRight: "40px",
                  borderLeft: i > 0 ? "1px solid var(--line)" : "none",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                    color: "var(--text-3)",
                    marginBottom: "24px",
                  }}
                >
                  {step.n}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Geist, system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "var(--text-1)",
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "13px",
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                    maxWidth: "200px",
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniResultsCard() {
  const options = [
    { label: "Option A", pct: 64, votes: 8, winner: true },
    { label: "Option B", pct: 36, votes: 5, winner: false },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "320px",
        background: "var(--surface-1)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "20px",
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: "var(--text-3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        Task #42 · Closed
      </div>
      <div
        style={{
          fontFamily: geist,
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--text-1)",
          letterSpacing: "-0.01em",
          marginBottom: "20px",
          lineHeight: 1.3,
        }}
      >
        Which thumbnail gets more clicks?
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
        {options.map((opt) => (
          <div key={opt.label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Thumbnail placeholder */}
                <div
                  style={{
                    width: "36px",
                    height: "22px",
                    background: "var(--surface-2)",
                    border: `1px solid ${opt.winner ? "var(--text-1)" : "var(--line)"}`,
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "11px",
                    color: opt.winner ? "var(--text-1)" : "var(--text-2)",
                  }}
                >
                  {opt.label}
                </span>
              </div>
              {opt.winner ? (
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "var(--green)",
                    letterSpacing: "0.06em",
                  }}
                >
                  WINNER
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "var(--text-3)",
                  }}
                >
                  {opt.pct}%
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: "3px",
                background: "var(--line)",
                borderRadius: "1px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${opt.pct}%`,
                  background: opt.winner ? "var(--text-1)" : "var(--text-3)",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "var(--text-3)",
                marginTop: "4px",
              }}
            >
              {opt.votes} votes
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          height: "1px",
          background: "var(--line)",
          marginBottom: "12px",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "var(--text-3)",
          }}
        >
          Reward distributed
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--amber)",
          }}
        >
          Ξ 0.013 ETH
        </span>
      </div>
    </div>
  );
}
