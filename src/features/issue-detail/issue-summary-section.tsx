import { IssueDetailSectionHeading } from "./issue-detail-section-heading";

export function IssueSummarySection({
  summaryLines,
}: {
  summaryLines: [string, string, string];
}) {
  return (
    <section className="flex flex-col gap-3">
      <IssueDetailSectionHeading title="3줄 요약" />
      <ol className="flex flex-col gap-2.5">
        {summaryLines.map((summary, index) => (
          <li key={index} className="flex gap-2.5">
            <span className="w-7 shrink-0 text-button leading-[1.5] font-bold text-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 text-body leading-[1.6] break-keep text-foreground-body">
              {summary}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
