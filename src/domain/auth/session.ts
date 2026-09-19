import { apiClient } from "@/lib/api-client";
import type { AuthSessionResponse } from "./types";

let currentSession: AuthSessionResponse | null = null;

export function setAuthSession(session: AuthSessionResponse) {
  currentSession = session;
  apiClient.defaults.headers.common.Authorization = `${session.tokenType} ${session.accessToken}`;
}

export function getAuthSession() {
  return currentSession;
}

export function clearAuthSession() {
  currentSession = null;
  delete apiClient.defaults.headers.common.Authorization;
}
