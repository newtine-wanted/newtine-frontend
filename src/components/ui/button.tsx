import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

const variants = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-surface-muted text-foreground",
  ghost: "border-border bg-transparent text-foreground",
  text: "border-transparent bg-transparent text-foreground",
} as const;

const sizes = {
  xl: "min-h-14 rounded-control-xl",
  lg: "min-h-[54px] rounded-control-lg",
  md: "min-h-12 rounded-control-sm",
  sm: "min-h-11 rounded-control-sm",
} as const;

interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Omit<ButtonStyleProps, "children">) {
  return cx(
    "focus-ring inline-flex min-w-11 items-center justify-center gap-2 border px-4 py-2 text-center text-body font-medium break-words transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends Omit<ComponentProps<"button">, "children">, ButtonStyleProps {}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "children">, ButtonStyleProps {}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClasses({ variant, size, fullWidth, className })}
    >
      {children}
    </Link>
  );
}
