import type { Metadata } from "next";
import { AppBar } from "@/components/ui";
import {
  LikedNewsCount,
  LikedNewsList,
  LikedNewsProvider,
} from "@/features/my-page";

export const metadata: Metadata = { title: "관심 뉴스" };

export default function LikedNewsPage() {
  return (
    <LikedNewsProvider>
      {/* AppBar 자체 sticky는 이 래퍼 안에서 효과가 없다. 래퍼가 고정과 괘선을 담당한다. */}
      <div className="sticky top-[env(safe-area-inset-top)] z-10 border-b-2 border-foreground bg-background">
        <AppBar
          backHref="/my-page"
          title="관심 뉴스"
          action={<LikedNewsCount />}
        />
      </div>
      <LikedNewsList />
    </LikedNewsProvider>
  );
}
