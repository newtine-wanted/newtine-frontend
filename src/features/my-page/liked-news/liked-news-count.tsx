"use client";

import { useLikedNewsContext } from "./liked-news-provider";

export function LikedNewsCount() {
  const { selectedCategoryName, totalCount } = useLikedNewsContext();

  return (
    <span>
      {selectedCategoryName} {totalCount}건
    </span>
  );
}
