"use client";

import { FOCUS_CLASSES } from "./focus-classes";

export function OnboardingNavBar({
  onBack,
  onSkip,
  isSkipping,
}: {
  onBack: () => void;
  onSkip: () => void;
  isSkipping: boolean;
}) {
  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-10 flex h-[52px] items-center justify-between bg-background px-1.5">
      <button
        type="button"
        aria-label="이전 단계로"
        onClick={onBack}
        className={`flex size-11 items-center justify-center text-foreground ${FOCUS_CLASSES}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-6"
        >
          <path
            d="M15 18 9 12l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onSkip}
        disabled={isSkipping}
        className={`flex min-h-11 min-w-11 items-center justify-center px-2.5 text-body-sm text-muted disabled:pointer-events-none disabled:opacity-40 ${FOCUS_CLASSES}`}
      >
        {isSkipping ? "처리 중" : "건너뛰기"}
      </button>
    </header>
  );
}
