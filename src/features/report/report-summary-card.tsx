import Link from "next/link";
import type { ReportSummaryViewModel } from "./report-view-model";

export function ReportSummaryCard({
  summary,
}: {
  summary: ReportSummaryViewModel;
}) {
  return (
    <section className="bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-heading leading-[1.25] font-extrabold break-keep whitespace-pre-line text-foreground">
            {summary.title}
          </h2>
          <p className="mt-2 text-caption leading-5 break-keep text-muted">
            {summary.description}
          </p>
        </div>
        <p className="shrink-0 text-stat leading-none font-black tracking-[-0.03em] text-foreground">
          {summary.issueCount}
          <span className="ml-0.5 text-label font-normal">건</span>
        </p>
      </div>

      {summary.isInsufficient && (
        <div
          className="mt-4"
          aria-label={`최소 ${summary.minimumIssueCount}건 중 ${summary.issueCount}건`}
        >
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: summary.minimumIssueCount }, (_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 ${index < summary.issueCount ? "bg-foreground" : "bg-divider"}`}
              />
            ))}
          </div>
          <p className="mt-1 text-right text-hint text-muted">
            {summary.issueCount}/{summary.minimumIssueCount}
          </p>
        </div>
      )}

      <Link
        href={summary.hasNoConnection ? "/" : "/my-page/liked-news"}
        className="mt-4 flex h-[54px] w-full items-center justify-between bg-primary px-4 text-button text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span>
          {summary.hasNoConnection ? "피드로 돌아가기" : "관심 뉴스 보기"}
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
