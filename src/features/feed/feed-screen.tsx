"use client";

import { AppBar } from "@/components/ui";
import { FeedActionBar } from "./feed-action-bar";
import { FeedCardDeck } from "./feed-card-deck";
import { FeedFinishedState } from "./feed-finished-state";
import { FeedLoadingState } from "./feed-loading-state";
import { FeedRetryNotice } from "./feed-retry-notice";
import { FeedToast } from "./feed-toast";
import { FeedUnavailableState } from "./feed-unavailable-state";
import { MyPageLink } from "./my-page-link";
import { useFeedScreen } from "./use-feed-screen";

export function FeedScreen() {
  const {
    feed,
    swipe,
    cardElementRef,
    toastMessage,
    dismissToast,
    handleCardKeyDown,
    openLikedNews,
    openReport,
    triggerSwipe,
    isFinished,
    actionDisabled,
  } = useFeedScreen();

  const showRetryNotice =
    feed.interactionError !== null ||
    (feed.loadError !== null && feed.currentCard !== null);

  return (
    <div className="flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-30 border-b-2 border-foreground bg-background">
        <AppBar action={<MyPageLink />} />
      </div>

      <div className="relative flex min-h-[38.625rem] flex-1 px-4 pt-1 pb-3">
        <div className="relative isolate min-h-[37.625rem] w-full flex-1 overflow-hidden">
          {feed.status === "loading" && <FeedLoadingState />}

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
              onOpenLikedNews={openLikedNews}
              onOpenReport={openReport}
            />
          )}

          {feed.currentCard && (
            <FeedCardDeck
              cardElementRef={cardElementRef}
              currentCard={feed.currentCard}
              nextCard={feed.nextCard}
              onKeyDown={handleCardKeyDown}
              previousCard={feed.previousCard}
              swipe={swipe}
            />
          )}

          {showRetryNotice && (
            <FeedRetryNotice
              failedInteractionCount={feed.failedInteractionCount}
              hasInteractionError={feed.interactionError !== null}
              onRetryInteraction={feed.retryInteraction}
              onRetryLoad={() => void feed.retryLoad()}
            />
          )}

          {toastMessage && !feed.interactionError && (
            <FeedToast message={toastMessage} onDismiss={dismissToast} />
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
