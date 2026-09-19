"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useFeed } from "./use-feed";
import { useFeedSwipe, type FeedSwipeDirection } from "./use-feed-swipe";

const TOAST_DURATION_MS = 1500;

export function useFeedScreen() {
  const feed = useFeed();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleCommit = useCallback(
    (direction: FeedSwipeDirection) => {
      if (direction === "left") {
        feed.skipCurrentCard();
        showToast("다음 이슈로 넘어갈게요");
        return;
      }
      if (direction === "right") {
        feed.likeCurrentCard();
        showToast("관심 있다고 기억할게요");
        return;
      }
      if (direction === "up") {
        feed.passCurrentCard();
        return;
      }
      feed.goToPreviousCard();
    },
    [feed, showToast],
  );

  const swipe = useFeedSwipe({
    canGoBack: feed.canGoBack,
    disabled: feed.status !== "ready" || !feed.currentCard,
    onCommit: handleCommit,
  });

  function triggerSwipe(direction: FeedSwipeDirection) {
    const bounds = cardElementRef.current?.getBoundingClientRect();
    swipe.triggerSwipe(
      direction,
      bounds ? { width: bounds.width, height: bounds.height } : undefined,
    );
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.repeat || swipe.isInteracting) return;

    const directionByKey: Partial<Record<string, FeedSwipeDirection>> = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    };
    const direction = directionByKey[event.key];
    if (!direction || (direction === "down" && !feed.canGoBack)) return;

    event.preventDefault();
    triggerSwipe(direction);
  }

  const isFinished = feed.status === "empty" || feed.status === "finished";

  return {
    feed,
    swipe,
    cardElementRef,
    toastMessage,
    dismissToast: () => setToastMessage(null),
    handleCardKeyDown,
    triggerSwipe,
    isFinished,
    actionDisabled: feed.status !== "ready" || swipe.isInteracting,
  };
}
