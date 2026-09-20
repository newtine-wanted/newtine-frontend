"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useStore } from "zustand";
import { authSessionStore } from "@/domain/auth/store";
import { AuthSessionSplashScreen } from "./auth-session-splash-screen";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const status = useStore(authSessionStore, (state) => state.status);

  useEffect(() => {
    if (status === "guest") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status !== "authenticated") {
    return (
      <AuthSessionSplashScreen
        message={
          status === "guest"
            ? "로그인 화면으로 이동하고 있어요"
            : "로그인 상태를 확인하고 있어요"
        }
      />
    );
  }

  return children;
}
