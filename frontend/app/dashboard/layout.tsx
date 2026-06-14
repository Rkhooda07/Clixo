"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Compass, 
  PlusCircle, 
  Settings, 
  History,
  TrendingUp,
  Wallet
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Tasks", href: "/my-tasks", icon: History },
  { label: "Create Task", href: "/create-task", icon: PlusCircle },
  { label: "Browse Tasks", href: "/browse", icon: Compass },
  { label: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar - Hidden on mobile, visible on lg */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          <div className="bg-[#111118]/80 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-2 shadow-xl shadow-black/20">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">
              Menu
            </p>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-purple-400 bg-purple-950/20 border border-purple-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-purple-400" : "text-zinc-500"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-white font-bold text-sm mb-1">Creator Hub</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Check task performance and optimize your labeling campaigns.
              </p>
              <Link 
                href="/create-task"
                className="mt-4 flex items-center justify-center gap-2 bg-white text-black text-xs font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New Task
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp className="w-20 h-20 text-white" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
