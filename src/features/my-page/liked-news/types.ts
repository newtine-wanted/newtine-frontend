import type { PolicyArea } from "@/domain/policy-area";

export interface LikedNewsItem {
  id: string;
  area: PolicyArea;
  /** 관심 표시 일자, 목업은 "9.7" 형식 */
  likedAt: string;
  title: string;
  /** 썸네일은 선택 항목이다. 목업에는 이미지가 없어 자리만 표시한다. */
  hasThumbnail: boolean;
}
