import {
  requestAuthSessionRefresh,
  requestLogout,
  requestWithdraw,
} from "./api";
import { installAuthSessionInterceptors } from "./interceptors";
import {
  authSessionStore,
  setAuthenticatedUser,
  setGuestSession,
} from "./store";
import type { AuthSessionResponse } from "./types";

let accessToken: string | null = null;
let refreshRequest: Promise<void> | null = null;

export function setAuthSession(session: AuthSessionResponse) {
  accessToken = session.accessToken;
  setAuthenticatedUser(session.user);
}

export function clearAuthSession() {
  accessToken = null;
  setGuestSession();
}

export function refreshAuthSession(): Promise<void> {
  if (refreshRequest) {
    return refreshRequest;
  }

  const refreshRevision = authSessionStore.getState().revision;

  refreshRequest = requestAuthSessionRefresh()
    .then((session) => {
      if (authSessionStore.getState().revision === refreshRevision) {
        setAuthSession(session);
      }
    })
    .catch((error: unknown) => {
      if (authSessionStore.getState().revision === refreshRevision) {
        clearAuthSession();
      }

      throw error;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

export async function restoreAuthSession(): Promise<boolean> {
  try {
    await refreshAuthSession();
    return authSessionStore.getState().status === "authenticated";
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  await requestLogout();
  clearAuthSession();
}

// 탈퇴한 계정으로는 로그아웃 요청이 401이 되므로 세션만 비운다.
export async function withdraw(): Promise<void> {
  await requestWithdraw();
  clearAuthSession();
}

function notifyAuthSessionExpired() {
  accessToken = null;
  setGuestSession("expired");
}

installAuthSessionInterceptors({
  getAccessToken: () => accessToken,
  recoverSession: refreshAuthSession,
  handleRecoveryFailure: notifyAuthSessionExpired,
});
