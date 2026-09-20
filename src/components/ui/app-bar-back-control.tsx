"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type AppBarBackMode = "history";

export function AppBarBackControl({
  href,
  mode,
}: {
  href?: string;
  mode?: AppBarBackMode;
}) {
  const router = useRouter();
  const className =
    "flex size-11 shrink-0 items-center justify-center text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const icon = (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (mode === "history") {
    return (
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="이전 화면으로 돌아가기"
        className={className}
      >
        {icon}
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link href={href} aria-label="뒤로 가기" className={className}>
      {icon}
    </Link>
  );
}
