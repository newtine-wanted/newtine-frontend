"use client";

import { useEffect } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "like" | "skip";
  message?: string;
  duration?: number;
  className?: string;
}

export function Toast({
  open,
  onOpenChange,
  type,
  message,
  duration = 1500,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timeout = window.setTimeout(() => onOpenChange(false), duration);
    return () => window.clearTimeout(timeout);
  }, [open, duration, onOpenChange, type, message]);

  return (
    <div
      role="status"
      aria-atomic="true"
      className={cx(
        "pointer-events-none fixed inset-x-0 bottom-[calc(112px+env(safe-area-inset-bottom))] z-50 mx-auto flex w-full max-w-app justify-center px-4",
        className,
      )}
    >
      {open && (
        <div className="flex w-fit max-w-full items-center gap-2 rounded-full bg-primary px-5 py-3 text-body-sm font-medium text-primary-foreground">
          <Icon
            name={type === "like" ? "check" : "next"}
            className="text-caption font-bold"
          />
          <span className="min-w-0 break-words">
            {message ??
              (type === "like"
                ? "관심 있다고 기억할게요"
                : "다음 이슈로 넘어갈게요")}
          </span>
        </div>
      )}
    </div>
  );
}
