import Image from "next/image";
import Link from "next/link";
import { WithdrawNotice } from "./withdraw-notice";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function LoginStartScreen({
  showWithdrawNotice = false,
}: {
  showWithdrawNotice?: boolean;
}) {
  // TODO: 이용약관 및 개인정보처리방침 페이지 구현 후 안내 문구와 링크를 노출한다.

  return (
    <div className="relative min-h-[max(640px,calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)))]">
      <div className="absolute inset-x-6 top-[25.36%] flex flex-col items-center gap-4 text-center">
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

      <div className="absolute inset-x-6 bottom-20 flex flex-col gap-2.5">
        {showWithdrawNotice && <WithdrawNotice />}
        <Link
          href="/login/email"
          className={`flex h-14 w-full items-center justify-center border border-transparent bg-primary px-4 text-button leading-6 font-normal text-primary-foreground ${focusClasses}`}
        >
          로그인
        </Link>
        <Link
          href="/"
          replace
          className={`flex h-11 w-full items-center justify-center border border-border bg-background px-4 text-button text-foreground ${focusClasses}`}
        >
          로그인 없이 둘러보기
        </Link>
        <div aria-hidden="true" className="h-[15px]" />
      </div>
    </div>
  );
}
