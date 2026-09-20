"use client";

import { useCallback, useEffect, useState } from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";
import { getInterestAnalysis } from "./api";
import type { InterestAnalysisResponse } from "./types";

// 훅과 화면이 같은 문구를 쓰도록 한 곳에서만 정의한다.
export const ANALYSIS_ERROR_MESSAGE =
  "관심 분석을 불러오는 중 문제가 발생했습니다.";

export function useMyPage() {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const email = useStore(
    authSessionStore,
    (state) => state.user?.email ?? null,
  );
  const [analysis, setAnalysis] = useState<InterestAnalysisResponse | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // 토큰 복원 전에 요청하면 인증 헤더 없이 나가 401을 확정으로 받는다.
    if (authStatus === "initializing") return;

    let ignore = false;

    void getInterestAnalysis()
      .then((response) => {
        if (ignore) return;
        setAnalysis(response);
      })
      .catch(() => {
        if (ignore) return;
        setAnalysis(null);
        setErrorMessage(ANALYSIS_ERROR_MESSAGE);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [authStatus, reloadCount]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setReloadCount((count) => count + 1);
  }, []);

  return { analysis, email, errorMessage, isLoading, reload };
}
