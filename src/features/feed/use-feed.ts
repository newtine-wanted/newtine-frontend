"use client";

import { useEffect } from "react";
import { useFeedSession, type FeedController } from "./feed-session-provider";

export type { FeedController, FeedStatus } from "./feed-session-provider";

export function useFeed(): FeedController {
  const feed = useFeedSession();
  const { ensureLoaded } = feed;

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  return feed;
}
