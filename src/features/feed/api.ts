import { createMockFeedApi, type MockFeedScenario } from "./mock-api";
import type { FeedApi } from "./types";

// 상태 확인: default / empty / error 중 하나로 바꿔 목업 응답을 확인한다.
const scenario: MockFeedScenario = "default";

export const feedApi: FeedApi = createMockFeedApi({ scenario });
