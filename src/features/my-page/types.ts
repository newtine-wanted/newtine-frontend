import type { PolicyArea } from "@/domain/policy-area";

export type LoginProvider = "kakao";

export interface MyPageAccount {
  email: string;
  loginProvider: LoginProvider;
}

export type PolicyAreaLikeCounts = Partial<Record<PolicyArea, number>>;

export interface MyPageInterest {
  /** 서버 설정값 "최근 N일", 목업 30 */
  periodDays: number;
  /** 서버 설정값, 목업 10 */
  sampleThreshold: number;
  likeCounts: PolicyAreaLikeCounts;
}

export interface MyPageData {
  account: MyPageAccount;
  interest: MyPageInterest;
  likedNewsCount: number;
  appVersion: string;
}

/** 03 | 02 | 01 */
export type InterestState = "empty" | "low-sample" | "normal";

export interface InterestBar {
  area: PolicyArea;
  count: number;
  /** 최댓값 대비 0 < w <= 100 */
  widthPercent: number;
}

export interface InterestSummary {
  state: InterestState;
  total: number;
  /** state === "empty"이면 [] */
  bars: InterestBar[];
}
