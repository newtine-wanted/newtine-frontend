"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variantClasses = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-surface-muted text-foreground",
  ghost: "border-border bg-background text-foreground",
  text: "border-transparent bg-background text-foreground",
} as const;

export type ButtonVariant = keyof typeof variantClasses;

export interface ButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex h-14 items-center justify-center gap-2 rounded-none border px-4 text-button leading-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} type={type} className={classes}>
      {children}
    </button>
  );
}
