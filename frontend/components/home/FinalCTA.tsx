import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { buttonVariants } from "@/components/ui/buttonVariants";

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative py-24 bg-ink border-t border-amber/20">
      {/* Subtle amber glow at top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(232,160,32,0.4), transparent)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-display font-medium tracking-[-0.02em] text-hi mb-4">
            Ready to get real opinions?
          </h2>
          <p className="text-lo max-w-xl mx-auto text-[15px] leading-relaxed mb-10">
            Post your first task in 2 minutes. Or start earning ETH by voting on open tasks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Reveal delay={0.1}>
              <Link
                href="/create-task"
                className={buttonVariants({ variant: "primary", size: "lg", className: "group w-full sm:w-auto" })}
              >
                Post a Task
                <ArrowRight
                  size={15}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/browse"
                className={buttonVariants({ variant: "outline", size: "lg", className: "group w-full sm:w-auto" })}
              >
                Browse Tasks
                <ArrowRight
                  size={15}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-8">
            <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-dim">
              Sepolia testnet · No real funds at risk
            </p>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}