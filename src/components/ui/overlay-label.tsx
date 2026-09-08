import { cx } from "@/lib/cx";
import { Icon } from "./icon";

export interface OverlayLabelProps {
  type: "like" | "skip";
  className?: string;
}

export function OverlayLabel({ type, className }: OverlayLabelProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none inline-flex w-fit items-center gap-1.5 rounded-overlay border-2 px-3.5 py-2 text-base font-bold",
        type === "like"
          ? "border-background bg-primary text-primary-foreground"
          : "border-primary bg-background text-primary",
        className,
      )}
    >
      <Icon name={type} />
      {type === "like" ? "관심 있어요" : "넘기기"}
    </span>
  );
}
