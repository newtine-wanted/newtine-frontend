"use client";

import { useEffect, useState } from "react";
import { CategoryIcon } from "./category-icon";
import type { FeedCardResponse } from "./types";

const SUMMARY_INITIAL_DELAY_MS = 500;
const SUMMARY_STAGGER_MS = 450;

const categoryBackgrounds: Record<string, string> = {
  housing: "#f2f0e8",
  labor: "#efeee8",
  finance: "#f3f0df",
  education: "#eef2e8",
  welfare: "#eaf3ec",
  foreign: "#f1eee8",
  climate: "#eaf2e6",
  local: "#f4f0e8",
  youth: "#edf0e8",
  justice: "#f1ece8",
  politics: "#efece7",
  media: "#f2f1e9",
};

export function FeedCard({
  card,
  active = false,
  isInteracting = false,
}: {
  card: FeedCardResponse;
  active?: boolean;
  isInteracting?: boolean;
}) {
  const [visibleSummaryCount, setVisibleSummaryCount] = useState(0);

  useEffect(() => {
    if (!active || isInteracting || visibleSummaryCount >= 3) return;

    const delay =
      visibleSummaryCount === 0 ? SUMMARY_INITIAL_DELAY_MS : SUMMARY_STAGGER_MS;
    const timer = setTimeout(() => {
      setVisibleSummaryCount((count) => Math.min(3, count + 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [active, isInteracting, visibleSummaryCount]);

  return (
    <article className="flex h-full min-h-max w-full flex-col gap-4 border border-border bg-background p-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span
          className="flex min-h-7 min-w-0 items-center gap-1.5 px-2.5 py-1 text-label font-normal text-foreground"
          style={{
            backgroundColor:
              categoryBackgrounds[card.category.code] ?? "#f8f8f8",
          }}
        >
          <CategoryIcon />
          <span className="truncate font-bold">{card.category.name}</span>
        </span>
        <span className="shrink-0 text-label text-subtle">
          기사 {card.articleCount}건 묶음
        </span>
      </div>

      <h2 className="text-[26px] leading-[1.3] font-extrabold tracking-[-0.02em] break-keep text-foreground">
        {card.title}
      </h2>

      <div
        className={`flex flex-col transition-opacity duration-[250ms] motion-reduce:transition-none ${
          visibleSummaryCount > 0 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={visibleSummaryCount === 0}
      >
        <div className="mb-4 h-px bg-divider" />
        <p className="mb-2.5 text-label font-bold tracking-[0.08em] text-muted">
          3줄 요약
        </p>
        <ol className="flex flex-col gap-2.5">
          {card.summaryLines.map((summary, index) => (
            <li
              key={summary}
              className={`flex gap-2.5 transition-opacity duration-[250ms] motion-reduce:transition-none ${
                index < visibleSummaryCount ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-surface-muted text-hint font-bold text-muted">
                {index + 1}
              </span>
              <span className="min-w-0 text-body leading-[1.6] break-keep text-foreground-body">
                {summary}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-auto text-center text-label font-bold text-muted">
        탭하면 자세히 볼 수 있어요&nbsp;&nbsp;›
      </p>
    </article>
  );
}
