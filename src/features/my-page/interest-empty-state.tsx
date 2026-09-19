import Link from "next/link";

export function InterestEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 bg-surface px-4 py-5 text-center">
      <h3 className="text-body font-bold text-foreground">
        아직 기록이 없어요
      </h3>
      <p className="text-caption text-muted">
        카드를 넘기다 관심 가는 게 있으면
        <br />
        오른쪽으로 밀어보세요
      </p>
      <Link
        href="/"
        className="mt-1 inline-flex h-11 min-w-50 items-center justify-center bg-primary px-4 text-button text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        피드로 가기
      </Link>
    </div>
  );
}
