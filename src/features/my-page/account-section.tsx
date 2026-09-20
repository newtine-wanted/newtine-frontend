import Link from "next/link";
import { useAccountActions } from "./use-account-actions";
import { WithdrawDialog } from "./withdraw-dialog";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const navRowClasses = `flex h-11 w-full items-center justify-between text-body text-foreground-body ${focusClasses}`;

export function AccountSection() {
  const {
    clearWithdrawError,
    handleLogout,
    handleWithdraw,
    isBusy,
    isLoggingOut,
    isWithdrawing,
    logoutError,
    withdrawError,
  } = useAccountActions();

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
        <li>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleLogout()}
            className={`flex h-11 w-full items-center text-left text-body text-foreground-body disabled:opacity-40 ${focusClasses}`}
          >
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </li>
      </ul>

      {logoutError && (
        <p
          role="alert"
          aria-live="assertive"
          className="pt-2 text-label text-danger"
        >
          {logoutError}
        </p>
      )}

      <WithdrawDialog
        disabled={isBusy}
        errorMessage={withdrawError}
        isSubmitting={isWithdrawing}
        onConfirm={() => void handleWithdraw()}
        onOpen={clearWithdrawError}
      />
    </section>
  );
}
