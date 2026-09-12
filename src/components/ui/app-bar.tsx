"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export interface AppBarProps {
  showBack?: boolean;
  title?: string;
  action?: ReactNode;
}

export function AppBar({ showBack = false, title, action }: AppBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-10 flex h-[52px] w-full items-center justify-between gap-2 bg-background px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showBack && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="flex shrink-0 items-center justify-start text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-6"
            >
              <path
                d="M15 18 9 12l6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {title ? (
          <h1 className="min-w-0 truncate font-['Gothic_A1','Noto_Sans_KR_Variable','Noto_Sans_KR',sans-serif] text-heading leading-[1.35] font-extrabold text-foreground">
            {title}
          </h1>
        ) : (
          <span className="font-['Barlow_Semi_Condensed','Arial_Narrow',sans-serif] text-brand leading-none font-black text-foreground">
            NEWTINE
          </span>
        )}
      </div>

      {action && (
        <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-end text-body-sm font-medium text-foreground-secondary">
          {action}
        </div>
      )}
    </header>
  );
}
