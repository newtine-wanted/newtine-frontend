"use client";

import { LikedNewsEmptyState } from "./liked-news-empty-state";
import { LikedNewsItem } from "./liked-news-item";
import { useLikedNews } from "./liked-news-provider";
import { TopicFilter } from "./topic-filter";

export function LikedNewsList() {
  const { visibleItems, selected, selectTopic, unlike } = useLikedNews();

  return (
    <div className="flex flex-col pt-1 pb-6">
      <TopicFilter selected={selected} onSelect={selectTopic} />

      {visibleItems.length === 0 ? (
        <LikedNewsEmptyState />
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-divider border-y border-divider">
            {visibleItems.map((item) => (
              <LikedNewsItem key={item.id} item={item} onUnlike={unlike} />
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
