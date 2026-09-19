import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface AppBarProps {
  backHref?: string;
  title?: string;
  action?: ReactNode;
}

export function AppBar({ backHref, title, action }: AppBarProps) {
  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-10 flex h-[52px] w-full items-center justify-between gap-2 bg-background px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="뒤로 가기"
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
          </Link>
        )}

        {title ? (
          <h1 className="min-w-0 truncate text-heading leading-none font-extrabold text-foreground">
            {title}
          </h1>
        ) : (
          <Image
            src="/images/logo/newtine-logo-container.svg"
            width={84}
            height={25}
            alt="NEWTINE"
            loading="eager"
          />
        )}
      </div>

      {action && (
        <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-end text-body-sm font-normal text-foreground-secondary">
          {action}
        </div>
      )}
    </header>
  );
}
