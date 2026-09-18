"use client";

import type { Ref } from "react";
import { ChoiceChip } from "./choice-chip";
import { FOCUS_CLASSES } from "./focus-classes";
import { REGIONS, type Region } from "./regions";
import { CTA_SCROLL_CLEARANCE, SurveyLayout } from "./survey-layout";

export function RegionStep({
  ref,
  selected,
  nationwideOnly,
  onToggleRegion,
  onToggleNationwideOnly,
  onBack,
  onSkip,
  onComplete,
}: {
  ref: Ref<HTMLHeadingElement>;
  selected: Region[];
  /** true면 모든 지역 셀이 입력을 받지 않는다 */
  nationwideOnly: boolean;
  onToggleRegion: (region: Region) => void;
  onToggleNationwideOnly: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}) {
  return (
    <SurveyLayout
      ref={ref}
      stepNumber={3}
      question="어느 지역 이슈를 보고 싶나요?"
      description="사는 곳이 아니어도 괜찮아요. 여러 개 선택 가능."
      ctaLabel="시작하기"
      onBack={onBack}
      onSkip={onSkip}
      onCta={onComplete}
    >
      <ChoiceChip
        selected={nationwideOnly}
        onClick={onToggleNationwideOnly}
        className="self-start px-4"
      >
        전국 이슈만 볼래요
      </ChoiceChip>

      <div
        role="group"
        aria-label="지역"
        className="grid grid-cols-3 gap-x-2 gap-y-2.5"
      >
        {REGIONS.map((region) => {
          const isSelected = selected.includes(region);
          return (
            <button
              key={region}
              type="button"
              aria-pressed={isSelected}
              disabled={nationwideOnly}
              onClick={() => onToggleRegion(region)}
              className={`flex h-11 items-center justify-center border border-border text-body-sm disabled:opacity-40 ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE} ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>
    </SurveyLayout>
  );
}
