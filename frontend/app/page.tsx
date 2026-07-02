import Link from "next/link";
import { LiveStats } from "@/components/home/LiveStats";

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
        {/* Content block — 20% from left on desktop, full-bleed mobile */}
        <div
          className="flex-1 flex flex-col justify-center px-6 md:pl-[20%] md:pr-20"
        >
          {/* 1. Label */}
          <div
            style={{
              borderLeft: "1px solid var(--line)",
              paddingLeft: "12px",
              fontFamily: "JetBrains Mono, monospace",
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
              fontFamily: "Geist, system-ui, sans-serif",
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
              fontFamily: "Inter, system-ui, sans-serif",
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
                fontFamily: "Geist, system-ui, sans-serif",
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

          {/* 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
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
                style={{
                  padding: "0 40px",
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
