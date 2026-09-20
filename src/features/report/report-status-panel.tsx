import { Button } from "@/components/ui";

type ReportStatusPanelKind = "request" | "running" | "failed" | "daily-limit";

const statusCopy: Record<
  ReportStatusPanelKind,
  { title: string; description: string; actionLabel?: string }
> = {
  request: {
    title: "오늘의 진단보고서를 만들어볼까요?",
    description:
      "오늘 관심 표시한 이슈를 바탕으로 연결과 주요 내용을 정리해 드려요.",
    actionLabel: "오늘의 보고서 생성하기",
  },
  running: {
    title: "진단보고서를 만들고 있어요",
    description:
      "관심 이슈와 선택을 정리하는 중이에요. 잠시 후 자동으로 갱신됩니다.",
  },
  failed: {
    title: "진단보고서를 완성하지 못했어요",
    description: "다시 만들 수 있는 상태라면 아래 버튼으로 재시도해 주세요.",
    actionLabel: "보고서 다시 만들기",
  },
  "daily-limit": {
    title: "오늘의 보고서는 이미 요청했어요",
    description:
      "생성 중이면 잠시 기다려 주세요. 완료되면 오늘 보고서를 바로 확인할 수 있어요.",
    actionLabel: "오늘 보고서 확인하기",
  },
};

export function ReportStatusPanel({
  isActionPending = false,
  kind,
  onAction,
}: {
  isActionPending?: boolean;
  kind: ReportStatusPanelKind;
  onAction?: () => void;
}) {
  const copy = statusCopy[kind];

  return (
    <section
      aria-live="polite"
      className="flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-128px)] flex-col items-center justify-center px-7 pb-12 text-center"
    >
      {kind === "running" ? (
        <span
          aria-hidden="true"
          className="mb-4 size-7 animate-spin rounded-full border-2 border-divider border-t-foreground motion-reduce:animate-none"
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="mb-4 size-7 text-foreground"
        >
          {kind === "request" ? (
            <>
              <path
                d="M7 3h7l4 4v14H7z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M14 3v5h5M12 11v6M9 14h6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </>
          ) : kind === "daily-limit" ? (
            <>
              <circle
                cx="12"
                cy="12"
                r="8.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 7v5l3 2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              <circle
                cx="12"
                cy="12"
                r="8.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 7.5v5M12 16.5h.01"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      )}

      <h2 className="text-heading font-extrabold break-keep text-foreground">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-80 text-caption leading-5 break-keep text-muted">
        {copy.description}
      </p>

      {copy.actionLabel && onAction && (
        <Button
          disabled={isActionPending}
          onClick={onAction}
          className="mt-5 min-w-56"
        >
          {isActionPending
            ? kind === "failed"
              ? "다시 시도 중"
              : kind === "daily-limit"
                ? "확인 중"
                : "생성 요청 중"
            : copy.actionLabel}
        </Button>
      )}
    </section>
  );
}
