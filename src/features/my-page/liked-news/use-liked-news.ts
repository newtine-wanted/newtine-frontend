"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { getProblemDetails } from "@/domain/auth";
import { authSessionStore } from "@/domain/auth/store";
import { getLikedIssues, getLikedNewsCategories } from "./api";
import type { LikedIssue, LikedNewsCategory } from "./types";

export type LikedNewsState = ReturnType<typeof useLikedNews>;

function getErrorMessage(error: unknown, fallback: string) {
  return getProblemDetails(error)?.detail ?? fallback;
}

export function useLikedNews() {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const [categories, setCategories] = useState<LikedNewsCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [items, setItems] = useState<LikedIssue[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [categoriesReloadCount, setCategoriesReloadCount] = useState(0);
  const [issuesReloadCount, setIssuesReloadCount] = useState(0);
  // 조회 대상이 바뀌면 이미 떠 있는 더보기 응답을 버리려고 세대를 센다.
  const requestGenerationRef = useRef(0);

  useEffect(() => {
    let ignore = false;

    void getLikedNewsCategories()
      .then((response) => {
        if (ignore) return;
        setCategoriesError(null);
        setCategories(response);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        // 칩만 못 쓰게 될 뿐이므로 목록의 에러 슬롯과 섞지 않는다.
        setCategoriesError(
          getErrorMessage(
            error,
            "주제 목록을 불러오는 중 문제가 발생했습니다.",
          ),
        );
      });

    return () => {
      ignore = true;
    };
  }, [categoriesReloadCount]);

  useEffect(() => {
    // 세션 복원 전에는 토큰이 없어 확정 401을 부르므로 기다린다.
    if (authStatus === "initializing") return;

    let ignore = false;

    void getLikedIssues({ categoryCode: selectedCode ?? undefined })
      .then((response) => {
        if (ignore) return;
        setLoadError(null);
        setItems(response.items);
        setTotalCount(response.totalCount);
        setNextCursor(response.nextCursor);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        setLoadError(
          getErrorMessage(
            error,
            "관심 뉴스를 불러오는 중 문제가 발생했습니다.",
          ),
        );
      })
      .finally(() => {
        if (!ignore) setIsInitialLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [authStatus, issuesReloadCount, selectedCode]);

  const selectCategory = useCallback(
    (code: string | null) => {
      if (code === selectedCode) return;

      // 필터가 바뀌면 커서를 버리고 1페이지부터 다시 받는다.
      requestGenerationRef.current += 1;
      setSelectedCode(code);
      setNextCursor(null);
      setIsInitialLoading(true);
      setLoadError(null);
      setLoadMoreError(null);
    },
    [selectedCode],
  );

  const retry = useCallback(() => {
    requestGenerationRef.current += 1;
    setIsInitialLoading(true);
    setLoadError(null);
    setCategoriesError(null);
    setCategoriesReloadCount((count) => count + 1);
    setIssuesReloadCount((count) => count + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    const generation = requestGenerationRef.current;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await getLikedIssues({
        categoryCode: selectedCode ?? undefined,
        cursor: nextCursor,
      });
      // 기다리는 사이 필터가 바뀌었으면 다른 조회의 결과이므로 버린다.
      if (generation !== requestGenerationRef.current) return;

      setItems((current) => [...current, ...response.items]);
      setTotalCount(response.totalCount);
      setNextCursor(response.nextCursor);
    } catch (error) {
      if (generation !== requestGenerationRef.current) return;

      // 커서가 무효해진 400은 필터를 유지한 채 1페이지부터 다시 받는다.
      if (getProblemDetails(error)?.status === 400) {
        setNextCursor(null);
        setIsInitialLoading(true);
        setIssuesReloadCount((count) => count + 1);
        return;
      }

      setLoadMoreError(
        getErrorMessage(
          error,
          "다음 관심 뉴스를 불러오는 중 문제가 발생했습니다.",
        ),
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor, selectedCode]);

  const selectedCategoryName =
    categories.find((category) => category.code === selectedCode)?.name ??
    "전체";

  return {
    categories,
    categoriesError,
    isInitialLoading,
    isLoadingMore,
    items,
    loadError,
    loadMore,
    loadMoreError,
    nextCursor,
    retry,
    selectCategory,
    selectedCategoryName,
    selectedCode,
    totalCount,
  };
}
