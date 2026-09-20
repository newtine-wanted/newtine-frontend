import type { Metadata } from "next";
import { FeedScreen } from "@/features/feed";

export const metadata: Metadata = {
  title: { absolute: "newtine | 메인 피드" },
};

export default function FeedPage() {
  return <FeedScreen />;
}
