import type { FeedApi, FeedResponse } from "./types";

const FEED_CACHE_TTL_MS = 60_000;

interface FeedCacheEntry {
  response: FeedResponse;
  cachedAt: number;
}

const responseCache = new Map<string, FeedCacheEntry>();
const inFlightRequests = new Map<string, Promise<FeedResponse>>();

function getCacheKey(sessionKey: string, cursor?: string) {
  return `${sessionKey}:${cursor ?? "initial"}`;
}

export function getCachedFeed(
  api: FeedApi,
  sessionKey: string,
  cursor?: string,
  force = false,
): Promise<FeedResponse> {
  const cacheKey = getCacheKey(sessionKey, cursor);
  const cached = responseCache.get(cacheKey);

  if (!force && cached && Date.now() - cached.cachedAt < FEED_CACHE_TTL_MS) {
    return Promise.resolve(cached.response);
  }

  const inFlightRequest = inFlightRequests.get(cacheKey);
  if (inFlightRequest) return inFlightRequest;

  const request = api
    .getFeed(cursor)
    .then((response) => {
      responseCache.set(cacheKey, { response, cachedAt: Date.now() });
      return response;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
}
