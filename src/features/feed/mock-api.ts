import {
  MOCK_EMPTY_FEED,
  MOCK_FEED_FIRST_PAGE,
  MOCK_FEED_SECOND_PAGE,
  MOCK_NEXT_CURSOR,
} from "./mock-data";
import type { FeedApi, FeedResponse } from "./types";

export type MockFeedScenario = "default" | "empty" | "error";

interface MockFeedApiOptions {
  delayMs?: number;
  scenario?: MockFeedScenario;
}

const DEFAULT_DELAY_MS = 350;

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function cloneResponse(response: FeedResponse) {
  return structuredClone(response);
}

export function createMockFeedApi({
  delayMs = DEFAULT_DELAY_MS,
  scenario = "default",
}: MockFeedApiOptions = {}): FeedApi {
  return {
    async getFeed(cursor) {
      await delay(delayMs);

      if (scenario === "error") {
        throw new Error("목업 피드를 불러오지 못했습니다.");
      }

      if (scenario === "empty") {
        return cloneResponse(MOCK_EMPTY_FEED);
      }

      if (!cursor) {
        return cloneResponse(MOCK_FEED_FIRST_PAGE);
      }

      if (cursor === MOCK_NEXT_CURSOR) {
        return cloneResponse(MOCK_FEED_SECOND_PAGE);
      }

      throw new Error(`알 수 없는 목업 피드 커서입니다: ${cursor}`);
    },

    async recordInteraction(issueId, request) {
      await delay(delayMs);

      if (scenario === "error") {
        throw new Error("목업 카드 반응을 기록하지 못했습니다.");
      }

      return {
        eventId: request.eventId,
        issueId,
        acceptedAction: request.action,
        acceptedAt: new Date().toISOString(),
      };
    },
  };
}
