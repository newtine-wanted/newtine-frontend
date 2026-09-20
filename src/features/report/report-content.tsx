import { ReportCategoryList } from "./report-category-list";
import { ReportConnectionsSection } from "./report-connections-section";
import { ReportIssuesSection } from "./report-issues-section";
import { ReportSummaryCard } from "./report-summary-card";
import type { ReportSummaryViewModel } from "./report-view-model";
import type { ReportContent as ReportContentType } from "./types";

export function ReportContent({
  content,
  summary,
}: {
  content: ReportContentType;
  summary: ReportSummaryViewModel;
}) {
  return (
    <article className="flex flex-col gap-6 px-5 pt-3 pb-10">
      <ReportSummaryCard summary={summary} />
      <ReportCategoryList categories={content.categoryCounts} />
      <ReportConnectionsSection connections={content.connections} />
      <ReportIssuesSection
        eyebrow="Related"
        title="함께 살펴볼 이슈"
        description="지금까지 관심 표시한 이슈와 가까운 내용이에요."
        issues={content.relatedIssues}
      />
      <ReportIssuesSection
        eyebrow="Today"
        title="오늘 주요 이슈"
        description="관심사와 관계없이 오늘 함께 알아둘 이슈예요."
        issues={content.majorIssues}
      />
    </article>
  );
}
