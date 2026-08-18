import { EyeOff, Shield, Wallet, GitBranch, Users, Lock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

const SIGNALS = [
  {
    icon: EyeOff,
    title: "Blind Voting",
    description: "Results stay hidden until you vote. No herd bias, no influence — just your honest take.",
  },
  {
    icon: Shield,
    title: "On-Chain Settlement",
    description: "Every vote and payout settles on Sepolia. Verifiable, transparent, tamper-proof.",
  },
  {
    icon: Wallet,
    title: "No Staking Required",
    description: "Earn ETH for voting. No lock-ups, no minimums, no crypto expertise needed.",
  },
  {
    icon: GitBranch,
    title: "Open Source",
    description: "Full codebase on GitHub. Audit the contracts, verify the frontend, fork if you want.",
  },
  {
    icon: Users,
    title: "Sybil Resistant",
    description: "Wallet-gated voting — one wallet, one vote per task. No bot farms, no fake accounts.",
  },
  {
    icon: Lock,
    title: "Creator Skin in the Game",
    description: "Task posters stake real ETH. If they cancel, they lose. Aligned incentives.",
  },
] as const;

export function TrustSignals() {
  return (
    <section id="trust" className="py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="eyebrow tracking-[0.15em] mb-4">WHY CLIXO</div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-display font-medium tracking-[-0.02em] text-hi mb-4 max-w-2xl">
            Built for honest opinions, not engagement farming
          </h2>
          <p className="text-lo max-w-xl text-[15px] leading-relaxed">
            Every design choice optimizes for truthful signals — not time on site, not ad impressions, not vanity metrics.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SIGNALS.map((signal, i) => (
            <Reveal key={signal.title} delay={i * 0.08} className="h-full">
              <Card interactive className="group p-6 h-full flex flex-col">
                <div className="text-amber mb-4" aria-hidden="true">
                  <signal.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-display font-medium text-hi mb-2 mt-0">
                  {signal.title}
                </h3>
                <p className="text-[13px] text-lo leading-[1.7] flex-1 m-0">
                  {signal.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}