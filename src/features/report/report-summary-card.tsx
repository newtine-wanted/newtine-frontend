import Link from "next/link";
import type { ReportContent } from "./types";

export function ReportSummaryCard({ content }: { content: ReportContent }) {
  const topCategories = [...content.categoryCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((category) => category.displayName);
  const isInsufficient = content.analysisStatus === "INSUFFICIENT_DATA";
  const hasNoConnection = content.analysisStatus === "NO_CONNECTION";
  const title = isInsufficient
    ? "연결을 찾기엔\n아직 기록이 적어요"
    : hasNoConnection
      ? "오늘에는 뚜렷한\n연결을 찾지 못했어요"
      : `오늘, 관심은\n${topCategories.join("와 ")}에 모였어요`;
  const description = isInsufficient
    ? `관심 이슈가 ${content.minimumIssueCount}건 이상 쌓이면 공통점과 차이를 연결해 드릴게요.`
    : hasNoConnection
      ? "기록은 충분하지만 오늘 관심 이슈 사이에서 의미 있는 공통 쟁점이 없었어요."
      : `${content.categoryCounts.length}개 주제에서 ${content.issueCount}개의 관심 이슈가 모였어요.`;

  return (
    <section className="bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-heading leading-[1.25] font-extrabold break-keep whitespace-pre-line text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-caption leading-5 break-keep text-muted">
            {description}
          </p>
        </div>
        <p className="shrink-0 text-stat leading-none font-black tracking-[-0.03em] text-foreground">
          {content.issueCount}
          <span className="ml-0.5 text-label font-normal">건</span>
        </p>
      </div>

      {isInsufficient && (
        <div
          className="mt-4"
          aria-label={`최소 ${content.minimumIssueCount}건 중 ${content.issueCount}건`}
        >
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: content.minimumIssueCount }, (_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 ${index < content.issueCount ? "bg-foreground" : "bg-divider"}`}
              />
            ))}
          </div>
          <p className="mt-1 text-right text-hint text-muted">
            {content.issueCount}/{content.minimumIssueCount}
          </p>
        </div>
      )}

      <Link
        href={hasNoConnection ? "/" : "/my-page/liked-news"}
        className="mt-4 flex h-[54px] w-full items-center justify-between bg-primary px-4 text-button text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span>{hasNoConnection ? "피드로 돌아가기" : "관심 뉴스 보기"}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
