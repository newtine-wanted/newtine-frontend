"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "zustand";
import { restoreAuthSession } from "@/domain/auth/session";
import { authSessionStore } from "@/domain/auth/store";

export function useAuthSessionBootstrap() {
  const router = useRouter();
  const endReason = useStore(authSessionStore, (state) => state.endReason);

  useEffect(() => {
    void restoreAuthSession();
  }, []);

  useEffect(() => {
    if (endReason === "expired") {
      router.replace("/login");
    }
  }, [endReason, router]);
}
