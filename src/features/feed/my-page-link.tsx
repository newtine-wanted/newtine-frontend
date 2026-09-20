import Link from "next/link";

export function MyPageLink({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Link
      href="/my-page"
      aria-label={isAuthenticated ? "마이페이지로 이동" : "로그인하러 가기"}
      className="flex min-h-11 items-center gap-1 text-body-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-4"
      >
        <circle cx="10" cy="6" r="3" stroke="currentColor" />
        <path d="M4 17c.5-3.2 2.5-5 6-5s5.5 1.8 6 5" stroke="currentColor" />
      </svg>
      {isAuthenticated ? "마이" : "로그인"}
    </Link>
  );
}
