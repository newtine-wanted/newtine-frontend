import type { CSSProperties, KeyboardEventHandler, RefObject } from "react";
import { FeedCard } from "./feed-card";
import type { FeedCardResponse } from "./types";
import type { useFeedSwipe } from "./use-feed-swipe";

const SWIPE_TRANSITION_DURATION_MS = 320;
const CARD_TRANSITION = `transform ${SWIPE_TRANSITION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

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
  const currentCardStyle: CSSProperties = {
    transform: `translate3d(${swipe.offset.x}px, ${swipe.offset.y}px, 0) rotate(${swipe.rotation}deg)`,
    transition: swipe.isTransitioning ? CARD_TRANSITION : undefined,
  };

  const nextCardStyle: CSSProperties =
    swipe.axis === "x"
      ? {
          opacity: swipe.horizontalProgress,
          transition: swipe.isTransitioning
            ? `opacity ${SWIPE_TRANSITION_DURATION_MS}ms ease-out`
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

  return (
    <>
      {nextCard && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={nextCardStyle}
        >
          <FeedCard key={`next-${nextCard.issueId}`} card={nextCard} />
        </div>
      )}

      {previousCard && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
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
        role="group"
        tabIndex={0}
        aria-label={`${currentCard.title}. 위로 밀면 다음, 아래로 당기면 이전, 왼쪽으로 밀면 넘기기, 오른쪽으로 밀면 관심 표시`}
        onKeyDown={onKeyDown}
        className="relative z-10 h-full cursor-grab touch-pinch-zoom select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
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
            transition: swipe.isTransitioning ? CARD_TRANSITION : undefined,
          }}
        >
          {isSwipingRight ? "♥ 관심 있어요" : "✕ 넘기기"}
        </div>
      )}
    </>
  );
}
