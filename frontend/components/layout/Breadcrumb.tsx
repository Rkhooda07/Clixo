"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

interface BreadcrumbProps {
  taskTitle?: string;
}

function BreadcrumbInner({ taskTitle }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs(taskTitle);

  if (pathname === "/" || crumbs.length === 0) return null;

  return (
    <div className="w-full h-9 shrink-0 bg-ink border-b border-subtle flex items-center px-4 sm:px-8 lg:px-12 text-[11px]">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        const isLoading = crumb.label === "...";

        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-dim mx-1.5 select-none">/</span>}

            {isLast || !crumb.href ? (
              <span className={isLoading ? "text-dim" : "text-lo"}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-dim no-underline transition-colors duration-100 hover:text-lo hover:underline"
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
