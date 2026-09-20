"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  AsyncContentError,
  AsyncContentLoading,
  Button,
} from "@/components/ui";
import { LikedNewsEmptyState } from "./liked-news-empty-state";
import { LikedNewsItem } from "./liked-news-item";
import { useLikedNewsContext } from "./liked-news-provider";
import { TopicFilter } from "./topic-filter";

export function LikedNewsList() {
  const {
    categories,
    categoriesError,
    displayedCategoryName,
    isInitialLoading,
    isLoadingMore,
    items,
    loadError,
    loadMore,
    loadMoreError,
    loadMoreNotice,
    nextCursor,
    retry,
    selectCategory,
    selectedCode,
    totalCount,
  } = useLikedNewsContext();

  const contentRef = useRef<HTMLDivElement>(null);
  // 방금 누른 컨트롤이 사라지는 전환에서만 포커스를 되찾는다.
  const isRecoveringFocusRef = useRef(false);

  useEffect(() => {
    if (!isRecoveringFocusRef.current || isInitialLoading || isLoadingMore) {
      return;
    }

    if (document.activeElement === document.body) {
      contentRef.current?.focus();
    }

    isRecoveringFocusRef.current = false;
  }, [isInitialLoading, isLoadingMore]);

  let loadMoreLabel = "더보기";

  if (isLoadingMore) {
    loadMoreLabel = "불러오는 중...";
  } else if (loadMoreError) {
    loadMoreLabel = "다시 시도";
  }

  let content: ReactNode;

  if (isInitialLoading) {
    content = <AsyncContentLoading title="관심 뉴스를 불러오는 중이에요" />;
  } else if (loadError) {
    content = (
      <AsyncContentError
        title="관심 뉴스를 불러오지 못했어요"
        description={loadError}
        onRetry={() => {
          isRecoveringFocusRef.current = true;
          retry();
        }}
      />
    );
  } else if (totalCount === 0) {
    content = (
      <LikedNewsEmptyState
        topic={selectedCode ? (displayedCategoryName ?? undefined) : undefined}
      />
    );
  } else {
    content = (
      <>
        <ul className="flex flex-col divide-y divide-divider border-y border-divider">
          {items.map((item) => (
            <LikedNewsItem key={item.issueId} item={item} />
          ))}
        </ul>
        {nextCursor && (
          <div className="flex flex-col items-center gap-2 px-5 pt-4">
            {loadMoreError && (
              <p role="alert" className="text-label text-danger">
                {loadMoreError}
              </p>
            )}
            <Button
              variant="ghost"
              aria-disabled={isLoadingMore}
              aria-busy={isLoadingMore}
              onClick={() => {
                isRecoveringFocusRef.current = true;
                void loadMore();
              }}
              className="h-11 w-full text-body-sm aria-disabled:opacity-40"
            >
              {loadMoreLabel}
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col pt-1 pb-6">
      <TopicFilter
        categories={categories}
        selectedCode={selectedCode}
        onSelect={selectCategory}
      />
      {categoriesError && (
        <p role="alert" className="px-5 pb-2 text-label text-danger">
          {categoriesError}
        </p>
      )}
      {/* 버튼을 언마운트하는 전환에서 포커스가 문서 밖으로 떨어지지 않게 받아 둔다. */}
      <div
        ref={contentRef}
        tabIndex={-1}
        role="region"
        aria-label="관심 뉴스 목록"
        className="flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {content}
      </div>
      {/* 되감기 도중 content가 로딩 블록으로 바뀌므로 live region은 바깥에 상주시킨다. */}
      <p
        role="status"
        className={loadMoreNotice ? "px-5 pt-4 text-label text-muted" : ""}
      >
        {loadMoreNotice}
      </p>
    </div>
  );
}
