import { createStore } from "zustand/vanilla";
import type { AuthSessionResponse } from "./types";

type AuthSessionStatus = "authenticated" | "guest" | "initializing";
type AuthSessionEndReason = "expired" | null;

interface AuthSessionState {
  session: AuthSessionResponse | null;
  status: AuthSessionStatus;
  endReason: AuthSessionEndReason;
  revision: number;
}

export const authSessionStore = createStore<AuthSessionState>(() => ({
  session: null,
  status: "initializing",
  endReason: null,
  revision: 0,
}));

export function setAuthenticatedSession(session: AuthSessionResponse) {
  authSessionStore.setState((state) => ({
    session,
    status: "authenticated",
    endReason: null,
    revision: state.revision + 1,
  }));
}

export function setGuestSession(endReason: AuthSessionEndReason = null) {
  authSessionStore.setState((state) => ({
    session: null,
    status: "guest",
    endReason,
    revision: state.revision + 1,
  }));
}
