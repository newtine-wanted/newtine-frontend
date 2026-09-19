import type { Metadata } from "next";
import { AppBar } from "@/components/ui";
import { MyPageContent, MyPageMenuButton } from "@/features/my-page";

export const metadata: Metadata = { title: "마이페이지" };

export default function MyPage() {
  return (
    <>
      {/* AppBar 자체 sticky는 이 래퍼 안에서 효과가 없다. 래퍼가 고정과 괘선을 담당한다. */}
      <div className="sticky top-[env(safe-area-inset-top)] z-10 border-b-2 border-foreground bg-background">
        <AppBar backHref="/" action={<MyPageMenuButton />} />
      </div>
      <MyPageContent />
    </>
  );
}
