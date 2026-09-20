import { IssueDetailSectionHeading } from "./issue-detail-section-heading";
import type { IssueDetailGlossary } from "./types";

export function IssueGlossarySection({
  glossary,
}: {
  glossary: IssueDetailGlossary[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <IssueDetailSectionHeading number="04" title="어려운 말 풀이" />
      <dl className="divide-y divide-divider">
        {glossary.map((item, index) => (
          <div
            key={`${item.term}-${index}`}
            className="flex gap-3 py-2.5 first:pt-0"
          >
            <dt className="w-[84px] shrink-0 text-body-sm font-bold text-foreground">
              {item.term}
            </dt>
            <dd className="min-w-0 text-caption leading-[1.5] break-keep text-muted">
              {item.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
