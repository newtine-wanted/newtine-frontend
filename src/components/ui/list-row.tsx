import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

interface ListRowBaseProps {
  label: string;
  className?: string;
}

export type ListRowProps = ListRowBaseProps &
  (
    | { variant: "nav-sub"; href: string; sub: string; icon?: ReactNode }
    | { variant: "nav-value"; href: string; value: ReactNode; icon?: ReactNode }
    | { variant: "quiet-nav"; href: string }
    | { variant: "quiet-value"; value: ReactNode }
    | { variant: "quiet-action"; onAction: () => void; disabled?: boolean }
  );

export function ListRow(props: ListRowProps) {
  const { label, variant, className } = props;
  const quiet = variant.startsWith("quiet");
  const navigates = "href" in props;
  const classes = cx(
    "flex w-full items-center justify-between gap-2 border-b border-divider bg-background py-2 text-left",
    quiet
      ? "min-h-11 text-caption text-foreground-secondary"
      : "text-body font-medium text-foreground",
    variant === "nav-sub" ? "min-h-16" : !quiet && "min-h-14",
    (navigates || variant === "quiet-action") &&
      "focus-ring disabled:cursor-not-allowed disabled:opacity-40",
    className,
  );
  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-2">
          {"icon" in props && props.icon && (
            <span
              aria-hidden="true"
              className="shrink-0 text-body-sm text-foreground-secondary"
            >
              {props.icon}
            </span>
          )}
          <span className="min-w-0 break-words">{label}</span>
        </span>
        {variant === "nav-sub" && (
          <span className="text-label font-normal break-words text-muted">
            {props.sub}
          </span>
        )}
      </span>
      {("value" in props || navigates) && (
        <span className="flex max-w-[45%] items-center gap-2">
          {"value" in props && (
            <span className="min-w-0 text-right text-body-sm font-normal break-words text-foreground-secondary">
              {props.value}
            </span>
          )}
          {navigates && (
            <Icon name="caret" className="text-nav font-normal text-subtle" />
          )}
        </span>
      )}
    </>
  );
  if (navigates)
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  if (variant === "quiet-action")
    return (
      <button
        type="button"
        onClick={props.onAction}
        disabled={props.disabled}
        className={classes}
      >
        {content}
      </button>
    );
  return <div className={classes}>{content}</div>;
}
