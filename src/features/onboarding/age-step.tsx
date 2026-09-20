"use client";

import type { Ref } from "react";
import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { FOCUS_CLASSES } from "./focus-classes";
import { CTA_SCROLL_CLEARANCE, SurveyLayout } from "./survey-layout";
import type { AsyncRequestStatus, OnboardingAgeGroup } from "./types";

export function AgeStep({
  ref,
  ageGroups,
  requestStatus,
  selectedCode,
  isCompleting,
  isSkipping,
  actionError,
  onToggle,
  onRetry,
  onBack,
  onSkip,
  onComplete,
}: {
  ref: Ref<HTMLHeadingElement>;
  ageGroups: OnboardingAgeGroup[];
  requestStatus: AsyncRequestStatus;
  selectedCode: string | null;
  isCompleting: boolean;
  isSkipping: boolean;
  actionError: string | null;
  onToggle: (code: string) => void;
  onRetry: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}) {
  return (
    <SurveyLayout
      ref={ref}
      stepNumber={4}
      question="어느 나이대에 해당하나요?"
      description="선택하지 않아도 괜찮아요."
      ctaLabel={isCompleting ? "처리 중" : "시작하기"}
      ctaDisabled={requestStatus === "loading" || isCompleting || isSkipping}
      isSkipping={isSkipping || isCompleting}
      errorMessage={actionError}
      onBack={onBack}
      onSkip={onSkip}
      onCta={onComplete}
    >
      {requestStatus === "loading" && <AsyncContentLoading />}

      {requestStatus === "error" && <AsyncContentError onRetry={onRetry} />}

      {requestStatus === "success" && (
        <div role="group" aria-label="나이대" className="flex flex-col gap-2.5">
          {ageGroups.map((ageGroup) => {
            const isSelected = selectedCode === ageGroup.code;

            return (
              <button
                key={ageGroup.code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(ageGroup.code)}
                className={`flex h-12 items-center border border-border px-4 text-left text-body-sm ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE} ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground"
                }`}
              >
                {ageGroup.name}
              </button>
            );
          })}
        </div>
      )}
    </SurveyLayout>
  );
}
