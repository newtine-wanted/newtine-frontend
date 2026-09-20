"use client";

import { useLikedNewsContext } from "./liked-news-provider";

export function LikedNewsCount() {
  const { displayedCategoryName, totalCount } = useLikedNewsContext();

  return (
    <span aria-live="polite">
      {displayedCategoryName ? `${displayedCategoryName} ` : ""}
      {totalCount}건
    </span>
  );
}
