"use client";

import type { ReactNode, Ref } from "react";
import { Button } from "@/components/ui";
import { FOCUS_CLASSES } from "./focus-classes";
import { OnboardingNavBar } from "./onboarding-nav-bar";

const TOTAL_STEPS = 4;

// 하단 CTA 바(72px)와 포커스 링까지 가리지 않도록 포커스 이동 스크롤에 남기는 여백
export const CTA_SCROLL_CLEARANCE =
  "scroll-mb-[calc(env(safe-area-inset-bottom)_+_80px)]";

export function SurveyLayout({
  ref,
  stepNumber,
  question,
  description,
  ctaLabel,
  ctaDisabled = false,
  isSkipping = false,
  scrollMode = "document",
  errorMessage,
  onBack,
  onSkip,
  onCta,
  children,
}: {
  /** 단계가 바뀌면 포커스를 받는 질문 제목 */
  ref: Ref<HTMLHeadingElement>;
  stepNumber: 1 | 2 | 3 | 4;
  question: string;
  description: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  isSkipping?: boolean;
  scrollMode?: "document" | "contained";
  errorMessage?: string | null;
  onBack: () => void;
  onSkip: () => void;
  onCta: () => void;
  children: ReactNode;
}) {
  const isContained = scrollMode === "contained";

  return (
    <div
      className={`flex flex-col ${
        isContained
          ? "h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] min-h-0 overflow-hidden"
          : "min-h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))]"
      }`}
    >
      <OnboardingNavBar
        onBack={onBack}
        onSkip={onSkip}
        isSkipping={isSkipping}
      />

      {errorMessage && (
        <p role="alert" className="px-6 pt-2 text-label text-danger">
          {errorMessage}
        </p>
      )}

      <div
        className={`flex flex-1 flex-col gap-5 px-6 pt-2 pb-4 ${
          isContained ? "min-h-0 overflow-hidden" : ""
        }`}
      >
        <div aria-hidden="true" className="flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={`h-1 flex-1 ${n <= stepNumber ? "bg-foreground" : "bg-divider"}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <p
            aria-hidden="true"
            className="text-label font-bold text-muted tabular-nums"
          >
            {stepNumber} / {TOTAL_STEPS}
          </p>
          <h1
            ref={ref}
            tabIndex={-1}
            className={`text-heading font-extrabold wrap-anywhere break-keep text-foreground ${FOCUS_CLASSES}`}
          >
            <span className="sr-only">
              {TOTAL_STEPS}단계 중 {stepNumber}단계,{" "}
            </span>
            {question}
          </h1>
          <p className="text-body-sm wrap-anywhere break-keep text-muted">
            {description}
          </p>
        </div>

        {children}
      </div>

      <div className="sticky bottom-[env(safe-area-inset-bottom)] z-10 bg-background px-6 py-2">
        <Button className="w-full" disabled={ctaDisabled} onClick={onCta}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
