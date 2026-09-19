// 전달받은 OpenAPI JSON(26.09.18_2312.json)의 components.schemas를 수동 반영한다.
// API 명세가 변경되면 원본 스키마와 이 파일을 함께 대조한다.

/** OpenAPI schema: AuthCredentialsRequest */
export interface AuthCredentialsRequest {
  email: string;
  password: string;
}

export type UserRole = "ADMIN" | "USER";

/** OpenAPI schema: AuthSessionResponse */
export interface AuthSessionResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/** OpenAPI schema: ProblemDetails */
export interface ProblemDetails {
  title: string;
  status: number;
  detail: string;
  code: string;
}

export type OnboardingStatus = "COMPLETED" | "PENDING" | "SKIPPED";

/** OpenAPI schema: OnboardingStateResult */
export interface OnboardingStateResult {
  status: OnboardingStatus;
  completedAt: string | null;
  ageGroup: "AGE_19_34" | "AGE_35_49" | "AGE_50_64" | "AGE_65_PLUS" | null;
  regionCodes: string[];
}
