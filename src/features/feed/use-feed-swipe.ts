"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import {
  FEED_CARD_TRANSITION_DURATION_MS,
  FEED_CARD_TRANSITION_MIN_DURATION_MS,
  FEED_CARD_VERTICAL_GAP_PX,
} from "./feed-card-layout";

const AXIS_LOCK_DISTANCE = 12;
const TAP_MAX_DISTANCE = 8;
const TAP_MAX_DURATION_MS = 200;
const COMMIT_DISTANCE_RATIO = 0.3;
const COMMIT_VELOCITY = 0.5;
const RELEASE_VELOCITY_MAX_AGE_MS = 80;
const MAX_ROTATION = 12;

export type FeedSwipeDirection = "left" | "right" | "up" | "down";
type SwipeAxis = "x" | "y" | null;
type SwipePhase = "idle" | "dragging" | "committing" | "resetting";
type VerticalSwipeDirection = "down" | "up" | null;

interface Point {
  x: number;
  y: number;
  time: number;
}

interface UseFeedSwipeOptions {
  canGoBack: boolean;
  disabled?: boolean;
  onCommit: (direction: FeedSwipeDirection) => void;
  onTap?: () => void;
}

interface SwipeViewport {
  width: number;
  height: number;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getTransitionDuration(
  remainingDistance: number,
  fullDistance: number,
  velocity = 0,
) {
  if (remainingDistance < 0.5) return 0;

  const distanceDuration =
    FEED_CARD_TRANSITION_DURATION_MS *
    clamp(remainingDistance / Math.max(1, fullDistance), 0, 1);
  const velocityDuration =
    velocity > 0 ? remainingDistance / velocity : distanceDuration;

  // 끝에 가까우면 최소 시간보다도 짧게 끝내고, 빠른 입력은 속도를 반영한다.
  return Math.max(
    1,
    Math.round(
      Math.min(
        distanceDuration,
        Math.max(FEED_CARD_TRANSITION_MIN_DURATION_MS, velocityDuration),
      ),
    ),
  );
}

export function useFeedSwipe({
  canGoBack,
  disabled = false,
  onCommit,
  onTap,
}: UseFeedSwipeOptions) {
  const [phase, setPhase] = useState<SwipePhase>("idle");
  const [axis, setAxis] = useState<SwipeAxis>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 358, height: 602 });
  const [transitionDurationMs, setTransitionDurationMs] = useState(
    FEED_CARD_TRANSITION_DURATION_MS,
  );
  const [verticalDirection, setVerticalDirection] =
    useState<VerticalSwipeDirection>(null);

  const pointerIdRef = useRef<number | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const phaseRef = useRef<SwipePhase>("idle");
  const axisRef = useRef<SwipeAxis>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef(viewport);
  const onCommitRef = useRef(onCommit);
  const pendingDirectionRef = useRef<FeedSwipeDirection | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  const completeTransition = useCallback(() => {
    if (phaseRef.current !== "committing" && phaseRef.current !== "resetting")
      return;

    clearTransitionTimer();
    const pendingDirection = pendingDirectionRef.current;
    pendingDirectionRef.current = null;

    phaseRef.current = "idle";
    axisRef.current = null;
    offsetRef.current = { x: 0, y: 0 };
    // 인덱스 교체와 위치 초기화를 함께 반영한 뒤 다음 입력을 받는다.
    flushSync(() => {
      setPhase("idle");
      setAxis(null);
      setOffset({ x: 0, y: 0 });
      setVerticalDirection(null);
      if (pendingDirection) onCommitRef.current(pendingDirection);
    });
  }, [clearTransitionTimer]);

  useLayoutEffect(() => {
    if (phase !== "committing" && phase !== "resetting") return;

    // DOM에 전환 스타일이 반영된 시점부터 누락된 종료 이벤트를 보완한다.
    const timer = setTimeout(() => {
      if (transitionTimerRef.current === timer) completeTransition();
    }, transitionDurationMs + 100);
    transitionTimerRef.current = timer;
    return clearTransitionTimer;
  }, [phase, transitionDurationMs, clearTransitionTimer, completeTransition]);

  const commit = useCallback(
    (direction: FeedSwipeDirection, measuredViewport?: SwipeViewport) => {
      if (
        disabled ||
        pointerIdRef.current !== null ||
        phaseRef.current === "committing" ||
        phaseRef.current === "resetting"
      )
        return;
      if (direction === "down" && !canGoBack) return;

      const nextAxis: SwipeAxis =
        direction === "left" || direction === "right" ? "x" : "y";
      const nextVerticalDirection: VerticalSwipeDirection =
        direction === "up" || direction === "down" ? direction : null;
      const { width, height } = measuredViewport ?? viewportRef.current;
      const verticalTravel = height + FEED_CARD_VERTICAL_GAP_PX;
      viewportRef.current = { width, height };
      setViewport({ width, height });
      const nextOffset = {
        x:
          direction === "left"
            ? -Math.max(600, width * 1.5)
            : direction === "right"
              ? Math.max(600, width * 1.5)
              : 0,
        y:
          direction === "up"
            ? -verticalTravel
            : direction === "down"
              ? verticalTravel
              : 0,
      };
      const fullTravel =
        nextAxis === "x" ? Math.abs(nextOffset.x) : verticalTravel;
      const currentTravel =
        nextAxis === "x" ? offsetRef.current.x : offsetRef.current.y;
      const targetTravel = nextAxis === "x" ? nextOffset.x : nextOffset.y;
      const releaseVelocity =
        phaseRef.current === "dragging"
          ? nextAxis === "x"
            ? velocityRef.current.x
            : velocityRef.current.y
          : 0;
      const nextTransitionDuration = getTransitionDuration(
        Math.abs(targetTravel - currentTravel),
        fullTravel,
        releaseVelocity * Math.sign(targetTravel - currentTravel),
      );

      axisRef.current = nextAxis;
      offsetRef.current = nextOffset;
      pendingDirectionRef.current = direction;
      phaseRef.current = "committing";
      setAxis(nextAxis);
      setOffset(nextOffset);
      setVerticalDirection(nextVerticalDirection);
      setTransitionDurationMs(nextTransitionDuration);
      setPhase("committing");
      if (nextTransitionDuration === 0) completeTransition();
    },
    [canGoBack, completeTransition, disabled],
  );

  const reset = useCallback(() => {
    if (phaseRef.current !== "dragging") return;

    const currentTravel = Math.hypot(offsetRef.current.x, offsetRef.current.y);
    const fullTravel =
      axisRef.current === "x"
        ? Math.max(600, viewportRef.current.width * 1.5)
        : viewportRef.current.height + FEED_CARD_VERTICAL_GAP_PX;
    const nextTransitionDuration =
      currentTravel < 0.5
        ? 0
        : Math.max(
            FEED_CARD_TRANSITION_MIN_DURATION_MS,
            getTransitionDuration(currentTravel, fullTravel),
          );

    offsetRef.current = { x: 0, y: 0 };
    pendingDirectionRef.current = null;
    phaseRef.current = "resetting";
    setOffset({ x: 0, y: 0 });
    setTransitionDurationMs(nextTransitionDuration);
    setPhase("resetting");
    if (nextTransitionDuration === 0) completeTransition();
  }, [completeTransition]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || phaseRef.current !== "idle" || event.button !== 0) return;
    if (
      pointerIdRef.current !== null &&
      pointerIdRef.current !== event.pointerId
    )
      return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const point = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    startPointRef.current = point;
    lastPointRef.current = point;
    velocityRef.current = { x: 0, y: 0 };
    axisRef.current = null;
    offsetRef.current = { x: 0, y: 0 };
    viewportRef.current = { width: bounds.width, height: bounds.height };
    setViewport(viewportRef.current);
    setAxis(null);
    setOffset({ x: 0, y: 0 });
    setVerticalDirection(null);
    phaseRef.current = "dragging";
    setPhase("dragging");
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      phaseRef.current !== "dragging" ||
      pointerIdRef.current !== event.pointerId ||
      !startPointRef.current ||
      !lastPointRef.current
    )
      return;

    const point = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    const dx = point.x - startPointRef.current.x;
    const dy = point.y - startPointRef.current.y;
    const distance = Math.hypot(dx, dy);
    const elapsed = Math.max(1, point.time - lastPointRef.current.time);

    velocityRef.current = {
      x: (point.x - lastPointRef.current.x) / elapsed,
      y: (point.y - lastPointRef.current.y) / elapsed,
    };
    lastPointRef.current = point;

    if (!axisRef.current && distance >= AXIS_LOCK_DISTANCE) {
      axisRef.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      setAxis(axisRef.current);
    }

    if (axisRef.current === "x") {
      const travel = Math.max(600, viewportRef.current.width * 1.5);
      offsetRef.current = { x: clamp(dx, -travel, travel), y: 0 };
      setOffset(offsetRef.current);
      return;
    }

    if (axisRef.current === "y") {
      const travel = viewportRef.current.height + FEED_CARD_VERTICAL_GAP_PX;
      const resistedY = clamp(
        dy > 0 && !canGoBack ? dy * 0.18 : dy,
        -travel,
        travel,
      );
      const nextDirection: VerticalSwipeDirection =
        resistedY < 0 ? "up" : resistedY > 0 ? "down" : null;
      offsetRef.current = { x: 0, y: resistedY };
      setVerticalDirection(nextDirection);
      setOffset(offsetRef.current);
    }
  }

  function finishPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      phaseRef.current !== "dragging" ||
      pointerIdRef.current !== event.pointerId ||
      !startPointRef.current
    )
      return;

    const startPoint = startPointRef.current;
    const dx = event.clientX - startPoint.x;
    const dy = event.clientY - startPoint.y;
    const distance = Math.hypot(dx, dy);
    const duration = event.timeStamp - startPoint.time;
    const currentAxis = axisRef.current;
    const lastPoint = lastPointRef.current;
    const elapsed = lastPoint ? event.timeStamp - lastPoint.time : Infinity;

    if (!lastPoint || elapsed > RELEASE_VELOCITY_MAX_AGE_MS) {
      velocityRef.current = { x: 0, y: 0 };
    } else if (event.clientX !== lastPoint.x || event.clientY !== lastPoint.y) {
      velocityRef.current = {
        x: (event.clientX - lastPoint.x) / Math.max(1, elapsed),
        y: (event.clientY - lastPoint.y) / Math.max(1, elapsed),
      };
    }

    pointerIdRef.current = null;
    startPointRef.current = null;
    lastPointRef.current = null;

    if (disabled) {
      reset();
      return;
    }

    if (
      !currentAxis &&
      distance < TAP_MAX_DISTANCE &&
      duration <= TAP_MAX_DURATION_MS
    ) {
      phaseRef.current = "idle";
      setPhase("idle");
      onTap?.();
      return;
    }

    if (currentAxis === "x") {
      const shouldCommit =
        Math.abs(dx) >= viewportRef.current.width * COMMIT_DISTANCE_RATIO ||
        velocityRef.current.x * Math.sign(dx) >= COMMIT_VELOCITY;
      if (shouldCommit) {
        commit(dx < 0 ? "left" : "right");
        return;
      }
    }

    if (currentAxis === "y") {
      const shouldCommit =
        Math.abs(dy) >= viewportRef.current.height * COMMIT_DISTANCE_RATIO ||
        velocityRef.current.y * Math.sign(dy) >= COMMIT_VELOCITY;
      if (shouldCommit && (dy < 0 || canGoBack)) {
        commit(dy < 0 ? "up" : "down");
        return;
      }
    }

    reset();
  }

  function handlePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    pointerIdRef.current = null;
    startPointRef.current = null;
    lastPointRef.current = null;
    reset();
  }

  const horizontalProgress = clamp(
    Math.abs(offset.x) / Math.max(1, viewport.width * COMMIT_DISTANCE_RATIO),
    0,
    1,
  );
  const verticalProgress = clamp(
    Math.abs(offset.y) / Math.max(1, viewport.height * COMMIT_DISTANCE_RATIO),
    0,
    1,
  );

  return {
    phase,
    axis,
    offset,
    viewport,
    transitionDurationMs,
    rotation: clamp(offset.x * 0.05, -MAX_ROTATION, MAX_ROTATION),
    horizontalProgress,
    verticalProgress,
    verticalDirection,
    isInteracting: phase !== "idle",
    isTransitioning: phase === "committing" || phase === "resetting",
    completeTransition,
    triggerSwipe: commit,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointer,
      onPointerCancel: handlePointerCancel,
      onLostPointerCapture: handlePointerCancel,
    },
  };
}
