import Link from "next/link";

const tileClasses =
  "flex min-h-25 flex-1 flex-col justify-between gap-2 bg-surface p-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ShortcutTiles({
  likedIssueCount,
}: {
  likedIssueCount: number;
}) {
  return (
    <div className="flex gap-1">
      <Link href="/report" className={tileClasses}>
        <span className="flex flex-col gap-1">
          <span
            aria-hidden="true"
            lang="en"
            className="text-body-sm font-bold tracking-[0.06em] text-foreground"
          >
            REPORT
          </span>
          <span className="text-body text-foreground">진단보고서</span>
        </span>
        <span className="flex items-center justify-between gap-2">
          <span className="text-label text-muted">내가 반응한 이슈</span>
          <span aria-hidden="true" className="text-body text-foreground">
            →
          </span>
        </span>
      </Link>

      <Link href="/my-page/liked-news" className={tileClasses}>
        <span className="flex flex-col gap-1">
          <span
            aria-hidden="true"
            lang="en"
            className="text-body-sm font-bold tracking-[0.06em] text-foreground"
          >
            SAVED
          </span>
          <span className="text-body text-foreground">관심 뉴스</span>
        </span>
        <span className="flex items-center justify-between gap-2">
          <span className="text-label text-muted">{likedIssueCount}건</span>
          <span aria-hidden="true" className="text-body text-foreground">
            →
          </span>
        </span>
      </Link>
    </div>
  );
}
