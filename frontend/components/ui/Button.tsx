"use client";

import React from "react";
import { Spinner } from "./Spinner";
import {
  buttonVariants,
  type ButtonVariant,
  type ButtonSize,
} from "./buttonVariants";

export { buttonVariants } from "./buttonVariants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "outline",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner size={12} />}
      {children}
    </button>
  );
}
