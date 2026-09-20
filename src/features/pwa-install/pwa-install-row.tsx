"use client";

import { PwaInstallDialog } from "./pwa-install-dialog";
import { usePwaInstall } from "./use-pwa-install";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** 자동 안내를 닫은 뒤에도 설치할 수 있도록 마이페이지에 두는 상시 진입점 */
export function PwaInstallRow() {
  const { isOpen, isInstallable, platform, open, close } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <li>
      <button
        type="button"
        onClick={open}
        className={`flex h-11 w-full items-center justify-between text-left text-body text-foreground-body ${focusClasses}`}
      >
        홈 화면에 앱으로 추가
        <span aria-hidden="true" className="text-foreground">
          →
        </span>
      </button>
      <PwaInstallDialog isOpen={isOpen} onClose={close} platform={platform} />
    </li>
  );
}
