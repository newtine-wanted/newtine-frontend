import type { LikedNewsItem } from "./types";

// 상태 확인: 빈 상태를 보려면 LIKED_NEWS_MOCK을 [] 로 바꾼다.
export const LIKED_NEWS_MOCK: LikedNewsItem[] = [
  {
    id: "1",
    area: "주거",
    likedAt: "9.7",
    title: "청년 월세 지원, 소득 기준 완화해 대상 2배로 늘린다",
    hasThumbnail: true,
  },
  {
    id: "2",
    area: "금융·세제",
    likedAt: "9.6",
    title: "반도체 세액공제 연장안, 상임위 통과",
    hasThumbnail: true,
  },
  {
    id: "3",
    area: "국회·정당",
    likedAt: "9.5",
    title: "국회, 이번 주 본회의서 예산안 처리 예정",
    hasThumbnail: true,
  },
  {
    id: "4",
    area: "국회·정당",
    likedAt: "9.4",
    title: '○○ 의원 "청년 주거 예산 삭감 반대" SNS 게시',
    hasThumbnail: true,
  },
  {
    id: "5",
    area: "주거",
    likedAt: "9.2",
    title: "전세사기 특별법 개정안 발의",
    hasThumbnail: true,
  },
];
