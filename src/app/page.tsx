import type { Metadata } from "next";
import { FeedScreen } from "@/features/feed";

export const metadata: Metadata = { title: "메인 피드" };

export default function Home() {
  return <FeedScreen />;
}
