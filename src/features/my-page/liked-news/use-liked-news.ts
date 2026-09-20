"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { getProblemDetails, getResponseStatus } from "@/domain/auth";
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
  // 이름과 건수가 따로 움직이면 헤더가 틀린 값을 말하므로 응답과 함께 전진시킨다.
  const [displayedCode, setDisplayedCode] = useState<string | null>(null);
  const [items, setItems] = useState<LikedIssue[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  // 되감기는 실패가 아니므로 재시도 버튼을 띄우는 에러와 슬롯을 나눈다.
  const [loadMoreNotice, setLoadMoreNotice] = useState<string | null>(null);
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
        setDisplayedCode(selectedCode);
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
      setLoadMoreNotice(null);
    },
    [selectedCode],
  );

  const retry = useCallback(() => {
    requestGenerationRef.current += 1;
    setIsInitialLoading(true);
    setLoadError(null);
    setCategoriesError(null);
    setLoadMoreError(null);
    setLoadMoreNotice(null);
    setCategoriesReloadCount((count) => count + 1);
    setIssuesReloadCount((count) => count + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    const generation = requestGenerationRef.current;

    setIsLoadingMore(true);
    setLoadMoreError(null);
    setLoadMoreNotice(null);

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
      if (getResponseStatus(error) === 400) {
        setLoadMoreNotice("목록이 갱신되어 처음부터 다시 불러왔어요.");
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

  // 이름을 모르는 코드를 "전체"로 부르면 필터가 걸린 화면에 거짓 안내가 나간다.
  const displayedCategoryName =
    displayedCode === null
      ? "전체"
      : (categories.find((category) => category.code === displayedCode)?.name ??
        null);

  return {
    categories,
    categoriesError,
    displayedCategoryName,
    isInitialLoading,
    isLoadingMore,
    items,
    loadError,
    loadMore,
    loadMoreError,
    loadMoreNotice,
    nextCursor,
    retry,
    selectCategory,
    selectedCode,
    totalCount,
  };
}
