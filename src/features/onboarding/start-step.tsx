"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { FOCUS_CLASSES } from "./focus-classes";

export function StartStep() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] flex-col justify-between gap-6 px-6 pt-10 pb-4">
      <div className="flex flex-col items-center gap-4 pt-20 text-center">
        <Image
          src="/images/logo/app-icon-frame.svg"
          width={88}
          height={88}
          alt=""
          loading="eager"
        />
        <h1 lang="en">
          <Image
            src="/images/logo/newtine-logo-container.svg"
            width={134}
            height={40}
            alt="NEWTINE"
            loading="eager"
            className="block"
          />
        </h1>
        <p className="text-body leading-6 text-muted">
          카드로 넘기는 정치 뉴스
          <br />
          어렵지 않게, 내 관심사대로
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* 온보딩이 방문 기록에 항목 하나만 차지하도록 설문으로도 기록을 교체하며 이동한다. */}
        <Button
          className="w-full"
          onClick={() => router.replace("/onboarding")}
        >
          카카오로 시작하기
        </Button>
        <Link
          href="/feed"
          replace
          className={`flex h-11 w-full items-center justify-center border border-border bg-background px-4 text-button text-foreground ${FOCUS_CLASSES}`}
        >
          로그인 없이 둘러보기
        </Link>
        <p className="text-center text-hint wrap-anywhere break-keep text-muted">
          시작하면{" "}
          <Link
            href="/terms"
            className={`underline underline-offset-2 ${FOCUS_CLASSES}`}
          >
            이용약관
          </Link>{" "}
          및{" "}
          <Link
            href="/privacy"
            className={`underline underline-offset-2 ${FOCUS_CLASSES}`}
          >
            개인정보처리방침
          </Link>
          에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
