import Link from "next/link";

export function LegalPolicyNotice({ actionLabel }: { actionLabel: string }) {
  const linkClasses =
    "inline-flex min-h-11 items-center px-2 font-medium text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <aside className="flex flex-col items-center gap-0.5 text-center text-hint leading-[1.45]">
      <p className="text-subtle">
        {actionLabel}하면 아래 정책에 동의한 것으로 간주합니다.
      </p>
      <div className="flex items-center justify-center">
        <Link
          href="/terms"
          target="_blank"
          rel="noreferrer"
          prefetch={false}
          aria-label="이용약관 새 창에서 열기"
          className={linkClasses}
        >
          이용약관
        </Link>
        <span aria-hidden="true" className="text-subtle">
          ·
        </span>
        <Link
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          prefetch={false}
          aria-label="개인정보처리방침 새 창에서 열기"
          className={linkClasses}
        >
          개인정보처리방침
        </Link>
      </div>
    </aside>
  );
}
