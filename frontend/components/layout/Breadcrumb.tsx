"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

const inter = "Inter, system-ui, sans-serif";

interface BreadcrumbProps {
  taskTitle?: string;
}

function BreadcrumbInner({ taskTitle }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs(taskTitle);

  if (pathname === "/" || crumbs.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "36px",
        background: "var(--ink)",
        borderBottom: "1px solid var(--line-subtle)",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        const isLoading = crumb.label === "...";

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span
                style={{
                  fontFamily: inter,
                  fontSize: "11px",
                  color: "var(--text-3)",
                  margin: "0 6px",
                  userSelect: "none",
                }}
              >
                /
              </span>
            )}

            {isLast || !crumb.href ? (
              <span
                style={{
                  fontFamily: inter,
                  fontSize: "11px",
                  color: isLoading ? "var(--text-3)" : "var(--text-2)",
                }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                style={{
                  fontFamily: inter,
                  fontSize: "11px",
                  color: "var(--text-3)",
                  textDecoration: "none",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-2)";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-3)";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Breadcrumb({ taskTitle }: BreadcrumbProps) {
  return (
    <Suspense fallback={null}>
      <BreadcrumbInner taskTitle={taskTitle} />
    </Suspense>
  );
}
