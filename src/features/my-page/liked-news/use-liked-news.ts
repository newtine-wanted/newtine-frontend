"use client";

import { useCallback, useEffect, useState } from "react";
import { getProblemDetails } from "@/domain/auth";
import { getLikedIssues, getLikedNewsCategories } from "./api";
import type { LikedIssue, LikedNewsCategory } from "./types";

export type LikedNewsState = ReturnType<typeof useLikedNews>;

function getErrorMessage(error: unknown, fallback: string) {
  return getProblemDetails(error)?.detail ?? fallback;
}

export function useLikedNews() {
  const [categories, setCategories] = useState<LikedNewsCategory[]>([]);
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

  useEffect(() => {
    let ignore = false;

    void getLikedNewsCategories()
      .then((response) => {
        if (ignore) return;
        setCategories(response);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        setLoadError(
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
    let ignore = false;

    void getLikedIssues({ categoryCode: selectedCode ?? undefined })
      .then((response) => {
        if (ignore) return;
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
  }, [issuesReloadCount, selectedCode]);

  const selectCategory = useCallback(
    (code: string | null) => {
      if (code === selectedCode) return;

      // 필터가 바뀌면 커서를 버리고 1페이지부터 다시 받는다.
      setSelectedCode(code);
      setNextCursor(null);
      setIsInitialLoading(true);
      setLoadError(null);
      setLoadMoreError(null);
    },
    [selectedCode],
  );

  const retry = useCallback(() => {
    setIsInitialLoading(true);
    setLoadError(null);
    setCategoriesReloadCount((count) => count + 1);
    setIssuesReloadCount((count) => count + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await getLikedIssues({
        categoryCode: selectedCode ?? undefined,
        cursor: nextCursor,
      });
      setItems((current) => [...current, ...response.items]);
      setTotalCount(response.totalCount);
      setNextCursor(response.nextCursor);
    } catch (error) {
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
