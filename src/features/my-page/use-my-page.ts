"use client";

import { useCallback, useEffect, useState } from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";
import { getInterestAnalysis } from "./api";
import type { InterestAnalysisResponse } from "./types";

export function useMyPage() {
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
    let ignore = false;

    void getInterestAnalysis()
      .then((response) => {
        if (ignore) return;
        setAnalysis(response);
      })
      .catch(() => {
        if (ignore) return;
        setAnalysis(null);
        setErrorMessage("관심 분석을 불러오는 중 문제가 발생했습니다.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setReloadCount((count) => count + 1);
  }, []);

  return { analysis, email, errorMessage, isLoading, reload };
}
