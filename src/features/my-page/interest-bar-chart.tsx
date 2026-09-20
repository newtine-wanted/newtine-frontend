import type { InterestCategoryCount } from "./types";

export function InterestBarChart({
  categoryCounts,
}: {
  categoryCounts: InterestCategoryCount[];
}) {
  // 0건은 min-w-1.5 막대 조각 때문에 0이 아닌 값처럼 보여 제외한다.
  // 안정 정렬 → 동률은 서버가 내려준 순서를 유지한다.
  const bars = categoryCounts
    .filter((bar) => bar.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCount = bars.reduce((max, bar) => Math.max(max, bar.count), 1);

  return (
    <ul aria-label="분야별 관심 건수" className="flex flex-col gap-2">
      {bars.map((bar) => (
        <li key={bar.code} className="flex items-center gap-2.5">
          <span className="w-16 shrink-0 text-caption text-foreground-secondary">
            {bar.name}
          </span>
          <span
            aria-hidden="true"
            className="block h-3 flex-1 bg-surface-muted"
          >
            <span
              className="block h-full min-w-1.5 bg-foreground"
              style={{ width: `${(bar.count / maxCount) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-button font-bold text-foreground tabular-nums">
            {bar.count}
            <span className="sr-only">건</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
