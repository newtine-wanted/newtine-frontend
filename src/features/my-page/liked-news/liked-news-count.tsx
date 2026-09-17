"use client";

import { useLikedNews } from "./liked-news-provider";

export function LikedNewsCount() {
  const { items } = useLikedNews();

  return <span>{items.length}건</span>;
}
