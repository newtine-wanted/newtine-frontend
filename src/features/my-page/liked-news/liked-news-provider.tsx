"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LIKED_NEWS_MOCK } from "./mock-data";
import type { TopicFilterValue } from "./topic-filter";
import type { LikedNewsItem } from "./types";

interface LikedNewsContextValue {
  items: LikedNewsItem[];
  visibleItems: LikedNewsItem[];
  selected: TopicFilterValue;
  selectTopic: (value: TopicFilterValue) => void;
  unlike: (id: string) => void;
}

const LikedNewsContext = createContext<LikedNewsContextValue | null>(null);

export function useLikedNews() {
  const value = useContext(LikedNewsContext);
  if (!value) {
    throw new Error(
      "useLikedNews는 LikedNewsProvider 안에서만 쓸 수 있습니다.",
    );
  }
  return value;
}

export function LikedNewsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(LIKED_NEWS_MOCK);
  const [selected, setSelected] = useState<TopicFilterValue>("전체");

  const value = useMemo<LikedNewsContextValue>(
    () => ({
      items,
      visibleItems:
        selected === "전체"
          ? items
          : items.filter((item) => item.area === selected),
      selected,
      selectTopic: setSelected,
      unlike: (id) =>
        setItems((current) => current.filter((item) => item.id !== id)),
    }),
    [items, selected],
  );

  return (
    <LikedNewsContext.Provider value={value}>
      {children}
    </LikedNewsContext.Provider>
  );
}
