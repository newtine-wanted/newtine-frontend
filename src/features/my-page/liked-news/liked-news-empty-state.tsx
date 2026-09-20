import Link from "next/link";
import type { Ref } from "react";
import type { PolicyArea } from "@/domain/policy-area";

export function LikedNewsEmptyState({
  ref,
  topic,
}: {
  /** 마지막 행을 해제해 목록이 비면 포커스를 넘겨받는다 */
  ref?: Ref<HTMLHeadingElement>;
  /** 주제 필터 때문에 비었을 때만 넘긴다. 없으면 관심 뉴스가 아예 없는 상태로 안내한다 */
  topic?: PolicyArea;
}) {
  return (
    <div className="mx-5 flex flex-col items-center gap-2 bg-surface px-4 py-5 text-center">
      <h2
        ref={ref}
        tabIndex={-1}
        className="text-body font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {topic
          ? `‘${topic}’ 주제의 관심 뉴스가 없어요`
          : "관심 표시한 뉴스가 여기에 모여요"}
      </h2>
      {topic ? (
        <p className="text-caption text-muted">
          위 주제 필터에서 ‘전체’를 선택해 보세요
        </p>
      ) : (
        <Link
          href="/"
          className="mt-1 inline-flex h-[54px] min-w-50 items-center justify-center bg-primary px-4 text-button text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          피드로 가기
        </Link>
      )}
    </div>
  );
}
