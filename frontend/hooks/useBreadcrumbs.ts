"use client";

import { usePathname, useSearchParams } from "next/navigation";

export type Crumb = { label: string; href?: string };

function truncate(s: string, max = 40): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export function useBreadcrumbs(taskTitle?: string): Crumb[] {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  if (pathname === "/") return [];

  if (pathname === "/dashboard") {
    if (tab === "tasks") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Tasks" },
      ];
    }
    if (tab === "work") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Work" },
      ];
    }
    return [{ label: "Dashboard" }];
  }

  if (pathname === "/browse") {
    return [{ label: "Browse Tasks" }];
  }

  if (pathname === "/create-task") {
    return [{ label: "Create Task" }];
  }

  if (pathname.startsWith("/vote/")) {
    return [
      { label: "Browse Tasks", href: "/browse" },
      { label: taskTitle ? truncate(taskTitle) : "..." },
    ];
  }

  if (pathname.startsWith("/tasks/")) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Tasks", href: "/dashboard?tab=tasks" },
      { label: taskTitle ? truncate(taskTitle) : "..." },
    ];
  }

  return [];
}
