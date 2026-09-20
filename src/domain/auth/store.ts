import { createStore } from "zustand/vanilla";
import type { AuthSessionResponse } from "./types";

type AuthSessionStatus = "authenticated" | "guest" | "initializing";
type AuthSessionEndReason = "expired" | null;

interface AuthSessionState {
  user: AuthSessionResponse["user"] | null;
  status: AuthSessionStatus;
  endReason: AuthSessionEndReason;
  revision: number;
}

export const authSessionStore = createStore<AuthSessionState>(() => ({
  user: null,
  status: "initializing",
  endReason: null,
  revision: 0,
}));

export function setAuthenticatedUser(user: AuthSessionResponse["user"]) {
  authSessionStore.setState((state) => ({
    user,
    status: "authenticated",
    endReason: null,
    revision: state.revision + 1,
  }));
}

export function setGuestSession(endReason: AuthSessionEndReason = null) {
  authSessionStore.setState((state) => ({
    user: null,
    status: "guest",
    endReason,
    revision: state.revision + 1,
  }));
}
