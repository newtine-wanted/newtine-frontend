export type OnboardingStep = "topics" | "entities" | "regions"; // 02 | 03 | 04

/** OpenAPI schema: MetadataCategoryResponse */
export interface OnboardingCategory {
  code: string;
  name: string;
  displayOrder: number;
}

export type CategoryRequestStatus = "loading" | "success" | "error";

export type EntityType = "정치인" | "정당" | "기관";

export type EntityTypeFilter = EntityType | "전체";

export interface OnboardingEntity {
  id: string;
  name: string;
  type: EntityType;
  /** 이름 아래 보조 설명. 예: "국회의원 · ○○당" */
  description: string;
}
