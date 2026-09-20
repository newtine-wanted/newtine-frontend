import Link from "next/link";

export function GuestBrowseLink() {
  return (
    <Link
      href="/"
      replace
      className="flex h-[54px] w-full items-center justify-center border border-border bg-background px-4 text-body-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      로그인 없이 둘러보기
    </Link>
  );
}
