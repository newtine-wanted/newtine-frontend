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

export async function signupWithEmail(
  credentials: AuthCredentialsRequest,
): Promise<AuthSessionResponse> {
  const response = await apiClient.post<AuthSessionResponse>(
    "/api/auth/signup",
    credentials,
  );

  return response.data;
}

export async function requestAuthSessionRefresh(): Promise<AuthSessionResponse> {
  const response =
    await apiClient.post<AuthSessionResponse>("/api/auth/refresh");

  return response.data;
}

export async function requestLogout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}

export async function requestWithdraw(): Promise<void> {
  await apiClient.post("/api/auth/withdraw");
}

export async function getMyOnboarding(): Promise<OnboardingStateResult> {
  const response =
    await apiClient.get<OnboardingStateResult>("/api/me/onboarding");

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

// 본문이 ProblemDetails가 아닌 400·500도 전송 계층 상태로는 판정할 수 있어야 한다.
export function getResponseStatus(error: unknown): number | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  return error.response?.status ?? null;
}
