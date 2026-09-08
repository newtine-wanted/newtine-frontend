"use client";

import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

export interface PillProps extends Omit<
  ComponentProps<"button">,
  "aria-pressed"
> {
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
}

export function Pill({
  selected,
  onSelectedChange,
  onClick,
  type = "button",
  className,
  children,
  ...props
}: PillProps) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={selected}
      className={cx(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-body-sm font-medium focus-ring transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelectedChange(!selected);
      }}
    >
      {selected && <Icon name="check" className="text-label font-bold" />}
      {children}
    </button>
  );
}
