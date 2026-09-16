"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { LikedNewsItem as LikedNewsItemData } from "./types";

const REVEAL_WIDTH = 96;
const UNLIKE_THRESHOLD = 72;

export function LikedNewsItem({
  item,
  onUnlike,
}: {
  item: LikedNewsItemData;
  onUnlike: (id: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const unlikeButtonRef = useRef<HTMLButtonElement>(null);
  const activePointerIdRef = useRef<number | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // 보조 버튼(오른쪽 클릭·펜 옆면 버튼)으로는 스와이프를 시작하지 않는다.
    if (event.button !== 0) return;
    // 다른 포인터가 소유 중이면 무시해 두 번째 손가락이 기준점을 덮어쓰지 못하게 한다.
    const active = activePointerIdRef.current;
    if (active !== null && active !== event.pointerId) return;

    // 행 밖으로 끌어도 up/cancel을 이 행이 받게 해 소유가 남지 않게 한다.
    event.currentTarget.setPointerCapture(event.pointerId);
    activePointerIdRef.current = event.pointerId;
    setStartX(event.clientX);
    // offset만 0으로 쓰면 버튼이 포커스를 쥔 채 가려지므로 포커스를 풀어 닫는다.
    unlikeButtonRef.current?.blur();
    setOffset(0);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (startX === null || event.pointerId !== activePointerIdRef.current)
      return;
    const dx = event.clientX - startX;
    setOffset(Math.min(0, Math.max(-REVEAL_WIDTH, dx)));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (startX === null || event.pointerId !== activePointerIdRef.current)
      return;
    activePointerIdRef.current = null;
    // offset은 포커스 노출도 표현하므로 판정은 실제 이동거리로 한다.
    const dx = event.clientX - startX;
    setStartX(null);
    if (dx <= -UNLIKE_THRESHOLD) {
      onUnlike(item.id);
      return;
    }
    setOffset(0);
  }

  // 판정 없이 끝난 제스처(취소·캡처 상실)는 되돌린다. 정상 up 뒤의 캡처 상실은 소유 검사에서 걸러진다.
  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (startX === null || event.pointerId !== activePointerIdRef.current)
      return;
    activePointerIdRef.current = null;
    setStartX(null);
    setOffset(0);
  }

  return (
    <li className="relative isolate overflow-hidden">
      {/* 버튼을 내용 뒤에 둬 읽기 순서를 "내용 → 동작"으로 한다. 칠 순서가
          뒤집히므로 내용에 z-10을, 그 z-10이 앱 바와 겨루지 않게 li에 isolate를 준다. */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        style={{ transform: `translateX(${offset}px)` }}
        className="relative z-10 flex touch-pan-y touch-pinch-zoom gap-3 bg-background px-5 py-3.5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-surface px-2.5 py-1 text-label text-foreground">
              {item.area}
            </span>
            <span className="text-hint text-muted">
              관심 표시 {item.likedAt}
            </span>
          </div>
          <p className="line-clamp-2 text-body text-foreground">{item.title}</p>
        </div>
        {item.hasThumbnail && (
          <div
            aria-hidden="true"
            className="size-16 shrink-0 bg-surface-muted"
          />
        )}
      </div>

      <div className="absolute inset-y-0 right-0 flex">
        <button
          ref={unlikeButtonRef}
          type="button"
          // 목록이 포커스 인계 대상을 찾는 표식
          data-unlike
          aria-label={`${item.title}, 관심 해제`}
          onClick={() => onUnlike(item.id)}
          onFocus={() => setOffset(-REVEAL_WIDTH)}
          onBlur={() => setOffset(0)}
          className="w-24 bg-surface-muted text-label text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          관심 해제
        </button>
      </div>
    </li>
  );
}
