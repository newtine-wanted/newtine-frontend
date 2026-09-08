"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";
import { SheetHandle } from "./sheet-handle";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  dismissible?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissible = true,
  variant,
}: ModalProps & { variant: "sheet" | "dialog" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pointerStartedOutside = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function outside(event: { clientX: number; clientY: number }) {
    const rect = ref.current?.getBoundingClientRect();
    return Boolean(
      rect &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom),
    );
  }

  return (
    <dialog
      ref={ref}
      data-newtine-modal
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      onPointerDown={(event) => {
        pointerStartedOutside.current =
          event.target === event.currentTarget && outside(event);
      }}
      onClick={(event) => {
        if (
          dismissible &&
          pointerStartedOutside.current &&
          event.target === event.currentTarget &&
          outside(event)
        )
          onOpenChange(false);
        pointerStartedOutside.current = false;
      }}
      className={cx(
        "fixed max-h-[90dvh] overflow-y-auto overscroll-contain border-0 bg-background p-0 font-app text-foreground backdrop:bg-scrim",
        variant === "sheet"
          ? "inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-app rounded-t-sheet pt-2 pb-[env(safe-area-inset-bottom)]"
          : "inset-0 m-auto w-[calc(100%-32px)] max-w-[318px] rounded-card",
      )}
    >
      {variant === "sheet" && <SheetHandle />}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <h2
            id={titleId}
            className="min-w-0 flex-1 text-heading font-bold break-words"
          >
            {title}
          </h2>
          {dismissible && (
            <button
              type="button"
              aria-label="닫기"
              onClick={() => onOpenChange(false)}
              className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-control-sm focus-ring"
            >
              <Icon name="skip" />
            </button>
          )}
        </div>
        {description && (
          <p
            id={descriptionId}
            className="text-body-sm text-foreground-secondary"
          >
            {description}
          </p>
        )}
        <div className="min-w-0 text-body-sm break-words">{children}</div>
        {footer && <div className="pt-2">{footer}</div>}
      </div>
    </dialog>
  );
}
