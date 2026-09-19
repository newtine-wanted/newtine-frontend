import type { OnboardingEntity } from "./types";

// 배열 순서가 기본 목록 순서(최근 30일 보도량 상위)다.
export const ONBOARDING_ENTITIES_MOCK: OnboardingEntity[] = [
  { id: "1", name: "홍길동", type: "정치인", description: "국회의원 · ○○당" },
  { id: "2", name: "○○당", type: "정당", description: "정당" },
  { id: "3", name: "김철수", type: "정치인", description: "서울시장" },
  { id: "4", name: "국회 기획재정위원회", type: "기관", description: "기관" },
  { id: "5", name: "△△당", type: "정당", description: "정당" },
  { id: "6", name: "이영희", type: "정치인", description: "국회의원 · △△당" },
  { id: "7", name: "국토교통부", type: "기관", description: "기관" },
  { id: "8", name: "김민준", type: "정치인", description: "경기도지사" },
  { id: "9", name: "□□당", type: "정당", description: "정당" },
  { id: "10", name: "박서연", type: "정치인", description: "국회의원 · ○○당" },
  { id: "11", name: "행정안전부", type: "기관", description: "기관" },
  { id: "12", name: "대법원", type: "기관", description: "기관" },
];
