import type { InterestBar } from "./types";

export function InterestBarChart({ bars }: { bars: InterestBar[] }) {
  return (
    <ul aria-label="분야별 관심 건수" className="flex flex-col gap-2">
      {bars.map((bar) => (
        <li key={bar.area} className="flex items-center gap-2.5">
          <span className="w-16 shrink-0 text-caption text-foreground-secondary">
            {bar.area}
          </span>
          <span
            aria-hidden="true"
            className="block h-3 flex-1 bg-surface-muted"
          >
            <span
              className="block h-full min-w-1.5 bg-foreground"
              style={{ width: `${bar.widthPercent}%` }}
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
