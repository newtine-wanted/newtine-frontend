"use client";

import { useEffect, useRef } from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";
import { getIssueActivitySessionId } from "@/domain/issue-activity-session";
import { issueDetailApi } from "./api";
import type { IssueDetailApi } from "./types";

const PROGRESS_INTERVAL_MS = 15_000;
const MAX_ACTIVE_MILLISECONDS = 1_800_000;

export function useDetailViewTracking(
  issueId: string,
  enabled: boolean,
  api: IssueDetailApi = issueDetailApi,
) {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const viewIdRef = useRef<string | null>(null);
  const trackedIssueIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || authStatus !== "authenticated") return;

    const shouldCreateViewId =
      trackedIssueIdRef.current !== issueId || viewIdRef.current === null;
    const viewId = shouldCreateViewId
      ? crypto.randomUUID()
      : (viewIdRef.current ?? crypto.randomUUID());

    if (shouldCreateViewId) {
      trackedIssueIdRef.current = issueId;
      viewIdRef.current = viewId;
    }
    let activeSince: number | null = null;
    let pendingActiveMilliseconds = 0;
    let progressRequestPending = false;
    let viewStarted = false;
    let disposed = false;
    let trackingStopped = false;
    let intervalId: number | null = null;
    let expiryTimeoutId: number | null = null;

    function collectActiveTime() {
      if (activeSince === null) return;

      const now = performance.now();
      pendingActiveMilliseconds += now - activeSince;
      activeSince = now;
    }

    function isPageActive() {
      return document.visibilityState === "visible" && document.hasFocus();
    }

    function syncActiveState() {
      if (isPageActive()) {
        activeSince ??= performance.now();
        return;
      }

      collectActiveTime();
      activeSince = null;
      void flushProgress();
    }

    async function flushProgress() {
      if (!viewStarted || progressRequestPending) return;

      collectActiveTime();
      const activeMilliseconds = Math.min(
        Math.floor(pendingActiveMilliseconds),
        MAX_ACTIVE_MILLISECONDS,
      );
      if (activeMilliseconds <= 0) return;

      pendingActiveMilliseconds -= activeMilliseconds;
      progressRequestPending = true;

      try {
        await api.updateDetailViewProgress(issueId, viewId, {
          activeMilliseconds,
        });
      } catch {
        pendingActiveMilliseconds += activeMilliseconds;
      } finally {
        progressRequestPending = false;
      }
    }

    function stopTracking() {
      if (trackingStopped) return;
      trackingStopped = true;

      document.removeEventListener("visibilitychange", syncActiveState);
      window.removeEventListener("focus", syncActiveState);
      window.removeEventListener("blur", syncActiveState);
      if (intervalId !== null) window.clearInterval(intervalId);
      if (expiryTimeoutId !== null) window.clearTimeout(expiryTimeoutId);

      collectActiveTime();
      activeSince = null;
      void flushProgress();
    }

    void api
      .startDetailView(issueId, viewId, {
        sessionId: getIssueActivitySessionId(),
      })
      .then((response) => {
        if (disposed) return;

        viewStarted = true;
        syncActiveState();
        document.addEventListener("visibilitychange", syncActiveState);
        window.addEventListener("focus", syncActiveState);
        window.addEventListener("blur", syncActiveState);
        intervalId = window.setInterval(
          () => void flushProgress(),
          PROGRESS_INTERVAL_MS,
        );
        const expiresIn = Date.parse(response.expiresAt) - Date.now();
        if (Number.isFinite(expiresIn)) {
          expiryTimeoutId = window.setTimeout(
            stopTracking,
            Math.max(0, expiresIn - 250),
          );
        }
      })
      .catch(() => {
        // 열람 기록 실패가 상세 콘텐츠 확인을 막지 않도록 별도 UI 오류로 전환하지 않는다.
      });

    return () => {
      disposed = true;
      stopTracking();
    };
  }, [api, authStatus, enabled, issueId]);
}
