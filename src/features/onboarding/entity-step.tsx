"use client";

import type { Ref } from "react";
import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { ChoiceChip } from "./choice-chip";
import { EntityRow } from "./entity-row";
import { CTA_SCROLL_CLEARANCE, SurveyLayout } from "./survey-layout";
import type {
  AsyncRequestStatus,
  OnboardingEntity,
  PoliticalActorTypeFilter,
} from "./types";

const TYPE_FILTERS: Array<{
  label: string;
  value: PoliticalActorTypeFilter;
}> = [
  { label: "전체", value: "ALL" },
  { label: "정치인", value: "POLITICIAN" },
  { label: "정당", value: "PARTY" },
  { label: "기관", value: "INSTITUTION" },
];

export function EntityStep({
  ref,
  entities,
  query,
  requestStatus,
  selectedIds,
  typeFilter,
  onQueryChange,
  onRetry,
  onTypeFilterChange,
  onToggle,
  onBack,
  onSkip,
  onNext,
}: {
  ref: Ref<HTMLHeadingElement>;
  entities: OnboardingEntity[];
  query: string;
  requestStatus: AsyncRequestStatus;
  selectedIds: string[];
  typeFilter: PoliticalActorTypeFilter;
  onQueryChange: (value: string) => void;
  onRetry: () => void;
  onTypeFilterChange: (value: PoliticalActorTypeFilter) => void;
  onToggle: (id: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
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
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="이름으로 검색"
          className={`h-full min-w-0 flex-1 bg-transparent text-button text-foreground outline-none placeholder:text-muted ${CTA_SCROLL_CLEARANCE}`}
        />
      </label>

      <div role="group" aria-label="유형" className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((filter) => (
          <ChoiceChip
            key={filter.value}
            selected={filter.value === typeFilter}
            onClick={() => onTypeFilterChange(filter.value)}
            className="px-4"
          >
            {filter.label}
          </ChoiceChip>
        ))}
      </div>

      {requestStatus === "loading" && <AsyncContentLoading />}

      {requestStatus === "error" && <AsyncContentError onRetry={onRetry} />}

      {requestStatus === "success" && (
        <div>
          {entities.length > 0 && (
            <ul className="flex flex-col divide-y divide-divider border-b border-divider">
              {entities.map((entity) => (
                <EntityRow
                  key={entity.id}
                  entity={entity}
                  isAdded={selectedIds.includes(entity.id)}
                  onToggle={onToggle}
                />
              ))}
            </ul>
          )}
          <div role="status">
            {entities.length === 0 && (
              <p className="py-10 text-center text-body-sm text-muted">
                검색 결과가 없어요
              </p>
            )}
          </div>
        </div>
      )}
    </SurveyLayout>
  );
}
