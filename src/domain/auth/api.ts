import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type {
  AuthCredentialsRequest,
  AuthSessionResponse,
  OnboardingStateResult,
  ProblemDetails,
} from "./types";

export async function loginWithEmail(
  credentials: AuthCredentialsRequest,
): Promise<AuthSessionResponse> {
  const response = await apiClient.post<AuthSessionResponse>(
    "/api/auth/login",
    credentials,
  );

  return response.data;
}

export async function getMyOnboarding(
  accessToken: string,
): Promise<OnboardingStateResult> {
  const response = await apiClient.get<OnboardingStateResult>(
    "/api/me/onboarding",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}

export function getProblemDetails(error: unknown): ProblemDetails | null {
  if (!axios.isAxiosError<ProblemDetails>(error)) {
    return null;
  }

  const problem = error.response?.data;

  if (
    !problem ||
    typeof problem.title !== "string" ||
    typeof problem.status !== "number" ||
    typeof problem.detail !== "string" ||
    typeof problem.code !== "string"
  ) {
    return null;
  }

  return problem;
}
