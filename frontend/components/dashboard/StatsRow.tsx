import React from "react";
import { Card } from "@/components/ui/Card";
import { StatBlock } from "@/components/ui/StatBlock";

interface StatsRowProps {
  stats: {
    ethBalance?: string;
    tasksCreated?: number;
    ethSpent?: string;
    ethEarned?: string;
  };
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <Card className="grid grid-cols-2 overflow-hidden md:grid-cols-4">
      <StatBlock
        className="p-5"
        label="ETH Balance"
        value={`Ξ ${stats.ethBalance ?? "0.000"}`}
        accent="amber"
      />
      <StatBlock
        className="border-l border-line p-5"
        label="Tasks Posted"
        value={String(stats.tasksCreated ?? 0)}
      />
      <StatBlock
        className="border-t border-line p-5 md:border-t-0 md:border-l"
        label="ETH Staked"
        value={`Ξ ${stats.ethSpent ?? "0.000"}`}
        accent="amber"
      />
      <StatBlock
        className="border-t border-l border-line p-5 md:border-t-0"
        label="ETH Earned"
        value={`Ξ ${stats.ethEarned ?? "0.000"}`}
        accent="green"
      />
    </Card>
  );
}
