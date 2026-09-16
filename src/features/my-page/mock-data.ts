import type { MyPageData, PolicyAreaLikeCounts } from "./types";

// 상태 확인: 아래 state를 STATE_PRESETS.normal(01) / .lowSample(02) / .empty(03)로 바꾼다.
// 한 식별자만 바꾸면 그래프와 관심 뉴스 건수가 함께 바뀐다.
export const STATE_PRESETS = {
  // 01, 총 39
  normal: {
    likeCounts: { 주거: 18, 노동: 11, "금융·세제": 7, 교육: 3 },
    likedNewsCount: 12,
  },
  // 02, 총 3
  lowSample: {
    likeCounts: { 주거: 2, 노동: 1 },
    likedNewsCount: 3,
  },
  // 03, 총 0
  empty: {
    likeCounts: {},
    likedNewsCount: 0,
  },
} satisfies Record<
  string,
  { likeCounts: PolicyAreaLikeCounts; likedNewsCount: number }
>;

const state = STATE_PRESETS.normal;

export const MY_PAGE_MOCK: MyPageData = {
  account: { email: "seah@example.com", loginProvider: "kakao" },
  interest: {
    periodDays: 30,
    sampleThreshold: 10,
    likeCounts: state.likeCounts,
  },
  likedNewsCount: state.likedNewsCount,
  appVersion: "1.0.0",
};
