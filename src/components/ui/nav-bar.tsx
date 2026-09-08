import { cx } from "@/lib/cx";
import { Icon } from "./icon";

interface NavBarBaseProps {
  title: string;
  rightAction?: { label: string; onClick: () => void; disabled?: boolean };
  className?: string;
}

export type NavBarProps = NavBarBaseProps &
  (
    | { variant?: "feed"; onBack?: never }
    | { variant: "back"; onBack: () => void }
  );

export function NavBar({
  title,
  variant = "feed",
  onBack,
  rightAction,
  className,
}: NavBarProps) {
  return (
    <header
      className={cx(
        "flex min-h-[52px] w-full items-center justify-between gap-3 bg-background px-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {variant === "back" && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={onBack}
            className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-control-sm text-foreground focus-ring"
          >
            <Icon name="back" className="text-[26px] font-medium" />
          </button>
        )}
        <h1 className="min-w-0 py-2 text-nav font-bold break-words text-foreground">
          {title}
        </h1>
      </div>
      {rightAction && (
        <button
          type="button"
          onClick={rightAction.onClick}
          disabled={rightAction.disabled}
          className="min-h-11 min-w-11 shrink-0 rounded-control-sm text-body-sm font-medium text-foreground-secondary focus-ring disabled:cursor-not-allowed disabled:opacity-40"
        >
          {rightAction.label}
        </button>
      )}
    </header>
  );
}
