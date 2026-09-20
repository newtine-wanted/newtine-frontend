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
    // 인증 완료 전에는 요청하지 않아 비회원 요청과 토큰 없는 401을 막는다.
    if (authStatus !== "authenticated") return;

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
