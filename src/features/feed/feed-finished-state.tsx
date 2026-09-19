import { Button } from "@/components/ui";

export function FeedFinishedState({
  hasLikedNews,
  onOpenLikedNews,
  onOpenReport,
}: {
  /** 서버의 전체 관심 뉴스 개수를 연결하기 전에는 알 수 없는 상태로 둔다. */
  hasLikedNews?: boolean;
  onOpenLikedNews: () => void;
  onOpenReport: () => void;
}) {
  const showLikedNews = hasLikedNews !== false;

  return (
    <section className="flex h-full min-h-[37.625rem] flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        aria-hidden="true"
        className="flex size-[120px] items-center justify-center rounded-full bg-surface-muted text-[44px] font-extrabold text-foreground"
      >
        ✓
      </div>
      <h2 className="text-[22px] leading-[1.35] font-extrabold tracking-[-0.015em] text-foreground">
        새로운 이슈를 모두 확인했어요
      </h2>
      <p className="text-body-sm leading-6 text-muted">
        새 이슈가 들어오면 여기에 이어서 보여드릴게요
      </p>
      <div className="mt-1 flex w-full max-w-[310px] flex-col gap-2.5 pt-3">
        {showLikedNews && (
          <Button className="w-full" onClick={onOpenLikedNews}>
            관심 뉴스 다시 보기
          </Button>
        )}
        <Button
          variant={showLikedNews ? "ghost" : "primary"}
          className="w-full"
          onClick={onOpenReport}
        >
          진단보고서 보러 가기
        </Button>
      </div>
    </section>
  );
}
