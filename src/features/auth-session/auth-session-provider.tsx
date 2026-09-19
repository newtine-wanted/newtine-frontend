"use client";

import type { ReactNode } from "react";
import { useAuthSessionBootstrap } from "./use-auth-session-bootstrap";

interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  useAuthSessionBootstrap();

  return children;
}
