"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLikedNews, type LikedNewsState } from "./use-liked-news";

const LikedNewsContext = createContext<LikedNewsState | null>(null);

export function useLikedNewsContext() {
  const value = useContext(LikedNewsContext);

  if (!value) {
    throw new Error(
      "useLikedNewsContext는 LikedNewsProvider 안에서만 쓸 수 있습니다.",
    );
  }

  return value;
}

export function LikedNewsProvider({ children }: { children: ReactNode }) {
  const value = useLikedNews();

  return (
    <LikedNewsContext.Provider value={value}>
      {children}
    </LikedNewsContext.Provider>
  );
}
