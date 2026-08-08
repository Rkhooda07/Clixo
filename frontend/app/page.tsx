import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LiveStats } from "@/components/home/LiveStats";
import { HeroParticles } from "@/components/home/HeroParticles";
import { HeroBallot } from "@/components/home/HeroBallot";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/buttonVariants";

const STEPS = [
  {
    n: "01",
    title: "Post",
    body: "Write your question or upload your options — images, concepts, ideas, designs. Add context so voters understand what they're judging. Set your ETH reward.",
  },
  {
    n: "02",
    title: "Vote",
    body: "Contributors browse open tasks and share their honest opinion. No results shown before they vote — every answer is independent.",
  },
  {
    n: "03",
    title: "Earn",
    body: "Task closes when the vote target is hit. The task poster sees ranked results and the winning option. Contributors split the ETH reward.",
  },
] as const;

const CARDS = [
  {
    eyebrow: "POST A TASK",
    title: "Stop guessing what people want.",
    body: "Post your question, upload your options, and get real crowd opinions in hours. Works for product ideas, creative decisions, startup validation — anything that needs honest human judgment.",
    bullets: [
      "Real opinions, not algorithmic predictions",
      "Know before you build, launch, or publish",
      "Any question, any format, any industry",
    ],
    cta: { label: "Post a Task", href: "/create-task" },
  },
  {
    eyebrow: "EARN ETH",
    title: "Get paid for your opinion.",
    body: "Browse open tasks. Give your honest take. Earn ETH when the task closes — no staking, no lock-ups, no crypto expertise required. Just your judgment.",
    bullets: [
      "No minimum time commitment",
      "Earn ETH for every opinion you give",
      "Paid out automatically on task close",
    ],
    cta: { label: "Browse Tasks", href: "/browse" },
  },
] as const;

export default function LandingPage() {
  return (
    <div className="bg-ink">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden min-h-0 md:min-h-[calc(100dvh-52px)]">
        {/* Graph-paper grid, fading toward the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--line-subtle) 0, var(--line-subtle) 1px, transparent 1px, transparent 72px), repeating-linear-gradient(90deg, var(--line-subtle) 0, var(--line-subtle) 1px, transparent 1px, transparent 72px)",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 60% 40%, black 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 60% 40%, black 30%, transparent 78%)",
          }}
        />
        {/* Soft amber glow behind the mockup */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full hidden md:block"
          style={{
            background:
              "radial-gradient(circle, rgba(232,160,32,0.055), transparent 65%)",
          }}
        />

        {/* Cursor-reactive grain field — gathers around the cursor, drifts home */}
        <HeroParticles />

        <div className="relative flex-1 flex flex-col md:flex-row md:items-stretch">
          {/* Left: headline content */}
          <div className="flex-1 flex flex-col justify-center pt-12 pb-12 md:pb-0 px-6 md:flex-none md:w-[55%] md:pl-[11%] md:pr-12">
            <div className="animate-fade-up border-l border-line pl-3 font-mono text-[11px] text-dim tracking-[0.1em] uppercase mb-7">
              Opinion Market · Powered by Ethereum
            </div>

            <h1 className="font-display font-medium tracking-[-0.03em] leading-[1.08] text-[clamp(38px,4.2vw,58px)] m-0">
              <span className="animate-fade-up [animation-delay:60ms] block text-hi">
                What does the crowd
              </span>
              <span className="animate-fade-up [animation-delay:120ms] block text-lo">
                actually think?
              </span>
            </h1>

            <p className="animate-fade-up [animation-delay:180ms] text-[13px] text-lo max-w-[400px] mt-5 leading-relaxed">
              Post anything that needs real opinions. Stake ETH. Get answers
              from real people who get paid to give a damn.
            </p>

            <div className="animate-fade-up [animation-delay:240ms] flex items-center gap-5 mt-8">
              <Link
                href="/create-task"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "group",
                })}
              >
                Post a Task
                <ArrowRight
                  size={15}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/browse"
                className="group inline-flex items-center gap-1.5 py-2.5 text-[13px] text-lo transition-colors duration-150 hover:text-hi"
              >
                Start Earning
                <ArrowRight
                  size={14}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="animate-fade-up [animation-delay:300ms] mt-16">
              <LiveStats />
            </div>
          </div>

          {/* Right: playable ballot in a full-height panel. Shown on mobile
              too — it is the only place the product can be experienced without
              a wallet, and most inbound traffic is a phone. */}
          <div className="flex md:w-[45%] flex-col border-t md:border-t-0 md:border-l border-line">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-5 lg:px-8">
              <span className="eyebrow">Try it</span>
              <span className="eyebrow">Sample task</span>
            </div>

            <div className="flex flex-1 items-center justify-center px-5 py-8 lg:px-8">
              <HeroBallot />
            </div>

            <div className="flex h-11 shrink-0 items-center border-t border-line px-5 lg:px-8">
              <span className="eyebrow">Blind voting · Settled on Sepolia</span>
            </div>
          </div>
        </div>

        {/* Bottom rule + scroll hint */}
        <div className="relative">
          <div className="h-px bg-line" />
          <div className="flex h-8 items-center justify-center gap-1.5 select-none">
            <span className="eyebrow">Scroll</span>
            <ChevronDown size={12} className="text-dim animate-scroll-hint" />
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-[52px] py-24 bg-ink">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="eyebrow tracking-[0.15em] mb-12">Process</div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 0.1}
                className={
                  i > 0
                    ? "border-t border-line pt-10 mt-10 md:border-t-0 md:pt-0 md:mt-0 md:border-l"
                    : ""
                }
              >
                <div
                  className={`group h-full ${i === 0 ? "md:pr-10" : "md:px-10"}`}
                >
                  <div className="font-mono text-[11px] text-dim mb-6 transition-colors duration-200 group-hover:text-amber">
                    {step.n}
                  </div>
                  <h3 className="text-lg font-display font-medium tracking-[-0.02em] text-hi mb-2 mt-0">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-lo leading-[1.7] max-w-[280px] m-0">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Props ──────────────────────────────────────────────────── */}
      <section className="bg-ink px-6 md:px-12 lg:px-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => (
            <Reveal key={card.eyebrow} delay={i * 0.1} className="h-full">
              <Card interactive className="group p-8 h-full flex flex-col">
                <div className="eyebrow tracking-[0.1em]">{card.eyebrow}</div>

                <h3 className="text-[22px] font-display font-medium tracking-[-0.02em] text-hi mt-2 mb-0">
                  {card.title}
                </h3>

                <p className="text-[13px] text-lo leading-[1.7] mt-3 mb-0">
                  {card.body}
                </p>

                <div className="flex flex-col gap-2 mt-5">
                  {card.bullets.map((b) => (
                    <div key={b} className="flex gap-2 text-xs text-lo">
                      <span className="text-dim shrink-0">—</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-7">
                  <Link
                    href={card.cta.href}
                    className={buttonVariants({ variant: "primary" })}
                  >
                    {card.cta.label}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
