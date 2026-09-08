import { cx } from "@/lib/cx";

export interface NumberBadgeProps {
  value: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function NumberBadge({ value, className, ...props }: NumberBadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-surface-muted text-hint leading-none font-bold text-foreground-secondary",
        className,
      )}
    >
      {value}
    </span>
  );
}
