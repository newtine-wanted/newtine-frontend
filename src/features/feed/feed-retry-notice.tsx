interface FeedRetryNoticeProps {
  failedInteractionCount: number;
  hasInteractionError: boolean;
  onRetryInteraction: () => void;
  onRetryLoad: () => void;
}

export function FeedRetryNotice({
  failedInteractionCount,
  hasInteractionError,
  onRetryInteraction,
  onRetryLoad,
}: FeedRetryNoticeProps) {
  return (
    <button
      type="button"
      onClick={hasInteractionError ? onRetryInteraction : onRetryLoad}
      className="absolute bottom-4 left-1/2 z-30 min-h-11 max-w-[calc(100%_-_2rem)] -translate-x-1/2 bg-primary px-5 py-3 text-body-sm whitespace-nowrap text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {hasInteractionError
        ? `반응 기록 실패 · 다시 시도 (${failedInteractionCount})`
        : "다음 이슈 불러오기 실패 · 다시 시도"}
    </button>
  );
}
