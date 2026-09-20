import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppBarBackControl, type AppBarBackMode } from "./app-bar-back-control";

export interface AppBarProps {
  backHref?: string;
  backMode?: AppBarBackMode;
  logoHref?: string;
  title?: string;
  action?: ReactNode;
}

export function AppBar({
  backHref,
  backMode,
  logoHref = "/",
  title,
  action,
}: AppBarProps) {
  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-10 flex h-[52px] w-full items-center justify-between gap-2 bg-background px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {backMode === "history" ? (
          <AppBarBackControl mode="history" />
        ) : backHref ? (
          <AppBarBackControl href={backHref} />
        ) : null}

        {title ? (
          <h1 className="min-w-0 truncate text-heading font-extrabold text-foreground">
            {title}
          </h1>
        ) : (
          <Link
            href={logoHref}
            aria-label="홈으로 이동"
            className="flex min-h-11 shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Image
              src="/images/logo/newtine-logo-container.svg"
              width={84}
              height={25}
              alt="NEWTINE"
              loading="eager"
            />
          </Link>
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
