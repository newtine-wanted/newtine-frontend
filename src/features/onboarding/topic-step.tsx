"use client";

import { Fragment, type Ref } from "react";
import { POLICY_AREAS, type PolicyArea } from "@/domain/policy-area";
import { ChoiceChip } from "./choice-chip";
import { SurveyLayout } from "./survey-layout";

export function TopicStep({
  ref,
  selected,
  onToggle,
  onBack,
  onSkip,
  onNext,
}: {
  ref: Ref<HTMLHeadingElement>;
  selected: PolicyArea[];
  onToggle: (area: PolicyArea) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  return (
    <SurveyLayout
      ref={ref}
      stepNumber={1}
      question="어떤 이슈에 관심이 있나요?"
      description="1개 이상 골라주세요. 첫 피드를 만드는 데 써요."
      ctaLabel={`다음 (${selected.length}개 선택)`}
      ctaDisabled={selected.length === 0}
      onBack={onBack}
      onSkip={onSkip}
      onCta={onNext}
    >
      <div
        role="group"
        aria-label="관심 주제"
        className="grid grid-cols-3 gap-x-2 gap-y-2.5"
      >
        {POLICY_AREAS.map((area) => {
          const parts = area.split("·");
          return (
            <ChoiceChip
              key={area}
              selected={selected.includes(area)}
              onClick={() => onToggle(area)}
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
    </SurveyLayout>
  );
}
