"use client";

import { PwaInstallDialog } from "./pwa-install-dialog";
import { usePwaInstall } from "./use-pwa-install";

/** 앱 첫 진입 시 설치 안내를 한 번 띄운다. 루트 레이아웃에서만 마운트한다. */
export function PwaInstallPrompt() {
  const { isOpen, platform, close } = usePwaInstall({ autoOpen: true });

  return (
    <PwaInstallDialog isOpen={isOpen} onClose={close} platform={platform} />
  );
}
