"use client";

import { Fragment, type Ref } from "react";
import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { ChoiceChip } from "./choice-chip";
import { SurveyLayout } from "./survey-layout";
import type { CategoryRequestStatus, OnboardingCategory } from "./types";

export function TopicStep({
  ref,
  categories,
  requestStatus,
  selectedCodes,
  onToggle,
  onBack,
  onSkip,
  onNext,
  onRetry,
}: {
  ref: Ref<HTMLHeadingElement>;
  categories: OnboardingCategory[];
  requestStatus: CategoryRequestStatus;
  selectedCodes: string[];
  onToggle: (code: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  onRetry: () => void;
}) {
  return (
    <SurveyLayout
      ref={ref}
      stepNumber={1}
      question="어떤 이슈에 관심이 있나요?"
      description="1개 이상 골라주세요. 첫 피드를 만드는 데 써요."
      ctaLabel={`다음 (${selectedCodes.length}개 선택)`}
      ctaDisabled={requestStatus !== "success" || selectedCodes.length === 0}
      onBack={onBack}
      onSkip={onSkip}
      onCta={onNext}
    >
      {requestStatus === "loading" && <AsyncContentLoading />}

      {requestStatus === "error" && <AsyncContentError onRetry={onRetry} />}

      {requestStatus === "success" && (
        <div
          role="group"
          aria-label="관심 주제"
          className="grid grid-cols-3 gap-x-2 gap-y-2.5"
        >
          {categories.map((category) => {
            const parts = category.name.split("·");
            return (
              <ChoiceChip
                key={category.code}
                selected={selectedCodes.includes(category.code)}
                onClick={() => onToggle(category.code)}
                showCheck
                className="px-2"
              >
                {parts.map((part, index) => (
                  <Fragment key={part}>
                    {part}
                    {/* 가운뎃점 뒤에서만 줄이 바뀌게 한다 */}
                    {index < parts.length - 1 && (
                      <>
                        ·<wbr />
                      </>
                    )}
                  </Fragment>
                ))}
              </ChoiceChip>
            );
          })}
        </div>
      )}
    </SurveyLayout>
  );
}
