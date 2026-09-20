"use client";

import type { LikedNewsCategory } from "./types";

export function TopicFilter({
  categories,
  selectedCode,
  onSelect,
}: {
  categories: LikedNewsCategory[];
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}) {
  // code가 null인 "전체"는 categoryCode를 생략한 요청을 뜻한다.
  const chips: { code: string | null; name: string }[] = [
    { code: null, name: "전체" },
    ...categories.map(({ code, name }) => ({ code, name })),
  ];

  return (
    <div
      role="group"
      aria-label="주제 필터"
      className="flex gap-2 overflow-x-auto px-5 pt-2 pb-3"
    >
      {chips.map((chip) => {
        const isSelected = chip.code === selectedCode;
        return (
          <button
            key={chip.code ?? "all"}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(chip.code)}
            className={`flex h-11 shrink-0 items-center px-3 text-label whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground"
            }`}
          >
            {chip.name}
          </button>
        );
      })}
    </div>
  );
}
