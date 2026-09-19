export interface AsyncContentLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AsyncContentLoading({
  title = "목록을 불러오는 중이에요",
  description = "잠시만 기다려 주세요.",
  className,
}: AsyncContentLoadingProps) {
  const classes = [
    "flex min-h-[260px] w-full flex-col items-center justify-center gap-3 text-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="status" aria-live="polite" className={classes}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-7 animate-spin text-muted motion-reduce:animate-none"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-body-sm leading-normal font-bold text-foreground">
          {title}
        </p>
        <p className="max-w-[280px] text-label leading-normal text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
