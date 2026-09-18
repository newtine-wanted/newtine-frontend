"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { feedApi } from "./api";
import type {
  FeedApi,
  FeedCardResponse,
  FeedContinuation,
  IssueInteractionAction,
  IssueInteractionRequest,
} from "./types";

const PRELOAD_THRESHOLD = 2;

export type FeedStatus = "loading" | "ready" | "empty" | "error" | "finished";

interface PendingInteraction {
  issueId: string;
  request: IssueInteractionRequest;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useFeed(api: FeedApi = feedApi) {
  const [items, setItems] = useState<FeedCardResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [continuation, setContinuation] =
    useState<FeedContinuation>("CONTINUE");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmittingInteraction, setIsSubmittingInteraction] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  const pendingInteractionRef = useRef<PendingInteraction | null>(null);

  const currentCard = items[currentIndex] ?? null;
  const remainingCount = Math.max(items.length - currentIndex, 0);

  const loadInitialFeed = useCallback(async () => {
    setIsInitialLoading(true);
    setLoadError(null);

    try {
      const response = await api.getFeed();
      setItems(response.items);
      setCurrentIndex(0);
      setNextCursor(response.nextCursor);
      setContinuation(response.continuation);
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "피드를 불러오는 중 문제가 발생했습니다."),
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, [api]);

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
  }, [api]);

  const submitInteraction = useCallback(
    async ({ issueId, request }: PendingInteraction) => {
      setIsSubmittingInteraction(true);
      setInteractionError(null);

      try {
        await api.recordInteraction(issueId, request);
        pendingInteractionRef.current = null;
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (
          items.length - nextIndex <= PRELOAD_THRESHOLD &&
          nextCursor &&
          !isLoadingMore &&
          !loadError
        ) {
          void loadMore();
        }
      } catch (error) {
        setInteractionError(
          getErrorMessage(
            error,
            "카드 반응을 기록하는 중 문제가 발생했습니다.",
          ),
        );
      } finally {
        setIsSubmittingInteraction(false);
      }
    },
    [
      api,
      currentIndex,
      isLoadingMore,
      items.length,
      loadError,
      loadMore,
      nextCursor,
    ],
  );

  const reactToCurrentCard = useCallback(
    async (action: IssueInteractionAction) => {
      if (!currentCard || isSubmittingInteraction) return;

      sessionIdRef.current ??= crypto.randomUUID();

      const pendingInteraction: PendingInteraction = {
        issueId: currentCard.issueId,
        request: {
          eventId: crypto.randomUUID(),
          sessionId: sessionIdRef.current,
          action,
        },
      };

      pendingInteractionRef.current = pendingInteraction;
      await submitInteraction(pendingInteraction);
    },
    [currentCard, isSubmittingInteraction, submitInteraction],
  );

  const retryInteraction = useCallback(async () => {
    if (!pendingInteractionRef.current || isSubmittingInteraction) return;
    await submitInteraction(pendingInteractionRef.current);
  }, [isSubmittingInteraction, submitInteraction]);

  const retryLoad = useCallback(async () => {
    if (items.length === 0) {
      await loadInitialFeed();
      return;
    }

    await loadMore();
  }, [items.length, loadInitialFeed, loadMore]);

  let status: FeedStatus = "ready";

  if (isInitialLoading || (!currentCard && isLoadingMore)) {
    status = "loading";
  } else if (!currentCard && loadError) {
    status = "error";
  } else if (!currentCard && items.length === 0) {
    status = "empty";
  } else if (!currentCard) {
    status = "finished";
  }

  return {
    currentCard,
    currentIndex,
    remainingCount,
    continuation,
    status,
    isLoadingMore,
    isSubmittingInteraction,
    loadError,
    interactionError,
    likeCurrentCard: () => reactToCurrentCard("LIKE"),
    passCurrentCard: () => reactToCurrentCard("PASS"),
    skipCurrentCard: () => reactToCurrentCard("SKIP"),
    retryLoad,
    retryInteraction,
  };
}
