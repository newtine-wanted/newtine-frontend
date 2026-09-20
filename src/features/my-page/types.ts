// openapi.json의 components.schemas.InterestAnalysisResponse를 수동 반영한다.
// API 명세가 변경되면 원본 스키마와 이 파일을 함께 대조한다.

export type InterestCategoryCode =
  | "climate"
  | "education"
  | "finance"
  | "health"
  | "housing"
  | "labor"
  | "local"
  | "politics"
  | "security"
  | "welfare";

export type InterestSampleStatus = "EMPTY" | "LOW_SAMPLE" | "READY";

export interface InterestCategoryCount {
  code: InterestCategoryCode;
  name: string;
  count: number;
}

export interface InterestAnalysisPeriod {
  type: "ROLLING_DAYS";
  days: number;
  startAt: string;
  endAt: string;
  timeZone: "Asia/Seoul";
}

/** OpenAPI schema: InterestAnalysisResponse */
export interface InterestAnalysisResponse {
  asOf: string;
  period: InterestAnalysisPeriod;
  sampleStatus: InterestSampleStatus;
  minimumSampleSize: number;
  issueCount: number;
  likedIssueCount: number;
  categoryCounts: InterestCategoryCount[];
}
