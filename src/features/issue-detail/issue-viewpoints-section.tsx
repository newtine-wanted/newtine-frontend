import { IssueDetailSectionHeading } from "./issue-detail-section-heading";
import type { IssueDetailViewpoint } from "./types";

export function IssueViewpointsSection({
  viewpoints,
}: {
  viewpoints: IssueDetailViewpoint[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <IssueDetailSectionHeading number="03" title="이 이슈를 보는 관점" />
      <div className="grid grid-cols-2 gap-2.5">
        {viewpoints.map((viewpoint, index) => (
          <article
            key={`${viewpoint.statement}-${index}`}
            className="flex min-w-0 flex-col gap-2 bg-surface p-3.5"
          >
            <h4 className="text-caption font-bold text-foreground">
              관점 {String(index + 1).padStart(2, "0")}
            </h4>
            <p className="text-caption leading-[1.5] break-keep text-muted">
              {viewpoint.statement}
            </p>
            <p className="mt-auto text-caption leading-[1.5] text-muted">
              근거 기사 {viewpoint.articleIds.length}건
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
