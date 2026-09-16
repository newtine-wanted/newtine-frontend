"use client";

import { useEffect, useRef } from "react";
import { LikedNewsEmptyState } from "./liked-news-empty-state";
import { LikedNewsItem } from "./liked-news-item";
import { useLikedNews } from "./liked-news-provider";
import { TopicFilter } from "./topic-filter";

export function LikedNewsList() {
  const { visibleItems, selected, selectTopic, unlike } = useLikedNews();
  const listRef = useRef<HTMLUListElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);
  const pendingFocusIndexRef = useRef<number | null>(null);

  function handleUnlike(id: string) {
    const removedIndex = visibleItems.findIndex((item) => item.id === id);
    // 제거되는 행에 포커스가 있을 때만 인계한다. `?.`는 removedIndex -1을 막는다.
    const hadFocus =
      listRef.current?.children[removedIndex]?.contains(
        document.activeElement,
      ) ?? false;

    if (hadFocus) pendingFocusIndexRef.current = removedIndex;
    unlike(id);
  }

  // 제거된 자리의 버튼으로 포커스를 넘긴다. 마지막이면 이전 행, 비면 빈 상태로.
  useEffect(() => {
    const index = pendingFocusIndexRef.current;
    if (index === null) return;
    pendingFocusIndexRef.current = null;

    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      "button[data-unlike]",
    );
    if (buttons && buttons.length > 0) {
      buttons[Math.min(index, buttons.length - 1)]?.focus();
      return;
    }
    emptyRef.current?.focus();
  }, [visibleItems]);

  return (
    <div className="flex flex-col pt-1 pb-6">
      <TopicFilter selected={selected} onSelect={selectTopic} />

      {visibleItems.length === 0 ? (
        <LikedNewsEmptyState ref={emptyRef} />
      ) : (
        <>
          <ul
            ref={listRef}
            className="flex flex-col divide-y divide-divider border-y border-divider"
          >
            {visibleItems.map((item) => (
              <LikedNewsItem
                key={item.id}
                item={item}
                onUnlike={handleUnlike}
              />
            ))}
          </ul>
          <p className="px-5 py-3 text-hint text-muted">
            항목을 왼쪽으로 밀면 관심 해제
          </p>
        </>
      )}
    </div>
  );
}
