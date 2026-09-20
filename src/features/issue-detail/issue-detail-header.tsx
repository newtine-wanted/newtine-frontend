import { IssueCategoryBadge } from "./issue-category-badge";
import { formatIssueDate, formatIssueDateTime } from "./formatters";
import type { IssueDetailResponse } from "./types";

export function IssueDetailHeader({ issue }: { issue: IssueDetailResponse }) {
  const referenceDate = issue.eventAt ?? issue.publishedAt ?? issue.updatedAt;

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <IssueCategoryBadge category={issue.category} />
        <span className="text-label text-subtle">
          기사 {issue.articleCount}건 · {formatIssueDate(referenceDate)} 기준
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-display leading-[1.3] font-extrabold tracking-[-0.02em] break-keep text-foreground">
          {issue.title}
        </h2>
        <div className="flex flex-col gap-0.5">
          <p className="text-label font-bold text-accent">짧게 요약하면</p>
          <p className="text-heading leading-[1.35] font-extrabold break-keep text-foreground">
            {issue.integratedSummary}
          </p>
        </div>
        <p className="text-label leading-relaxed text-subtle">
          {issue.publishedAt &&
            `최초 보도 ${formatIssueDate(issue.publishedAt)} · `}
          최근 갱신 {formatIssueDateTime(issue.updatedAt)} · 통합 기사{" "}
          {issue.articleCount}건
        </p>
      </div>
    </header>
  );
}
