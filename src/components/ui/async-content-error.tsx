"use client";

import { Button } from "./button";

export interface AsyncContentErrorProps {
  onRetry: () => void;
  title?: string;
  description?: string;
  retryLabel?: string;
  isRetrying?: boolean;
  className?: string;
}

export function AsyncContentError({
  onRetry,
  title = "목록을 불러오지 못했어요",
  description = "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
  retryLabel = "다시 시도",
  isRetrying = false,
  className,
}: AsyncContentErrorProps) {
  const classes = [
    "flex min-h-[260px] w-full flex-col items-center justify-center gap-3 text-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-busy={isRetrying} className={classes}>
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center gap-3"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-7 text-muted"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7.5v5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
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

      <Button
        type="button"
        variant="ghost"
        disabled={isRetrying}
        onClick={onRetry}
        className="w-[132px] text-body-sm font-bold"
      >
        {isRetrying ? "다시 시도 중" : retryLabel}
      </Button>
    </div>
  );
}
