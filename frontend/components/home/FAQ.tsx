import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const FAQ_ITEMS = [
  {
    question: "Do I need crypto experience to use Clixo?",
    answer: "Not at all. Connect your wallet with RainbowKit (supports MetaMask, Coinbase Wallet, WalletConnect, and more). Sepolia testnet ETH is free from faucets like <a href=\"https://sepoliafaucet.com\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-amber hover:underline\">sepoliafaucet.com</a>. You&apos;ll be voting in under a minute.",
  },
  {
    question: "How is voting truly blind?",
    answer: "When a task is created, all options are encrypted on-chain. Your vote is submitted as a transaction that reveals nothing about the current tally. Only after your transaction confirms does the contract decrypt and count your vote. No one — not the creator, not other voters, not us — sees results before you vote.",
  },
  {
    question: "What happens if a task doesn't reach its vote target?",
    answer: "The creator can cancel the task at any time and reclaim their full stake. No ETH is distributed, no opinions are wasted. You get your time back, the creator gets their funds back — clean reset.",
  },
  {
    question: "Is this mainnet Ethereum or a testnet?",
    answer: "Sepolia testnet only. Real ETH mechanics, real economic incentives, zero financial risk. Perfect for learning, experimenting, and building a reputation before any mainnet launch.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer: "You don't need to claim anything. When a task closes, the smart contract automatically distributes the reward pool to all winning voters' wallets in a single transaction. The ETH appears in your wallet — no gas, no clicks, no waiting.",
  },
  {
    question: "How many options can I include in a task?",
    answer: "2 to 10 image options per task. Upload via IPFS (Pinata) — we handle the pinning, you just drag and drop. Each option needs a clear label and thumbnail so voters can judge fairly.",
  },
  {
    question: "Can I vote on my own task?",
    answer: "No. The contract prevents the task creator from voting on their own task. This keeps the signal clean — you're paying for <em>outside</em> opinions, not self-validation.",
  },
  {
    question: "What prevents someone from creating fake wallets to manipulate votes?",
    answer: "Each wallet can vote once per task. While Sybil attacks are theoretically possible on any permissionless chain, Sepolia ETH has real opportunity cost (time/faucet limits), and we're exploring reputation-based weighting for future versions. For now: one wallet = one vote = fair enough.",
  },
] as const;

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="eyebrow tracking-[0.15em] mb-4">FAQ</div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-display font-medium tracking-[-0.02em] text-hi mb-4">
            Questions? We have answers.
          </h2>
          <p className="text-lo text-[15px] leading-relaxed">
            Everything you need to know before posting your first task or casting your first vote.
          </p>
        </Reveal>

        <div className="mt-12 space-y-0" role="list" aria-label="Frequently asked questions">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <details className="faq-item group" role="listitem">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dim focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md">
                  <span className="text-lg font-display font-medium text-hi pr-8">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className="text-dim shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="faq-answer pb-5 text-lo leading-relaxed text-[14px]">
                  <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={FAQ_ITEMS.length * 0.05} className="mt-10 text-center">
          <p className="text-dim text-sm">
            Didn&apos;t find your answer?{" "}
            <a
              href="https://github.com/rkhooda/Clixo/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:underline font-medium"
            >
              Open a GitHub issue
            </a>
            {" or check the "}
            <a
              href="https://github.com/rkhooda/Clixo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:underline font-medium"
            >
              source code
            </a>
            {"."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}