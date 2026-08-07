"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils";

/* ── Miniature layout wireframes ──────────────────────────────────────────
   Drawn in DOM so the hero ships no image assets. Three bar weights read as
   a hierarchy against the ink well: line = body, dim = heading, lo = CTA.
   Swap any of these for a real <Image> when assets exist — nothing below
   cares what an option looks like. */

const BODY = "rounded-[1px] bg-line";
const HEAD = "rounded-[1px] bg-dim";
const CTA = "rounded-[1px] bg-lo";

function CentredHero() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5">
      <div className={cn(HEAD, "h-1 w-1/2")} />
      <div className={cn(BODY, "h-1 w-2/3")} />
      <div className={cn(BODY, "h-1 w-2/3")} />
      <div className={cn(CTA, "mt-1.5 h-2.5 w-1/3")} />
    </div>
  );
}

function SplitHero() {
  return (
    <div className="flex h-full items-center gap-2">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className={cn(HEAD, "h-1 w-full")} />
        <div className={cn(BODY, "h-1 w-4/5")} />
        <div className={cn(BODY, "h-1 w-3/5")} />
        <div className={cn(CTA, "mt-1 h-2.5 w-2/3")} />
      </div>
      <div className="h-[78%] w-[44%] rounded-xs border border-line bg-raised" />
    </div>
  );
}

function FlatPricing() {
  return (
    <div className="flex h-full items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex h-[82%] flex-1 flex-col gap-1 rounded-xs border border-line p-1.5"
        >
          <div className={cn(BODY, "h-1 w-3/4")} />
          <div className={cn(HEAD, "h-1.5 w-1/2")} />
          <div className={cn(BODY, "mt-auto h-1.5 w-full")} />
        </div>
      ))}
    </div>
  );
}

function FeaturedPricing() {
  return (
    <div className="flex h-full items-center gap-1.5">
      {[0, 1, 2].map((i) => {
        const featured = i === 1;
        return (
          <div
            key={i}
            className={cn(
              "flex flex-1 flex-col gap-1 rounded-xs border p-1.5",
              featured ? "h-full border-hi bg-raised" : "h-[70%] border-line"
            )}
          >
            <div className={cn(BODY, "h-1 w-3/4")} />
            <div className={cn(featured ? HEAD : BODY, "h-1.5 w-1/2")} />
            <div className={cn(featured ? CTA : BODY, "mt-auto h-1.5 w-full")} />
          </div>
        );
      })}
    </div>
  );
}

function SpaciousGrid() {
  return (
    <div className="grid h-full grid-cols-2 items-center gap-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 rounded-xs border border-line p-1.5"
        >
          <div className="h-8 w-full rounded-[1px] bg-raised" />
          <div className={cn(BODY, "h-1 w-3/4")} />
          <div className={cn(HEAD, "h-1 w-1/2")} />
        </div>
      ))}
    </div>
  );
}

function DenseGrid() {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5 rounded-xs border border-line p-0.5"
        >
          <div className="flex-1 rounded-[1px] bg-raised" />
          <div className={cn(BODY, "h-[3px] w-3/4")} />
        </div>
      ))}
    </div>
  );
}

/* ── Ballots ──────────────────────────────────────────────────────────────
   Illustrative splits, not live data — the panel labels itself "Sample task".
   Percentages are derived from the vote counts so the two can never drift. */

const BALLOTS = [
  {
    id: 42,
    question: "Which landing page would you actually click?",
    reward: 0.013,
    options: [
      { label: "Centred", votes: 16, art: <CentredHero /> },
      { label: "Split", votes: 9, art: <SplitHero /> },
    ],
  },
  {
    id: 47,
    question: "Which pricing table would you trust?",
    reward: 0.02,
    options: [
      { label: "Flat", votes: 9, art: <FlatPricing /> },
      { label: "Featured", votes: 21, art: <FeaturedPricing /> },
    ],
  },
  {
    id: 51,
    question: "Which product grid feels worth browsing?",
    reward: 0.008,
    options: [
      { label: "Spacious", votes: 13, art: <SpaciousGrid /> },
      { label: "Dense", votes: 9, art: <DenseGrid /> },
    ],
  },
];

const SEAL_MS = 520;
const NEXT_DELAY_MS = 1500;

export function HeroBallot() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    BALLOTS.map(() => null)
  );
  const [sealing, setSealing] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const sealTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ballot = BALLOTS[index];
  const picked = picks[index];
  const revealed = picked !== null && !sealing;

  const total = ballot.options[0].votes + ballot.options[1].votes;
  const winner = ballot.options[0].votes >= ballot.options[1].votes ? 0 : 1;
  const withCrowd = picked === winner;

  const countA = useCountUp(ballot.options[0].votes, revealed, 0, 900);
  const countB = useCountUp(ballot.options[1].votes, revealed, 0, 900);
  const counts = [countA, countB];
  const reward = useCountUp(ballot.reward, revealed, 3, 1100);

  useEffect(() => () => clearTimeout(sealTimer.current), []);

  // Hold the advance until the bars have landed, so "Next" never competes
  // with the result the visitor just asked for.
  useEffect(() => {
    if (!revealed) {
      setShowNext(false);
      return;
    }
    if (reduce) {
      setShowNext(true);
      return;
    }
    const t = setTimeout(() => setShowNext(true), NEXT_DELAY_MS);
    return () => clearTimeout(t);
  }, [revealed, reduce, index]);

  function vote(choice: number) {
    if (picked !== null) return;
    setPicks((prev) => {
      const next = [...prev];
      next[index] = choice;
      return next;
    });
    if (reduce) return;
    setSealing(true);
    sealTimer.current = setTimeout(() => setSealing(false), SEAL_MS);
  }

  function nextBallot() {
    clearTimeout(sealTimer.current);
    setSealing(false);
    setIndex((i) => (i + 1) % BALLOTS.length);
  }

  return (
    /* Every block that only appears once revealed reserves its height while
       open, so casting a vote never shifts the card in its centred panel. */
    <div className="w-full max-w-[400px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="eyebrow">
          Task #{ballot.id} · {index + 1}/{BALLOTS.length}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.12em] uppercase",
            revealed ? "text-green" : "text-amber"
          )}
        >
          {revealed ? "Closed" : "Open"}
        </span>
      </div>

      <div className="mb-4 min-h-[42px] font-display text-[15px] font-medium leading-snug tracking-[-0.01em] text-hi">
        {ballot.question}
      </div>

      <div role="group" aria-label={ballot.question} className="grid grid-cols-2 gap-3">
        {ballot.options.map((option, i) => {
          const isPick = picked === i;
          const pct = Math.round((option.votes / total) * 100);
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => vote(i)}
              /* aria-disabled, not disabled: a disabled button leaves the tab
                 order, and these hold the result the visitor just asked for.
                 vote() ignores the second click. */
              aria-disabled={picked !== null}
              aria-label={
                revealed
                  ? `${option.label}: ${pct} percent, ${option.votes} of ${total} opinions`
                  : `Vote for ${option.label}`
              }
              className={cn(
                "flex flex-col rounded-md border bg-surface p-2.5 text-left",
                "transition-[border-color,transform] duration-200",
                picked !== null ? "cursor-default" : "cursor-pointer",
                picked === null && "border-line hover:-translate-y-0.5 hover:border-dim",
                isPick ? "border-hi" : "border-line"
              )}
            >
              {/* Only the artwork recedes once a pick is in — dimming the whole
                 tile would drag its numbers under the AA floor. */}
              <div
                aria-hidden="true"
                className={cn(
                  "aspect-[4/3] w-full rounded-xs bg-ink p-2 transition-opacity duration-200",
                  picked !== null && !isPick && "opacity-45"
                )}
              >
                {option.art}
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.06em] uppercase",
                    isPick ? "text-hi" : "text-lo"
                  )}
                >
                  {option.label}
                </span>
                {revealed && i === winner && (
                  <span className="font-mono text-[9px] tracking-[0.06em] text-green">
                    TOP
                  </span>
                )}
              </div>

              {/* The empty track shows while open: there is a number here,
                 you just don't get to see it before you vote. Rendering it in
                 both states is also what keeps the card from shifting. */}
              <div className="mt-2">
                <div className="h-[3px] overflow-hidden rounded-[1px] bg-line">
                  {revealed &&
                    (reduce ? (
                      <div
                        className={cn("h-full", i === winner ? "bg-hi" : "bg-dim")}
                        style={{ width: `${pct}%` }}
                      />
                    ) : (
                      <m.div
                        className={cn("h-full", i === winner ? "bg-hi" : "bg-dim")}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-dim">
                  {revealed ? (
                    <>
                      <span>{reduce ? option.votes : counts[i]} opinions</span>
                      <span className={i === winner ? "text-lo" : undefined}>
                        {pct}%
                      </span>
                    </>
                  ) : (
                    <span>result hidden</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 h-px bg-line" />

      {/* Fixed, not min-h: the revealed verdict + reward rows are taller than
         the single hint line, and a growing footer would nudge the whole card
         inside its vertically-centred panel. */}
      <div aria-live="polite" className="h-[56px] pt-3">
        {revealed ? (
          <>
            {reduce ? (
              <VerdictLine withCrowd={withCrowd} />
            ) : (
              <m.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <VerdictLine withCrowd={withCrowd} />
              </m.div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-dim">
                Reward per winner
              </span>
              <span className="font-mono text-[11px] text-amber">
                Ξ {reduce ? ballot.reward.toFixed(3) : reward.toFixed(3)} ETH
              </span>
            </div>
          </>
        ) : (
          <p className="m-0 font-mono text-[10px] tracking-[0.06em] text-dim uppercase">
            {sealing
              ? "Sealing vote…"
              : "Pick one to see what the crowd said"}
          </p>
        )}
      </div>

      <div className="mt-2 h-8">
        {showNext && (
          <button
            type="button"
            onClick={nextBallot}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "group px-0 hover:bg-transparent",
            })}
          >
            Next task
            <ArrowRight
              size={13}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
    </div>
  );
}

/* Minority opinion still earns nothing here — the payout pool is the winning
   option only — so the copy states that plainly rather than dressing it up. */
function VerdictLine({ withCrowd }: { withCrowd: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] tracking-[0.08em] uppercase",
        withCrowd ? "text-green" : "text-amber"
      )}
    >
      {withCrowd ? "With the crowd — you'd earn" : "Contrarian — no payout"}
    </span>
  );
}
