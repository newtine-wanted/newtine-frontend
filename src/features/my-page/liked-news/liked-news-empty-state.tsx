import Link from "next/link";
import type { Ref } from "react";

export function LikedNewsEmptyState({
  ref,
}: {
  /** 목록이 비었을 때 포커스를 받는 안내 문구 */
  ref?: Ref<HTMLParagraphElement>;
}) {
  return (
    <div className="mx-5 flex flex-col items-center gap-2 bg-surface px-4 py-5 text-center">
      <p
        ref={ref}
        tabIndex={-1}
        className="text-body font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        관심 표시한 뉴스가 여기에 모여요
      </p>
      <Link
        href="/feed"
        className="mt-1 inline-flex h-11 min-w-50 items-center justify-center bg-primary px-4 text-button text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        피드로 가기
      </Link>
    </div>
  );
}
