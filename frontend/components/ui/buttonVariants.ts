import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "amber" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-medium tracking-[-0.01em] leading-none whitespace-nowrap select-none transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-hi text-ink border border-transparent hover:bg-hi/90 active:translate-y-px",
  outline:
    "border border-line bg-transparent text-hi hover:border-dim hover:bg-raised",
  ghost: "border border-transparent bg-transparent text-lo hover:text-hi hover:bg-raised",
  amber: "border border-amber bg-transparent text-amber hover:bg-amber-bg",
  danger: "border border-red bg-transparent text-red hover:bg-red/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-[34px] px-3.5 text-[13px]",
  lg: "h-10 px-5 text-[13px]",
};

export function buttonVariants({
  variant = "outline",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}
