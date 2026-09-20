import Link from "next/link";
import type { ReportIssue } from "./types";

export function ReportIssuesSection({
  eyebrow,
  title,
  description,
  issues,
}: {
  eyebrow: string;
  title: string;
  description: string;
  issues: ReportIssue[];
}) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 border-t-2 border-foreground pt-4">
      <div>
        <p lang="en" className="text-heading font-extrabold text-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-0.5 text-body font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-caption leading-5 break-keep text-muted">
          {description}
        </p>
      </div>
      <ol className="divide-y divide-divider border-y border-divider">
        {issues.map((issue, index) => (
          <li key={issue.issueId}>
            <Link
              href={`/issues/${encodeURIComponent(issue.issueId)}`}
              className="flex min-h-18 items-center gap-3 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <span className="w-6 shrink-0 text-label font-bold text-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-body font-bold break-keep text-foreground">
                  {issue.title}
                </span>
                <span className="text-hint tracking-[0.04em] text-muted">
                  {issue.categoryCode.toUpperCase()} · {issue.categoryName}
                </span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-body">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
