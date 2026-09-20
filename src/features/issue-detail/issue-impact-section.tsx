import { IssueDetailSectionHeading } from "./issue-detail-section-heading";
import type { IssueDetailImpact } from "./types";

export function IssueImpactSection({
  impacts,
}: {
  impacts: IssueDetailImpact[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <IssueDetailSectionHeading number="02" title="나한테 무슨 상관?" />

      <div className="flex flex-col gap-3">
        {impacts.map((impact, index) => (
          <dl
            key={`${impact.targetType}-${impact.targetValue}-${index}`}
            className="flex flex-col gap-2.5 bg-surface p-4"
          >
            <div className="flex gap-2.5">
              <dt className="w-10 shrink-0 text-caption font-bold text-muted">
                대상
              </dt>
              <dd className="min-w-0 text-body-sm leading-[1.5] text-foreground">
                {impact.targetValue}
              </dd>
            </div>
            <div className="flex gap-2.5">
              <dt className="w-10 shrink-0 text-caption font-bold text-muted">
                영향
              </dt>
              <dd className="min-w-0 text-body-sm leading-[1.5] text-foreground">
                {impact.description}
              </dd>
            </div>
            {impact.timing && (
              <div className="flex gap-2.5">
                <dt className="w-10 shrink-0 text-caption font-bold text-muted">
                  시점
                </dt>
                <dd className="min-w-0 text-body-sm leading-[1.5] text-foreground">
                  {impact.timing}
                </dd>
              </div>
            )}
            {impact.action && (
              <div className="flex gap-2.5">
                <dt className="w-10 shrink-0 text-caption font-bold text-muted">
                  행동
                </dt>
                <dd className="min-w-0 text-body-sm leading-[1.5] text-foreground">
                  {impact.action}
                </dd>
              </div>
            )}
          </dl>
        ))}
      </div>
    </section>
  );
}
