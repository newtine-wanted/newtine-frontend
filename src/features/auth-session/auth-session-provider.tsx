"use client";

import type { ReactNode } from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";
import { AuthSessionSplashScreen } from "./auth-session-splash-screen";
import { useAuthSessionBootstrap } from "./use-auth-session-bootstrap";

interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const status = useStore(authSessionStore, (state) => state.status);

  useAuthSessionBootstrap();

  if (status === "initializing") {
    return <AuthSessionSplashScreen />;
  }

  return children;
}
