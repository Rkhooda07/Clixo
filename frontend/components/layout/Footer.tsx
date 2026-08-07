import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logomark } from "@/components/ui/Logomark";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          {/* Mark stands alone here, so the link needs its own name */}
          <Link
            href="/"
            aria-label="Clixo — home"
            className="w-fit text-hi opacity-50 transition-opacity duration-150 hover:opacity-80"
          >
            <Logomark className="size-4" />
          </Link>
          <p className="text-xs text-dim">
            Decentralised opinion market on Ethereum.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-dim transition-colors hover:text-lo"
          >
            <span>Sepolia Etherscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-dim transition-colors hover:text-lo"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Network status */}
        <div className="flex items-center gap-2 text-xs text-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          <span>Sepolia Testnet</span>
        </div>
      </div>
    </footer>
  );
}
