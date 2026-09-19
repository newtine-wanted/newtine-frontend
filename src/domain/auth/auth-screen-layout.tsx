import Image from "next/image";
import type { ReactNode } from "react";

export interface AuthScreenLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthScreenLayout({
  title,
  description,
  children,
}: AuthScreenLayoutProps) {
  // TODO: 이용약관 및 개인정보처리방침 페이지 구현 후 안내 문구와 링크를 노출한다.

  return (
    <div className="flex min-h-[max(640px,calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)))] flex-col justify-between gap-6 px-6 pt-8 pb-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Image
            src="/images/logo/newtine-logo-container.svg"
            width={110}
            height={33}
            alt="NEWTINE"
            loading="eager"
          />
          <p className="text-body-sm leading-[1.55] text-muted">
            카드로 넘기는 정치 뉴스,
            <br />내 관심사대로 가볍게 시작해요.
          </p>
        </div>

        <section aria-labelledby="auth-screen-title" className="w-full">
          <header className="mb-[22px] flex flex-col gap-2">
            <h1
              id="auth-screen-title"
              className="text-[26px] leading-[1.3] font-extrabold tracking-[-0.015em]"
            >
              {title}
            </h1>
            <p className="text-body-sm leading-[1.5] text-muted">
              {description}
            </p>
          </header>

          {children}
        </section>
      </div>

      <div aria-hidden="true" className="h-[33px]" />
    </div>
  );
}
