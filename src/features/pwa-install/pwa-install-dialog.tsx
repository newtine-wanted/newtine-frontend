"use client";

import { useEffect, useRef } from "react";
import type { PwaInstallPlatform } from "./use-pwa-install";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const stepsByPlatform: Record<PwaInstallPlatform, string[]> = {
  ios: [
    "화면 아래 가운데 공유 버튼을 누르세요",
    "목록에서 '홈 화면에 추가'를 고르세요",
    "오른쪽 위 '추가'를 누르면 끝이에요",
  ],
  other: [
    "오른쪽 위 메뉴 버튼을 누르세요",
    "'앱 설치' 또는 '홈 화면에 추가'를 고르세요",
    "안내에 따라 추가를 누르면 끝이에요",
  ],
};

interface PwaInstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PwaInstallPlatform;
}

export function PwaInstallDialog({
  isOpen,
  onClose,
  platform,
}: PwaInstallDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const steps = stepsByPlatform[platform];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
      return;
    }
    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pwa-install-dialog-title"
      onClose={() => {
        // 상태를 내려 닫으면 네이티브 close 이벤트가 뒤따르므로, Esc로 닫은 경우에만 알린다.
        if (isOpen) onClose();
      }}
      onClick={(event) => {
        // 패딩을 안쪽 div에 둬 상자 안에서 누르고 뗀 클릭이 스크림 클릭으로 잡히지 않게 한다.
        if (event.target === dialogRef.current) onClose();
      }}
      className="mx-auto mt-auto mb-0 w-full max-w-[480px] bg-background text-left backdrop:bg-scrim"
    >
      <div className="flex flex-col gap-4 px-6 pt-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <h2
          id="pwa-install-dialog-title"
          className="text-nav font-bold text-foreground"
        >
          홈 화면에 추가해 보세요
        </h2>
        <p className="text-body-sm leading-6 break-keep text-muted">
          주소창 없이 앱처럼 열리고, 새 이슈를 더 빠르게 확인할 수 있어요.
        </p>
        <ol className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-2.5 text-body-sm text-foreground-body"
            >
              <span
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center bg-surface-muted text-label font-bold text-foreground"
              >
                {index + 1}
              </span>
              <span className="leading-5 break-keep">{step}</span>
            </li>
          ))}
        </ol>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`h-[54px] w-full bg-surface-muted text-body text-foreground ${focusClasses}`}
        >
          나중에 할게요
        </button>
      </div>
    </dialog>
  );
}
