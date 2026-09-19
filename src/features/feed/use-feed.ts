"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { getProblemDetails } from "@/domain/auth";
import { authSessionStore } from "@/domain/auth/store";
import { feedApi } from "./api";
import type {
  FeedApi,
  FeedCardResponse,
  FeedContinuation,
  IssueInteractionAction,
  IssueInteractionRequest,
} from "./types";

const PRELOAD_THRESHOLD = 2;
const MAX_HISTORY_COUNT = 5;

export type FeedStatus =
  "loading" | "ready" | "empty" | "error" | "limited" | "finished";

interface PendingInteraction {
  issueId: string;
  request: IssueInteractionRequest;
}

function getErrorMessage(error: unknown, fallback: string) {
  return getProblemDetails(error)?.detail ?? fallback;
}

export function useFeed(api: FeedApi = feedApi) {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const [items, setItems] = useState<FeedCardResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [continuation, setContinuation] =
    useState<FeedContinuation>("CONTINUE");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingInteractionCount, setPendingInteractionCount] = useState(0);
  const [failedInteractionCount, setFailedInteractionCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [actionsByIssueId, setActionsByIssueId] = useState<
    Record<string, IssueInteractionAction>
  >({});

  const sessionIdRef = useRef<string | null>(null);
  const failedInteractionsRef = useRef(new Map<string, PendingInteraction>());

  const currentCard = items[currentIndex] ?? null;
  const nextCard = items[currentIndex + 1] ?? null;
  const remainingCount = Math.max(items.length - currentIndex, 0);
  const earliestHistoryIndex = Math.max(0, furthestIndex - MAX_HISTORY_COUNT);
  const canGoBack = currentIndex > earliestHistoryIndex;
  const previousCard = canGoBack ? (items[currentIndex - 1] ?? null) : null;
  const likedCount = Object.values(actionsByIssueId).filter(
    (action) => action === "LIKE",
  ).length;

  const loadInitialFeed = useCallback(async () => {
    if (authStatus === "initializing") return;

    setIsInitialLoading(true);
    setLoadError(null);

    try {
      const response = await api.getFeed();
      setItems(response.items);
      setCurrentIndex(0);
      setFurthestIndex(0);
      setNextCursor(response.nextCursor);
      setContinuation(response.continuation);
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "피드를 불러오는 중 문제가 발생했습니다."),
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, [api, authStatus]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const response = await api.getFeed(nextCursor);
      setItems((current) => [...current, ...response.items]);
      setNextCursor(response.nextCursor);
      setContinuation(response.continuation);
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "다음 피드를 불러오는 중 문제가 발생했습니다."),
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [api, isLoadingMore, nextCursor]);

  useEffect(() => {
    if (authStatus === "initializing") return;

    let ignore = false;

    void api
      .getFeed()
      .then((response) => {
        if (ignore) return;
        setItems(response.items);
        setNextCursor(response.nextCursor);
        setContinuation(response.continuation);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        setLoadError(
          getErrorMessage(error, "피드를 불러오는 중 문제가 발생했습니다."),
        );
      })
      .finally(() => {
        if (!ignore) setIsInitialLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [api, authStatus]);

  const submitInteraction = useCallback(
    async (pendingInteraction: PendingInteraction) => {
      const { eventId } = pendingInteraction.request;
      setPendingInteractionCount((count) => count + 1);

      try {
        await api.recordInteraction(
          pendingInteraction.issueId,
          pendingInteraction.request,
        );
        failedInteractionsRef.current.delete(eventId);
        setFailedInteractionCount(failedInteractionsRef.current.size);
        if (failedInteractionsRef.current.size === 0) {
          setInteractionError(null);
        } else {
          setInteractionError("일부 카드 반응을 아직 기록하지 못했습니다.");
        }
      } catch (error) {
        failedInteractionsRef.current.set(eventId, pendingInteraction);
        setFailedInteractionCount(failedInteractionsRef.current.size);
        setInteractionError(
          getErrorMessage(
            error,
            "카드 반응을 기록하는 중 문제가 발생했습니다.",
          ),
        );
      } finally {
        setPendingInteractionCount((count) => Math.max(0, count - 1));
      }
    },
    [api],
  );

  const reactToCurrentCard = useCallback(
    (action: IssueInteractionAction) => {
      if (!currentCard) return;

      setActionsByIssueId((current) => ({
        ...current,
        [currentCard.issueId]: action,
      }));
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setFurthestIndex((furthest) => Math.max(furthest, nextIndex));

      if (
        items.length - nextIndex <= PRELOAD_THRESHOLD &&
        nextCursor &&
        !isLoadingMore &&
        !loadError
      ) {
        void loadMore();
      }

      if (authStatus === "authenticated") {
        sessionIdRef.current ??= crypto.randomUUID();

        void submitInteraction({
          issueId: currentCard.issueId,
          request: {
            eventId: crypto.randomUUID(),
            sessionId: sessionIdRef.current,
            action,
          },
        });
      }
    },
    [
      authStatus,
      currentCard,
      currentIndex,
      isLoadingMore,
      items.length,
      loadError,
      loadMore,
      nextCursor,
      submitInteraction,
    ],
  );

  const goToPreviousCard = useCallback(() => {
    if (!canGoBack) return;
    setCurrentIndex((index) => index - 1);
  }, [canGoBack]);

  const retryInteraction = useCallback(() => {
    const pendingInteraction = failedInteractionsRef.current
      .values()
      .next().value;
    if (!pendingInteraction) return;

    setInteractionError(null);
    void submitInteraction(pendingInteraction);
  }, [submitInteraction]);

  const retryLoad = useCallback(async () => {
    if (items.length === 0 || !nextCursor) {
      await loadInitialFeed();
      return;
    }

    await loadMore();
  }, [items.length, loadInitialFeed, loadMore, nextCursor]);

  let status: FeedStatus = "ready";

  if (isInitialLoading || (!currentCard && isLoadingMore)) {
    status = "loading";
  } else if (!currentCard && loadError) {
    status = "error";
  } else if (!currentCard && continuation !== "EXHAUSTED") {
    status = "limited";
  } else if (!currentCard && items.length === 0) {
    status = "empty";
  } else if (!currentCard) {
    status = "finished";
  }

  return {
    currentCard,
    previousCard,
    nextCard,
    currentIndex,
    remainingCount,
    continuation,
    status,
    isAuthenticated: authStatus === "authenticated",
    canGoBack,
    likedCount,
    isLoadingMore,
    isSubmittingInteraction: pendingInteractionCount > 0,
    failedInteractionCount,
    loadError,
    interactionError,
    likeCurrentCard: () => reactToCurrentCard("LIKE"),
    passCurrentCard: () => reactToCurrentCard("PASS"),
    skipCurrentCard: () => reactToCurrentCard("SKIP"),
    goToPreviousCard,
    retryLoad,
    retryInteraction,
  };
}
