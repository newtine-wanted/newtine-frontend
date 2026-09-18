export type OnboardingStep = "topics" | "entities" | "regions"; // 02 | 03 | 04

export type EntityType = "정치인" | "정당" | "기관";

export type EntityTypeFilter = EntityType | "전체";

export interface OnboardingEntity {
  id: string;
  name: string;
  type: EntityType;
  /** 이름 아래 보조 설명. 예: "국회의원 · ○○당" */
  description: string;
}
