import { Button } from "@/components/ui";

export function FeedActionBar({
  disabled,
  muted = false,
  onLike,
  onSkip,
}: {
  disabled: boolean;
  muted?: boolean;
  onLike: () => void;
  onSkip: () => void;
}) {
  return (
    <footer
      className={`sticky bottom-0 z-20 flex h-[94px] shrink-0 flex-col gap-2 bg-background px-4 py-2 transition-opacity ${muted ? "opacity-35" : "opacity-100"}`}
    >
      <div className="flex h-[54px] gap-3">
        <Button
          variant="ghost"
          className="min-w-0 flex-1"
          disabled={disabled}
          onClick={onSkip}
        >
          <span aria-hidden="true">✕</span>
          넘기기
        </Button>
        <Button className="min-w-0 flex-1" disabled={disabled} onClick={onLike}>
          <span aria-hidden="true">♥</span>
          관심 있어요
        </Button>
      </div>
      <p className="h-4 text-center text-hint leading-4 text-subtle">
        ← 왼쪽으로 밀면 넘기기&nbsp;&nbsp;·&nbsp;&nbsp;오른쪽으로 밀면 관심 →
      </p>
    </footer>
  );
}
