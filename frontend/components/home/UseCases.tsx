"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { ArrowRight, Rocket, Palette, Megaphone, PenTool, Layout, DollarSign, Lightbulb, Target } from "lucide-react";
import Link from "next/link";

interface UseCaseScenario {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  questions: string[];
  benefits: string[];
  cta: { label: string; href: string };
}

const USE_CASES: Record<string, UseCaseScenario[]> = {
  founders: [
    {
      icon: Rocket,
      title: "Validate Before You Build",
      questions: [
        "Which problem is worth solving?",
        "What pricing model converts?",
        "Which feature drives retention?",
      ],
      benefits: [
        "Avoid months of wasted dev time",
        "Real users, not hypothetical surveys",
        "Data to convince investors/cofounders",
      ],
      cta: { label: "Post a Validation Task", href: "/create-task" },
    },
    {
      icon: Target,
      title: "Test Go-to-Market Decisions",
      questions: [
        "Which landing page headline wins?",
        "What positioning resonates?",
        "Which channel should we prioritize?",
      ],
      benefits: [
        "Crowd wisdom beats internal debates",
        "Fast feedback loop (hours, not weeks)",
        "Quantifiable signal for stakeholders",
      ],
      cta: { label: "Browse Marketing Tasks", href: "/browse" },
    },
  ],
  designers: [
    {
      icon: Palette,
      title: "Pick the Winning Design",
      questions: [
        "Which visual direction feels premium?",
        "Light vs dark — what do users prefer?",
        "Which icon set communicates better?",
      ],
      benefits: [
        "End subjective design debates",
        "Real preference data, not Dribbble likes",
        "Ship with confidence, not guesswork",
      ],
      cta: { label: "Post a Design Task", href: "/create-task" },
    },
    {
      icon: Layout,
      title: "Optimize UX Flows",
      questions: [
        "Which onboarding flow converts?",
        "What navigation structure is intuitive?",
        "Where do users get stuck?",
      ],
      benefits: [
        "Blind voting = honest usability feedback",
        "Compare variants side by side",
        "Iterate based on signal, not ego",
      ],
      cta: { label: "Browse UX Tasks", href: "/browse" },
    },
  ],
  marketers: [
    {
      icon: Megaphone,
      title: "Creative That Converts",
      questions: [
        "Which ad creative gets clicks?",
        "What hook stops the scroll?",
        "Which value prop resonates?",
      ],
      benefits: [
        "Test before you spend ad budget",
        "Real audience, not focus groups",
        "Creative direction backed by data",
      ],
      cta: { label: "Post a Creative Task", href: "/create-task" },
    },
    {
      icon: DollarSign,
      title: "Pricing & Packaging",
      questions: [
        "What price point maximizes revenue?",
        "Monthly vs annual — what sells?",
        "Which bundle structure works?",
      ],
      benefits: [
        "Price sensitivity from real buyers",
        "Reduce churn with right packaging",
        "Revenue impact visible before launch",
      ],
      cta: { label: "Browse Pricing Tasks", href: "/browse" },
    },
  ],
  creators: [
    {
      icon: PenTool,
      title: "Content That Connects",
      questions: [
        "Which thumbnail gets clicks?",
        "What title drives engagement?",
        "Long-form vs short — what works?",
      ],
      benefits: [
        "Audience tells you what they want",
        "Higher CTR, better retention",
        "Algorithm loves proven formats",
      ],
      cta: { label: "Post a Content Task", href: "/create-task" },
    },
    {
      icon: Lightbulb,
      title: "Product & Idea Validation",
      questions: [
        "Would you buy this course?",
        "Which merch design sells?",
        "What format: newsletter, video, podcast?",
      ],
      benefits: [
        "Monetize what audience actually wants",
        "Pre-sell before creating",
        "Build in public with real feedback",
      ],
      cta: { label: "Browse Creator Tasks", href: "/browse" },
    },
  ],
} as const;

const TABS = [
  { id: "founders", label: "Founders", icon: Rocket },
  { id: "designers", label: "Designers", icon: Palette },
  { id: "marketers", label: "Marketers", icon: Megaphone },
  { id: "creators", label: "Creators", icon: PenTool },
] as const;

export function UseCases() {
  const [activeTab, setActiveTab] = useState("founders");

  const scenarios = USE_CASES[activeTab];

  const tabItems = TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
  }));

  return (
    <section id="use-cases" className="py-24 bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="eyebrow tracking-[0.15em] mb-4">USE CASES</div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-display font-medium tracking-[-0.02em] text-hi mb-4 max-w-2xl">
            Any decision that needs honest human judgment
          </h2>
          <p className="text-lo max-w-xl text-[15px] leading-relaxed">
            From product strategy to creative direction — if you&apos;re guessing, you&apos;re gambling.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={setActiveTab}
            className="w-full max-w-2xl mx-auto mb-10"
            aria-label="Use case personas"
          />

          <div className="animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scenarios.map((scenario, i) => (
                <Reveal key={scenario.title} delay={i * 0.1} className="h-full">
                  <Card interactive className="group p-6 lg:p-8 h-full flex flex-col">
                    <div className="text-amber mb-4" aria-hidden="true">
                      <scenario.icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-display font-medium text-hi mb-3 mt-0">
                      {scenario.title}
                    </h3>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs font-medium text-dim uppercase tracking-[0.1em] mb-2">Ask:</p>
                        <ul className="space-y-1.5">
                          {scenario.questions.map((q) => (
                            <li key={q} className="flex gap-2 text-sm text-lo">
                              <span className="text-dim shrink-0">—</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-line pt-4">
                        <p className="text-xs font-medium text-dim uppercase tracking-[0.1em] mb-2">Why it works:</p>
                        <ul className="space-y-1.5">
                          {scenario.benefits.map((b) => (
                            <li key={b} className="flex gap-2 text-sm text-lo">
                              <span className="text-green shrink-0">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-line">
                      <Link
                        href={scenario.cta.href}
                        className={buttonVariants({ variant: "primary", className: "w-full justify-center group" })}
                      >
                        {scenario.cta.label}
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}