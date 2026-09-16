import Link from "next/link";
import { WithdrawDialog } from "./withdraw-dialog";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const navRowClasses = `flex h-11 w-full items-center justify-between text-body text-foreground-body ${focusClasses}`;

export function AccountSection({
  appVersion,
  likedCount,
  swipeCount,
}: {
  appVersion: string;
  likedCount: number;
  swipeCount: number;
}) {
  return (
    <section
      aria-labelledby="account-heading"
      className="flex flex-col border-t-2 border-foreground"
    >
      <h2
        id="account-heading"
        lang="en"
        className="pt-3 pb-1 text-label font-bold tracking-[0.08em] text-foreground"
      >
        ACCOUNT
      </h2>

      <ul className="flex flex-col divide-y divide-divider border-b border-divider">
        <li>
          <Link href="/terms" className={navRowClasses}>
            이용약관
            <span aria-hidden="true" className="text-foreground">
              →
            </span>
          </Link>
        </li>
        <li>
          <Link href="/privacy" className={navRowClasses}>
            개인정보처리방침
            <span aria-hidden="true" className="text-foreground">
              →
            </span>
          </Link>
        </li>
        <li className="flex h-11 items-center justify-between text-body text-foreground-body">
          앱 버전
          <span className="text-caption text-muted">{appVersion}</span>
        </li>
        <li>
          <button
            type="button"
            className={`flex h-11 w-full items-center text-left text-body text-foreground-body ${focusClasses}`}
          >
            로그아웃
          </button>
        </li>
      </ul>

      <WithdrawDialog likedCount={likedCount} swipeCount={swipeCount} />
    </section>
  );
}
