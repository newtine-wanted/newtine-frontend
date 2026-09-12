import { cx } from "@/lib/cx";

const glyphs = {
  check: "✓",
  next: "→",
  skip: "✕",
  back: "‹",
  caret: "›",
} as const;

export interface IconProps {
  name: keyof typeof glyphs;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      {glyphs[name]}
    </span>
  );
}
