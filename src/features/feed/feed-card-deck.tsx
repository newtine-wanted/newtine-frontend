import type { CSSProperties, KeyboardEventHandler, RefObject } from "react";
import { FeedCard } from "./feed-card";
import {
  FEED_CARD_TRANSITION_EASING,
  FEED_CARD_VERTICAL_GAP_PX,
} from "./feed-card-layout";
import type { FeedCardResponse } from "./types";
import type { useFeedSwipe } from "./use-feed-swipe";

type FeedSwipe = ReturnType<typeof useFeedSwipe>;

interface FeedCardDeckProps {
  cardElementRef: RefObject<HTMLDivElement | null>;
  currentCard: FeedCardResponse;
  nextCard: FeedCardResponse | null;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  previousCard: FeedCardResponse | null;
  swipe: FeedSwipe;
}

export function FeedCardDeck({
  cardElementRef,
  currentCard,
  nextCard,
  onKeyDown,
  previousCard,
  swipe,
}: FeedCardDeckProps) {
  const isSwipingRight = swipe.offset.x > 0;
  const isShowingNextCard =
    swipe.axis === "y" &&
    (swipe.offset.y < 0 ||
      (swipe.phase === "resetting" && swipe.verticalDirection === "up"));
  const isShowingPreviousCard =
    swipe.axis === "y" &&
    (swipe.offset.y > 0 ||
      (swipe.phase === "resetting" && swipe.verticalDirection === "down"));
  const cardTransition = `transform ${swipe.transitionDurationMs}ms ${FEED_CARD_TRANSITION_EASING}`;
  const currentCardStyle: CSSProperties = {
    transform: `translate3d(${swipe.offset.x}px, ${swipe.offset.y}px, 0) rotate(${swipe.rotation}deg)`,
    transition: swipe.isTransitioning ? cardTransition : undefined,
  };

  // 숨겨진 카드도 시작 위치를 유지해야 드래그 없는 전환이 이어진다.
  const nextCardStyle: CSSProperties = {
    opacity:
      swipe.axis === "x" ? swipe.horizontalProgress : isShowingNextCard ? 1 : 0,
    transform:
      swipe.axis === "x"
        ? "translate3d(0, 0, 0)"
        : `translate3d(0, calc(100% + ${FEED_CARD_VERTICAL_GAP_PX}px + ${isShowingNextCard ? swipe.offset.y : 0}px), 0)`,
    transition: swipe.isTransitioning
      ? swipe.axis === "x"
        ? `opacity ${swipe.transitionDurationMs}ms ${FEED_CARD_TRANSITION_EASING}`
        : cardTransition
      : undefined,
  };

  const previousCardStyle: CSSProperties = {
    opacity: isShowingPreviousCard ? 1 : 0,
    transform: `translate3d(0, calc(-100% - ${FEED_CARD_VERTICAL_GAP_PX}px + ${isShowingPreviousCard ? swipe.offset.y : 0}px), 0)`,
    transition: swipe.isTransitioning ? cardTransition : undefined,
  };

  return (
    <>
      {nextCard && (
        <div
          aria-hidden="true"
          className="absolute inset-0 will-change-transform"
          style={nextCardStyle}
        >
          <FeedCard key={`next-${nextCard.issueId}`} card={nextCard} />
        </div>
      )}

      {previousCard && (
        <div
          aria-hidden="true"
          className="absolute inset-0 will-change-transform"
          style={previousCardStyle}
        >
          <FeedCard
            key={`previous-${previousCard.issueId}`}
            card={previousCard}
          />
        </div>
      )}

      <div
        key={`current-${currentCard.issueId}`}
        ref={cardElementRef}
        role="link"
        tabIndex={0}
        aria-label={`${currentCard.title}. 탭하거나 Enter 키를 누르면 상세 보기. 위로 밀면 다음, 아래로 당기면 이전, 왼쪽으로 밀면 넘기기, 오른쪽으로 밀면 관심 표시`}
        onKeyDown={onKeyDown}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "transform"
          ) {
            swipe.completeTransition();
          }
        }}
        className="relative z-10 h-full min-h-max cursor-grab touch-pinch-zoom will-change-transform select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
        style={currentCardStyle}
        {...swipe.pointerHandlers}
      >
        <FeedCard
          card={currentCard}
          active
          isInteracting={swipe.isInteracting}
        />
      </div>

      {swipe.axis === "x" && swipe.offset.x !== 0 && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-[40%] z-20 border px-3.5 py-2 text-button font-bold whitespace-nowrap text-primary-foreground ${
            isSwipingRight
              ? "left-0 border-positive bg-positive"
              : "right-0 border-danger bg-danger"
          }`}
          style={{
            opacity: swipe.horizontalProgress,
            transform: isSwipingRight
              ? `translate3d(calc(${swipe.offset.x}px - 100% - 0.75rem), -50%, 0)`
              : `translate3d(calc(${swipe.offset.x}px + 100% + 0.75rem), -50%, 0)`,
            transition: swipe.isTransitioning ? cardTransition : undefined,
          }}
        >
          {isSwipingRight ? "♥ 관심 있어요" : "✕ 넘기기"}
        </div>
      )}
    </>
  );
}
