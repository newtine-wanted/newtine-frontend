import { cx } from "@/lib/cx";

export interface SheetHandleProps {
  className?: string;
}

export function SheetHandle({ className }: SheetHandleProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "flex h-4 w-full shrink-0 items-center justify-center",
        className,
      )}
    >
      <span className="h-[5px] w-10 rounded-[3px] bg-border" />
    </div>
  );
}
