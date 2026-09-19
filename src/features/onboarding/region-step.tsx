"use client";

import { useState, type Ref } from "react";
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
  // 첫 렌더에는 비워 둬야 마운트 직후 안내가 엉뚱하게 낭독되지 않는다.
  const [modeNotice, setModeNotice] = useState("");

  function toggleNationwide() {
    onToggleNationwideOnly();
    setModeNotice(
      nationwideOnly
        ? "지역을 직접 고를 수 있어요"
        : "전국 이슈만 보여드려요. 선택한 지역은 해제됐어요",
    );
  }

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
        onClick={toggleNationwide}
        className="self-start px-4"
      >
        전국 이슈만 볼래요
      </ChoiceChip>

      <p role="status" className="sr-only">
        {modeNotice}
      </p>

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
