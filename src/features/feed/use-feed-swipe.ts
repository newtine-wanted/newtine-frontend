"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const AXIS_LOCK_DISTANCE = 12;
const TAP_MAX_DISTANCE = 8;
const TAP_MAX_DURATION_MS = 200;
const COMMIT_DISTANCE_RATIO = 0.3;
const COMMIT_VELOCITY = 0.5;
const TRANSITION_DURATION_MS = 180;
const MAX_ROTATION = 12;

export type FeedSwipeDirection = "left" | "right" | "up" | "down";
type SwipeAxis = "x" | "y" | null;
type SwipePhase = "idle" | "dragging" | "committing" | "resetting";

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

  const pointerIdRef = useRef<number | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const axisRef = useRef<SwipeAxis>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTransitionTimer, [clearTransitionTimer]);

  const finishTransition = useCallback(
    (direction: FeedSwipeDirection) => {
      clearTransitionTimer();
      transitionTimerRef.current = setTimeout(() => {
        onCommit(direction);
        axisRef.current = null;
        offsetRef.current = { x: 0, y: 0 };
        setAxis(null);
        setOffset({ x: 0, y: 0 });
        setPhase("idle");
        transitionTimerRef.current = null;
      }, TRANSITION_DURATION_MS);
    },
    [clearTransitionTimer, onCommit],
  );

  const commit = useCallback(
    (direction: FeedSwipeDirection, measuredViewport?: SwipeViewport) => {
      if (phase === "committing" || phase === "resetting") return;
      if (direction === "down" && !canGoBack) return;

      const nextAxis: SwipeAxis =
        direction === "left" || direction === "right" ? "x" : "y";
      const width = measuredViewport?.width ?? viewport.width;
      const height = measuredViewport?.height ?? viewport.height;
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
            ? -height * 1.1
            : direction === "down"
              ? height * 1.1
              : 0,
      };

      axisRef.current = nextAxis;
      offsetRef.current = nextOffset;
      setAxis(nextAxis);
      setOffset(nextOffset);
      setPhase("committing");
      finishTransition(direction);
    },
    [canGoBack, finishTransition, phase, viewport.height, viewport.width],
  );

  const reset = useCallback(() => {
    clearTransitionTimer();
    offsetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
    setPhase("resetting");
    transitionTimerRef.current = setTimeout(() => {
      axisRef.current = null;
      setAxis(null);
      setPhase("idle");
      transitionTimerRef.current = null;
    }, TRANSITION_DURATION_MS);
  }, [clearTransitionTimer]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || phase !== "idle" || event.button !== 0) return;
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
    setViewport({ width: bounds.width, height: bounds.height });
    setAxis(null);
    setOffset({ x: 0, y: 0 });
    setPhase("dragging");
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
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
      offsetRef.current = { x: dx, y: 0 };
      setOffset(offsetRef.current);
      return;
    }

    if (axisRef.current === "y") {
      const resistedY = dy > 0 && !canGoBack ? dy * 0.18 : dy;
      offsetRef.current = { x: 0, y: resistedY };
      setOffset(offsetRef.current);
    }
  }

  function finishPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId || !startPointRef.current)
      return;

    const startPoint = startPointRef.current;
    const dx = event.clientX - startPoint.x;
    const dy = event.clientY - startPoint.y;
    const distance = Math.hypot(dx, dy);
    const duration = event.timeStamp - startPoint.time;
    const currentAxis = axisRef.current;

    pointerIdRef.current = null;
    startPointRef.current = null;
    lastPointRef.current = null;

    if (
      !currentAxis &&
      distance < TAP_MAX_DISTANCE &&
      duration <= TAP_MAX_DURATION_MS
    ) {
      setPhase("idle");
      onTap?.();
      return;
    }

    if (currentAxis === "x") {
      const shouldCommit =
        Math.abs(dx) >= viewport.width * COMMIT_DISTANCE_RATIO ||
        Math.abs(velocityRef.current.x) >= COMMIT_VELOCITY;
      if (shouldCommit) {
        commit(dx < 0 ? "left" : "right");
        return;
      }
    }

    if (currentAxis === "y") {
      const shouldCommit =
        Math.abs(dy) >= viewport.height * COMMIT_DISTANCE_RATIO ||
        Math.abs(velocityRef.current.y) >= COMMIT_VELOCITY;
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
    rotation: clamp(offset.x * 0.05, -MAX_ROTATION, MAX_ROTATION),
    horizontalProgress,
    verticalProgress,
    isInteracting: phase !== "idle",
    isTransitioning: phase === "committing" || phase === "resetting",
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
