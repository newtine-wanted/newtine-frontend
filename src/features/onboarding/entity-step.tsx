"use client";

import { useState, type Ref } from "react";
import { CheckIcon } from "./check-icon";
import { ChoiceChip } from "./choice-chip";
import { FOCUS_CLASSES } from "./focus-classes";
import { ONBOARDING_ENTITIES_MOCK } from "./mock-data";
import { CTA_SCROLL_CLEARANCE, SurveyLayout } from "./survey-layout";
import type { EntityTypeFilter, OnboardingEntity } from "./types";

const TYPE_FILTERS: EntityTypeFilter[] = ["전체", "정치인", "정당", "기관"];

function EntityRow({
  entity,
  isAdded,
  onToggle,
}: {
  entity: OnboardingEntity;
  isAdded: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={isAdded}
        aria-label={`${entity.name}, ${entity.description}`}
        onClick={() => onToggle(entity.id)}
        className={`flex min-h-15 w-full items-center gap-3 py-2 text-left ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE}`}
      >
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-body-sm font-bold text-muted"
        >
          {entity.name.trim().charAt(0)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-button wrap-anywhere break-keep text-foreground">
            {entity.name}
          </span>
          <span className="text-label wrap-anywhere break-keep text-muted">
            {entity.description}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-label ${
            isAdded
              ? "border-primary bg-primary text-primary-foreground"
              : "border-divider bg-surface text-foreground"
          }`}
        >
          {isAdded ? (
            <>
              <CheckIcon className="size-3" />
              추가됨
            </>
          ) : (
            "+ 추가"
          )}
        </span>
      </button>
    </li>
  );
}

export function EntityStep({
  ref,
  selectedIds,
  onToggle,
  onBack,
  onSkip,
  onNext,
}: {
  ref: Ref<HTMLHeadingElement>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntityTypeFilter>("전체");

  const keyword = query.trim();
  const visibleEntities = ONBOARDING_ENTITIES_MOCK.filter(
    (entity) =>
      (typeFilter === "전체" || entity.type === typeFilter) &&
      entity.name.includes(keyword),
  );

  return (
    <SurveyLayout
      ref={ref}
      stepNumber={2}
      question="관심 있는 인물·정당·기관이 있나요?"
      description="선택하지 않아도 괜찮아요."
      ctaLabel={`다음 (${selectedIds.length}개 선택)`}
      onBack={onBack}
      onSkip={onSkip}
      onCta={onNext}
    >
      <label className="flex h-12 items-center gap-2 border border-border bg-background px-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 18 18"
          fill="none"
          className="size-4.5 shrink-0 text-muted"
        >
          <circle
            cx="8"
            cy="8"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m12.5 12.5 3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">이름으로 검색</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름으로 검색"
          className={`h-full min-w-0 flex-1 bg-transparent text-button text-foreground outline-none placeholder:text-muted ${CTA_SCROLL_CLEARANCE}`}
        />
      </label>

      <div role="group" aria-label="유형" className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((value) => (
          <ChoiceChip
            key={value}
            selected={value === typeFilter}
            onClick={() => setTypeFilter(value)}
            className="px-4"
          >
            {value}
          </ChoiceChip>
        ))}
      </div>

      {/* 목록과 상태 컨테이너를 한 자식으로 묶어 빈 컨테이너에 본문 gap이 생기지 않게 한다. */}
      <div>
        {visibleEntities.length > 0 && (
          <ul className="flex flex-col divide-y divide-divider border-b border-divider">
            {visibleEntities.map((entity) => (
              <EntityRow
                key={entity.id}
                entity={entity}
                isAdded={selectedIds.includes(entity.id)}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
        {/* 상태 컨테이너는 항상 마운트해 두고 내용만 바꿔야 결과 없음이 안정적으로 읽힌다. */}
        <div role="status">
          {visibleEntities.length === 0 && (
            <p className="py-10 text-center text-body-sm text-muted">
              검색 결과가 없어요
            </p>
          )}
        </div>
      </div>
    </SurveyLayout>
  );
}
