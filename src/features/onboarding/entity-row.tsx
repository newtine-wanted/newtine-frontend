"use client";

import { CheckIcon } from "./check-icon";
import { FOCUS_CLASSES } from "./focus-classes";
import { CTA_SCROLL_CLEARANCE } from "./survey-layout";
import type { OnboardingEntity } from "./types";

export function EntityRow({
  entity,
  isAdded,
  onToggle,
}: {
  entity: OnboardingEntity;
  isAdded: boolean;
  onToggle: (id: string) => void;
}) {
  const accessibleLabel = entity.subtitle
    ? `${entity.name}, ${entity.subtitle}`
    : entity.name;

  return (
    <li>
      <button
        type="button"
        aria-pressed={isAdded}
        aria-label={accessibleLabel}
        onClick={() => onToggle(entity.id)}
        className={`flex min-h-15 w-full items-center gap-3 py-2 text-left ${FOCUS_CLASSES} ${CTA_SCROLL_CLEARANCE}`}
      >
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-body-sm font-bold text-muted"
        >
          {entity.name.trim().charAt(0)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-button wrap-anywhere break-keep text-foreground">
            {entity.name}
          </span>
          {entity.subtitle && (
            <span className="text-label wrap-anywhere break-keep text-muted">
              {entity.subtitle}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-label ${
            isAdded
              ? "border-primary bg-primary text-primary-foreground"
              : "border-divider bg-surface text-foreground"
          }`}
        >
          {isAdded ? (
            <>
              <CheckIcon className="size-3" />
              추가됨
            </>
          ) : (
            "+ 추가"
          )}
        </span>
      </button>
    </li>
  );
}
