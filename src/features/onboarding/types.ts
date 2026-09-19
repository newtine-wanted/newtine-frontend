export type OnboardingStep = "topics" | "entities" | "regions"; // 02 | 03 | 04

/** OpenAPI schema: MetadataCategoryResponse */
export interface OnboardingCategory {
  code: string;
  name: string;
  displayOrder: number;
}

export type AsyncRequestStatus = "loading" | "success" | "error";

export type PoliticalActorTypeFilter =
  "ALL" | "POLITICIAN" | "PARTY" | "INSTITUTION";

export type PoliticalActorType = Exclude<PoliticalActorTypeFilter, "ALL">;

/** OpenAPI schema: PoliticalActorResponse */
export interface OnboardingEntity {
  id: string;
  name: string;
  type: string;
  subtitle?: string;
  aliases: string[];
}

/** OpenAPI schema: PoliticalActorSearchResponse */
export interface PoliticalActorSearchResponse {
  items: OnboardingEntity[];
  total: number;
  limit: number;
  offset: number;
}
