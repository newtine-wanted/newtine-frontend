import { InterestBarChart } from "./interest-bar-chart";
import { InterestEmptyState } from "./interest-empty-state";
import type { InterestCategoryCount, InterestSampleStatus } from "./types";

export function InterestSection({
  categoryCounts,
  issueCount,
  periodDays,
  sampleStatus,
}: {
  categoryCounts: InterestCategoryCount[];
  issueCount: number;
  periodDays: number;
  sampleStatus: InterestSampleStatus;
}) {
  return (
    <section
      aria-labelledby="interest-heading"
      className="flex flex-col gap-3.5 border-t-2 border-foreground pt-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p
            aria-hidden="true"
            lang="en"
            className="text-title font-extrabold text-foreground"
          >
            Interest
          </p>
          <h2 id="interest-heading" className="text-caption text-muted">
            내 관심 분석 · 최근 {periodDays}일
          </h2>
        </div>
        {sampleStatus !== "EMPTY" && (
          <p className="text-stat leading-none font-black tracking-[-0.02em] text-foreground">
            <span aria-hidden="true">{issueCount}</span>
            <span className="sr-only">총 {issueCount}건</span>
          </p>
        )}
      </div>

      {sampleStatus === "EMPTY" ? (
        <InterestEmptyState />
      ) : (
        <>
          <InterestBarChart categoryCounts={categoryCounts} />
          {sampleStatus === "LOW_SAMPLE" && (
            <p className="flex items-center gap-1.5 bg-surface px-3 py-2 text-label text-muted">
              <span aria-hidden="true">⚠︎</span>
              아직 표본이 적어 정확도가 낮습니다.
            </p>
          )}
          <p className="text-label text-muted">
            ※ 관심 표시한 항목만 집계합니다. 찬반 입장은 집계하지 않습니다.
          </p>
        </>
      )}
    </section>
  );
}
