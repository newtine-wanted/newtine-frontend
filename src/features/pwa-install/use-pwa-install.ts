"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";

const DISMISSED_STORAGE_KEY = "newtine.pwa-install-dismissed-at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
// 피드 로드가 3~5초 걸려 그 전에 열면 로딩 화면 위에 뜬다.
const AUTO_OPEN_DELAY_MS = 4000;
// 흐름을 끊으면 이탈로 이어지는 경로에서는 자동으로 열지 않는다.
const SUPPRESSED_PATH_PREFIXES = [
  "/login",
  "/signup",
  "/onboarding",
  "/terms",
  "/privacy",
];

export type PwaInstallPlatform = "ios" | "other";

function detectIsIos(): boolean {
  // iPadOS 13+는 UA를 Macintosh로 보고하므로 터치 지원 여부를 함께 본다.
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

function detectIsStandalone(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari는 display-mode 대신 비표준 navigator.standalone을 쓴다.
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isDismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISSED_STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    // 저장소 접근이 막힌 환경에서는 닫은 적 없는 것으로 본다.
    return false;
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, String(Date.now()));
  } catch {
    // 저장에 실패해도 이번 세션 동안 닫힌 상태는 ref로 유지된다.
  }
}

// 실행 환경은 런타임 중 바뀌지 않으므로 구독은 필요 없다.
const subscribeNever = () => () => {};

export function usePwaInstall({ autoOpen = false } = {}) {
  const pathname = usePathname();
  const sessionStatus = useStore(authSessionStore, (state) => state.status);
  const [isOpen, setIsOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  // 플랫폼과 설치 여부는 서버에서 알 수 없다. 서버 스냅샷을 따로 둬 하이드레이션 불일치를 막는다.
  const isInstallable = useSyncExternalStore(
    subscribeNever,
    () => !detectIsStandalone(),
    () => false,
  );
  const platform = useSyncExternalStore<PwaInstallPlatform>(
    subscribeNever,
    () => (detectIsIos() ? "ios" : "other"),
    () => "other",
  );

  const isSuppressedPath = SUPPRESSED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    if (!autoOpen || !isInstallable) return;
    if (hasAutoOpenedRef.current) return;
    // 세션 부트스트랩 중에는 스플래시가 떠 있어 모달이 무엇 위에 떴는지 알 수 없다.
    if (sessionStatus === "initializing") return;
    if (isSuppressedPath) return;
    if (isDismissedRecently()) return;

    const timer = setTimeout(() => {
      hasAutoOpenedRef.current = true;
      setIsOpen(true);
    }, AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [autoOpen, isInstallable, isSuppressedPath, sessionStatus]);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    rememberDismissal();
  }, []);

  return { isOpen, platform, isInstallable, open, close };
}
