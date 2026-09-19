"use client";

import type { ReactNode } from "react";
import { CheckIcon } from "./check-icon";
import { FOCUS_CLASSES } from "./focus-classes";
import { CTA_SCROLL_CLEARANCE } from "./survey-layout";

export function ChoiceChip({
  selected,
  onClick,
  showCheck = false,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  /**
   * 02 주제 칩만 켠다. 선택됐을 때만 렌더해 해제 상태의 라벨이 칸 가운데에 오게 한다 —
   * 해제 상태에서도 체크가 자리를 차지하면 라벨이 18px만큼 오른쪽으로 치우친다.
   * 03 유형 탭(단일 선택)과 04 전국 pill(같은 화면의 지역 셀과 동일)은 켜지 않고,
   * 선택 상태를 검은 채움과 `aria-pressed`로만 전달한다.
   */
  showCheck?: boolean;
  /** 좌우 패딩·정렬: 주제 "px-2", 유형 탭 "px-4", 전국 "self-start px-4" */
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-1.5 border border-border py-2.5 text-center text-body-sm wrap-anywhere break-keep ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE} ${
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground"
      } ${className ?? ""}`}
    >
      {showCheck && selected && <CheckIcon className="size-3 shrink-0" />}
      <span className="min-w-0">{children}</span>
    </button>
  );
}
