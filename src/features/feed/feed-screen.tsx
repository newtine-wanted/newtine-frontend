"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { AppBar, Button } from "@/components/ui";
import { FeedActionBar } from "./feed-action-bar";
import { FeedCard } from "./feed-card";
import { FeedFinishedState } from "./feed-finished-state";
import { useFeedSwipe, type FeedSwipeDirection } from "./use-feed-swipe";
import { useFeed } from "./use-feed";

const TOAST_DURATION_MS = 1500;
const CARD_TRANSITION = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";

function MyPageLink() {
  return (
    <Link
      href="/my-page"
      aria-label="마이페이지로 이동"
      className="flex min-h-11 items-center gap-1 text-body-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-4"
      >
        <circle cx="10" cy="6" r="3" stroke="currentColor" />
        <path d="M4 17c.5-3.2 2.5-5 6-5s5.5 1.8 6 5" stroke="currentColor" />
      </svg>
      마이
    </Link>
  );
}

function FeedUnavailableState({
  description,
  onRetry,
}: {
  description: string;
  onRetry: () => void;
}) {
  return (
    <section className="flex h-full min-h-[37.625rem] flex-col items-center justify-center gap-5 px-6 text-center">
      <p role="status" className="text-body-sm leading-6 text-muted">
        {description}
      </p>
      <Button
        variant="ghost"
        className="w-full max-w-[310px]"
        onClick={onRetry}
      >
        다시 시도
      </Button>
    </section>
  );
}

export function FeedScreen() {
  const router = useRouter();
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

  const currentCardStyle: CSSProperties = {
    transform: `translate3d(${swipe.offset.x}px, ${swipe.offset.y}px, 0) rotate(${swipe.rotation}deg)`,
    transition: swipe.isTransitioning ? CARD_TRANSITION : undefined,
  };

  const nextCardStyle: CSSProperties =
    swipe.axis === "x"
      ? {
          opacity: swipe.horizontalProgress,
          transition: swipe.isTransitioning
            ? "opacity 180ms ease-out"
            : undefined,
        }
      : swipe.axis === "y" && swipe.offset.y < 0
        ? {
            opacity: 1,
            transform: `translate3d(0, ${swipe.viewport.height + swipe.offset.y}px, 0)`,
            transition: swipe.isTransitioning ? CARD_TRANSITION : undefined,
          }
        : { opacity: 0 };

  const previousCardStyle: CSSProperties =
    swipe.axis === "y" && swipe.offset.y > 0
      ? {
          opacity: 1,
          transform: `translate3d(0, ${-swipe.viewport.height + swipe.offset.y}px, 0)`,
          transition: swipe.isTransitioning ? CARD_TRANSITION : undefined,
        }
      : { opacity: 0 };

  const isFinished = feed.status === "empty" || feed.status === "finished";
  const actionDisabled = feed.status !== "ready" || swipe.isInteracting;

  return (
    <div className="flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-30 border-b-2 border-foreground bg-background">
        <AppBar action={<MyPageLink />} />
      </div>

      <div className="relative flex min-h-[38.625rem] flex-1 px-4 pt-1 pb-3">
        <div className="relative isolate min-h-[37.625rem] w-full flex-1 overflow-hidden">
          {feed.status === "loading" && (
            <section className="flex h-full min-h-[37.625rem] items-center justify-center px-6 text-center">
              <p role="status" className="text-body-sm text-muted">
                새로운 이슈를 불러오고 있어요
              </p>
            </section>
          )}

          {feed.status === "error" && (
            <FeedUnavailableState
              description={
                feed.loadError ?? "피드를 불러오는 중 문제가 발생했습니다."
              }
              onRetry={() => void feed.retryLoad()}
            />
          )}

          {feed.status === "limited" && (
            <FeedUnavailableState
              description="새로운 이슈를 더 찾지 못했어요. 잠시 후 다시 확인해 주세요."
              onRetry={() => void feed.retryLoad()}
            />
          )}

          {isFinished && (
            <FeedFinishedState
              hasLikedNews={feed.likedCount > 0 ? true : undefined}
              onOpenLikedNews={() => router.push("/my-page/liked-news")}
              onOpenReport={() => router.push("/report")}
            />
          )}

          {feed.currentCard && (
            <>
              {feed.nextCard && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={nextCardStyle}
                >
                  <FeedCard
                    key={`next-${feed.nextCard.issueId}`}
                    card={feed.nextCard}
                  />
                </div>
              )}

              {feed.previousCard && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={previousCardStyle}
                >
                  <FeedCard
                    key={`previous-${feed.previousCard.issueId}`}
                    card={feed.previousCard}
                  />
                </div>
              )}

              <div
                key={`current-${feed.currentCard.issueId}`}
                ref={cardElementRef}
                role="group"
                tabIndex={0}
                aria-label={`${feed.currentCard.title}. 위로 밀면 다음, 아래로 당기면 이전, 왼쪽으로 밀면 넘기기, 오른쪽으로 밀면 관심 표시`}
                onKeyDown={handleCardKeyDown}
                className="relative z-10 h-full cursor-grab touch-pinch-zoom select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
                style={currentCardStyle}
                {...swipe.pointerHandlers}
              >
                <FeedCard
                  card={feed.currentCard}
                  active
                  isInteracting={swipe.isInteracting}
                />
              </div>

              {swipe.axis === "x" && swipe.offset.x !== 0 && (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-[40%] z-20 border px-3.5 py-2 text-button font-bold text-primary-foreground ${
                    swipe.offset.x > 0
                      ? "left-5 border-positive bg-positive"
                      : "right-5 border-danger bg-danger"
                  }`}
                  style={{
                    opacity: swipe.horizontalProgress,
                    transform: `translate3d(${swipe.offset.x}px, -50%, 0)`,
                    transition: swipe.isTransitioning
                      ? CARD_TRANSITION
                      : undefined,
                  }}
                >
                  {swipe.offset.x > 0 ? "♥ 관심 있어요" : "✕ 넘기기"}
                </div>
              )}
            </>
          )}

          {(feed.interactionError || (feed.loadError && feed.currentCard)) && (
            <button
              type="button"
              onClick={
                feed.interactionError
                  ? feed.retryInteraction
                  : () => void feed.retryLoad()
              }
              className="absolute bottom-4 left-1/2 z-30 min-h-11 max-w-[calc(100%_-_2rem)] -translate-x-1/2 bg-primary px-5 py-3 text-body-sm whitespace-nowrap text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {feed.interactionError
                ? `반응 기록 실패 · 다시 시도 (${feed.failedInteractionCount})`
                : "다음 이슈 불러오기 실패 · 다시 시도"}
            </button>
          )}

          {toastMessage && !feed.interactionError && (
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="absolute bottom-4 left-1/2 z-30 min-h-11 -translate-x-1/2 bg-primary px-5 py-3 text-body-sm whitespace-nowrap text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span aria-hidden="true" className="mr-2 font-bold">
                ✓
              </span>
              {toastMessage}
            </button>
          )}
        </div>
      </div>

      <FeedActionBar
        disabled={actionDisabled}
        muted={isFinished}
        onSkip={() => triggerSwipe("left")}
        onLike={() => triggerSwipe("right")}
      />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {feed.interactionError ?? feed.loadError ?? toastMessage}
      </p>
    </div>
  );
}
