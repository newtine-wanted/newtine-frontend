"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { getProblemDetails } from "@/domain/auth";
import { authSessionStore } from "@/domain/auth/store";
import { getIssueActivitySessionId } from "@/domain/issue-activity-session";
import { feedApi } from "./api";
import { getCachedFeed } from "./feed-cache";
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

export interface FeedController {
  currentCard: FeedCardResponse | null;
  previousCard: FeedCardResponse | null;
  nextCard: FeedCardResponse | null;
  currentIndex: number;
  remainingCount: number;
  continuation: FeedContinuation;
  status: FeedStatus;
  isAuthenticated: boolean;
  canGoBack: boolean;
  likedCount: number;
  isLoadingMore: boolean;
  isSubmittingInteraction: boolean;
  failedInteractionCount: number;
  loadError: string | null;
  interactionError: string | null;
  likeCurrentCard: () => void;
  passCurrentCard: () => void;
  skipCurrentCard: () => void;
  goToPreviousCard: () => void;
  retryLoad: () => Promise<void>;
  retryInteraction: () => void;
  ensureLoaded: () => Promise<void>;
}

interface FeedSessionProviderProps {
  children: ReactNode;
  api?: FeedApi;
}

const FeedSessionContext = createContext<FeedController | null>(null);

function getErrorMessage(error: unknown, fallback: string) {
  return getProblemDetails(error)?.detail ?? fallback;
}

export function FeedSessionProvider({
  children,
  api = feedApi,
}: FeedSessionProviderProps) {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const authRevision = useStore(authSessionStore, (state) => state.revision);
  const sessionKey = `${authStatus}:${authRevision}`;
  const sessionKeyRef = useRef(sessionKey);

  const [items, setItems] = useState<FeedCardResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIssueIdRef = useRef<string | null>(null);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [continuation, setContinuation] =
    useState<FeedContinuation>("CONTINUE");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingInteractionCount, setPendingInteractionCount] = useState(0);
  const [failedInteractionCount, setFailedInteractionCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [actionsByIssueId, setActionsByIssueId] = useState<
    Record<string, IssueInteractionAction>
  >({});

  const failedInteractionsRef = useRef(new Map<string, PendingInteraction>());
  const initialLoadPromiseRef = useRef<Promise<void> | null>(null);
  const loadMorePromiseRef = useRef<Promise<void> | null>(null);
  const previousSessionKeyRef = useRef(sessionKey);

  useEffect(() => {
    sessionKeyRef.current = sessionKey;
    if (previousSessionKeyRef.current === sessionKey) return;

    previousSessionKeyRef.current = sessionKey;
    initialLoadPromiseRef.current = null;
    loadMorePromiseRef.current = null;
    failedInteractionsRef.current.clear();
    setItems([]);
    setCurrentIndex(0);
    currentIssueIdRef.current = null;
    setFurthestIndex(0);
    setNextCursor(null);
    setContinuation("CONTINUE");
    setHasLoaded(false);
    setIsInitialLoading(true);
    setIsLoadingMore(false);
    setPendingInteractionCount(0);
    setFailedInteractionCount(0);
    setLoadError(null);
    setInteractionError(null);
    setActionsByIssueId({});
  }, [sessionKey]);

  const currentCard = items[currentIndex] ?? null;
  const nextCard = items[currentIndex + 1] ?? null;
  const remainingCount = Math.max(items.length - currentIndex, 0);
  const earliestHistoryIndex = Math.max(0, furthestIndex - MAX_HISTORY_COUNT);
  const canGoBack = currentIndex > earliestHistoryIndex;
  const previousCard = canGoBack ? (items[currentIndex - 1] ?? null) : null;
  const likedCount = Object.values(actionsByIssueId).filter(
    (action) => action === "LIKE",
  ).length;

  const loadInitialFeed = useCallback(
    async (force = false) => {
      if (authStatus === "initializing") return;
      if (!force && hasLoaded) return;
      if (!force && initialLoadPromiseRef.current) {
        return initialLoadPromiseRef.current;
      }

      const requestSessionKey = sessionKey;
      const request = (async () => {
        setIsInitialLoading(true);
        setLoadError(null);

        try {
          const response = await getCachedFeed(
            api,
            requestSessionKey,
            undefined,
            force,
          );

          if (sessionKeyRef.current !== requestSessionKey) return;

          const restoredIndex = currentIssueIdRef.current
            ? response.items.findIndex(
                (item) => item.issueId === currentIssueIdRef.current,
              )
            : 0;
          const nextIndex = restoredIndex >= 0 ? restoredIndex : 0;
          const restoredCard = response.items[nextIndex] ?? null;

          setItems(response.items);
          setCurrentIndex(nextIndex);
          currentIssueIdRef.current = restoredCard?.issueId ?? null;
          setFurthestIndex(nextIndex);
          setNextCursor(response.nextCursor);
          setContinuation(response.continuation);
          setHasLoaded(true);
        } catch (error) {
          if (sessionKeyRef.current !== requestSessionKey) return;
          setLoadError(
            getErrorMessage(error, "피드를 불러오는 중 문제가 발생했습니다."),
          );
        } finally {
          if (sessionKeyRef.current === requestSessionKey) {
            setIsInitialLoading(false);
          }
        }
      })();

      const trackedRequest = request.finally(() => {
        if (initialLoadPromiseRef.current === trackedRequest) {
          initialLoadPromiseRef.current = null;
        }
      });
      initialLoadPromiseRef.current = trackedRequest;
      return trackedRequest;
    },
    [api, authStatus, hasLoaded, sessionKey],
  );

  const ensureLoaded = useCallback(() => loadInitialFeed(), [loadInitialFeed]);

  const loadMore = useCallback(
    async (targetIndex?: number) => {
      if (!nextCursor || loadMorePromiseRef.current) return;

      const requestSessionKey = sessionKey;
      const cursor = nextCursor;
      const request = (async () => {
        setIsLoadingMore(true);
        setLoadError(null);

        try {
          const response = await getCachedFeed(api, requestSessionKey, cursor);
          if (sessionKeyRef.current !== requestSessionKey) return;

          const existingIssueIds = new Set(items.map((item) => item.issueId));
          const newItems = response.items.filter(
            (item) => !existingIssueIds.has(item.issueId),
          );
          const mergedItems = [...items, ...newItems];
          setItems(mergedItems);
          if (currentIssueIdRef.current === null) {
            currentIssueIdRef.current =
              mergedItems[targetIndex ?? currentIndex]?.issueId ?? null;
          }
          setNextCursor(response.nextCursor);
          setContinuation(response.continuation);
        } catch (error) {
          if (sessionKeyRef.current !== requestSessionKey) return;
          setLoadError(
            getErrorMessage(
              error,
              "다음 피드를 불러오는 중 문제가 발생했습니다.",
            ),
          );
        } finally {
          if (sessionKeyRef.current === requestSessionKey) {
            setIsLoadingMore(false);
          }
        }
      })();

      const trackedRequest = request.finally(() => {
        if (loadMorePromiseRef.current === trackedRequest) {
          loadMorePromiseRef.current = null;
        }
      });
      loadMorePromiseRef.current = trackedRequest;
      await trackedRequest;
    },
    [api, currentIndex, items, nextCursor, sessionKey],
  );

  const submitInteraction = useCallback(
    async (pendingInteraction: PendingInteraction) => {
      const { eventId } = pendingInteraction.request;
      const requestSessionKey = sessionKey;
      setPendingInteractionCount((count) => count + 1);

      try {
        await api.recordInteraction(
          pendingInteraction.issueId,
          pendingInteraction.request,
        );
        if (sessionKeyRef.current !== requestSessionKey) return;

        failedInteractionsRef.current.delete(eventId);
        setFailedInteractionCount(failedInteractionsRef.current.size);
        if (failedInteractionsRef.current.size === 0) {
          setInteractionError(null);
        } else {
          setInteractionError("일부 카드 반응을 아직 기록하지 못했습니다.");
        }
      } catch (error) {
        if (sessionKeyRef.current !== requestSessionKey) return;

        failedInteractionsRef.current.set(eventId, pendingInteraction);
        setFailedInteractionCount(failedInteractionsRef.current.size);
        setInteractionError(
          getErrorMessage(
            error,
            "카드 반응을 기록하는 중 문제가 발생했습니다.",
          ),
        );
      } finally {
        if (sessionKeyRef.current === requestSessionKey) {
          setPendingInteractionCount((count) => Math.max(0, count - 1));
        }
      }
    },
    [api, sessionKey],
  );

  const reactToCurrentCard = useCallback(
    (action: IssueInteractionAction) => {
      if (!currentCard) return;

      setActionsByIssueId((current) => ({
        ...current,
        [currentCard.issueId]: action,
      }));
      const nextIndex = currentIndex + 1;
      const nextCard = items[nextIndex] ?? null;
      setCurrentIndex(nextIndex);
      currentIssueIdRef.current = nextCard?.issueId ?? null;
      setFurthestIndex((furthest) => Math.max(furthest, nextIndex));

      if (
        items.length - nextIndex <= PRELOAD_THRESHOLD &&
        nextCursor &&
        !loadMorePromiseRef.current &&
        !loadError
      ) {
        void loadMore(nextIndex);
      }

      if (authStatus === "authenticated") {
        void submitInteraction({
          issueId: currentCard.issueId,
          request: {
            eventId: crypto.randomUUID(),
            sessionId: getIssueActivitySessionId(),
            action,
          },
        });
      }
    },
    [
      authStatus,
      currentCard,
      currentIndex,
      items,
      loadError,
      loadMore,
      nextCursor,
      submitInteraction,
    ],
  );

  const goToPreviousCard = useCallback(() => {
    if (currentIndex <= Math.max(0, furthestIndex - MAX_HISTORY_COUNT)) {
      return;
    }

    const previousIndex = currentIndex - 1;
    const previousCard = items[previousIndex] ?? null;
    setCurrentIndex(previousIndex);
    currentIssueIdRef.current = previousCard?.issueId ?? null;
  }, [currentIndex, furthestIndex, items]);

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
      await loadInitialFeed(true);
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

  const likeCurrentCard = useCallback(
    () => reactToCurrentCard("LIKE"),
    [reactToCurrentCard],
  );
  const passCurrentCard = useCallback(
    () => reactToCurrentCard("PASS"),
    [reactToCurrentCard],
  );
  const skipCurrentCard = useCallback(
    () => reactToCurrentCard("SKIP"),
    [reactToCurrentCard],
  );

  const value = useMemo<FeedController>(
    () => ({
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
      likeCurrentCard,
      passCurrentCard,
      skipCurrentCard,
      goToPreviousCard,
      retryLoad,
      retryInteraction,
      ensureLoaded,
    }),
    [
      authStatus,
      canGoBack,
      continuation,
      currentCard,
      currentIndex,
      ensureLoaded,
      failedInteractionCount,
      goToPreviousCard,
      interactionError,
      isLoadingMore,
      likeCurrentCard,
      loadError,
      nextCard,
      passCurrentCard,
      pendingInteractionCount,
      previousCard,
      remainingCount,
      retryInteraction,
      retryLoad,
      skipCurrentCard,
      status,
      likedCount,
    ],
  );

  return (
    <FeedSessionContext.Provider value={value}>
      {children}
    </FeedSessionContext.Provider>
  );
}

export function useFeedSession() {
  const context = useContext(FeedSessionContext);
  if (!context) {
    throw new Error("useFeedSession must be used within FeedSessionProvider");
  }

  return context;
}
