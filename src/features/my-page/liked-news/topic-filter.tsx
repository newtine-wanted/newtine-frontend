"use client";

import { POLICY_AREAS, type PolicyArea } from "@/domain/policy-area";

export type TopicFilterValue = PolicyArea | "전체";

const FILTER_VALUES: TopicFilterValue[] = ["전체", ...POLICY_AREAS];

export function TopicFilter({
  selected,
  onSelect,
}: {
  selected: TopicFilterValue;
  onSelect: (value: TopicFilterValue) => void;
}) {
  return (
    <div
      role="group"
      aria-label="주제 필터"
      className="flex gap-2 overflow-x-auto px-5 pt-2 pb-3"
    >
      {FILTER_VALUES.map((value) => {
        const isSelected = value === selected;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(value)}
            className={`flex h-11 shrink-0 items-center px-3 text-label whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
