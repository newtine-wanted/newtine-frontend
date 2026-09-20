import { formatIssueDateTime } from "./formatters";
import { IssueDetailSectionHeading } from "./issue-detail-section-heading";
import type { IssueDetailArticle } from "./types";

export function IssueArticlesSection({
  articles,
}: {
  articles: IssueDetailArticle[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <IssueDetailSectionHeading number="05" title="기사 원문" />
      <p className="text-label text-subtle">기본 접힘 · 탭하면 펼침</p>

      <details className="group border border-border bg-background">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3.5 text-body-sm font-normal text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          <span>기사 {articles.length}건 보기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
          >
            <path
              d="m7 10 5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>

        <ul className="divide-y divide-divider bg-surface px-3.5 py-1">
          {articles.map((article) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center gap-2.5 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-caption font-bold break-keep text-foreground">
                    {article.title}
                  </span>
                  <span className="text-hint text-subtle">
                    {article.publisherName}
                    {article.publishedAt &&
                      ` · ${formatIssueDateTime(article.publishedAt)}`}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5 shrink-0 text-muted"
                >
                  <path
                    d="M8 16 16 8M10 8h6v6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
