import { cx } from "@/lib/cx";

const glyphs = {
  check: "✓",
  next: "→",
  like: "♥",
  skip: "✕",
  back: "‹",
  caret: "›",
  housing: "▤",
  labor: "▦",
  finance: "▥",
  topic: "▣",
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
