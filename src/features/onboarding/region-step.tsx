"use client";

import { useState, type Ref } from "react";
import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { ChoiceChip } from "./choice-chip";
import { FOCUS_CLASSES } from "./focus-classes";
import { CTA_SCROLL_CLEARANCE, SurveyLayout } from "./survey-layout";
import type { AsyncRequestStatus, OnboardingRegion } from "./types";

export function RegionStep({
  ref,
  regions,
  requestStatus,
  selectedCodes,
  nationwideOnly,
  isSkipping,
  skipError,
  onToggleRegion,
  onToggleNationwideOnly,
  onRetry,
  onBack,
  onSkip,
  onNext,
}: {
  ref: Ref<HTMLHeadingElement>;
  regions: OnboardingRegion[];
  requestStatus: AsyncRequestStatus;
  selectedCodes: string[];
  /** true면 모든 지역 셀이 입력을 받지 않는다 */
  nationwideOnly: boolean;
  isSkipping: boolean;
  skipError: string | null;
  onToggleRegion: (code: string) => void;
  onToggleNationwideOnly: () => void;
  onRetry: () => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
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
      ctaLabel="다음"
      ctaDisabled={requestStatus !== "success" && !nationwideOnly}
      isSkipping={isSkipping}
      errorMessage={skipError}
      onBack={onBack}
      onSkip={onSkip}
      onCta={onNext}
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

      {requestStatus === "loading" && <AsyncContentLoading />}

      {requestStatus === "error" && <AsyncContentError onRetry={onRetry} />}

      {requestStatus === "success" && (
        <div
          role="group"
          aria-label="지역"
          className="grid grid-cols-3 gap-x-2 gap-y-2.5"
        >
          {regions.map((region) => {
            const isSelected = selectedCodes.includes(region.code);
            return (
              <button
                key={region.code}
                type="button"
                aria-pressed={isSelected}
                disabled={nationwideOnly}
                onClick={() => onToggleRegion(region.code)}
                className={`flex h-11 items-center justify-center border border-border px-1 text-label break-keep disabled:opacity-40 ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE} ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground"
                }`}
              >
                {region.name}
              </button>
            );
          })}
        </div>
      )}
    </SurveyLayout>
  );
}
