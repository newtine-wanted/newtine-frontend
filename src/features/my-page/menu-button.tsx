export function MyPageMenuButton() {
  return (
    <button
      type="button"
      disabled
      aria-label="메뉴 (준비 중)"
      className="flex size-11 items-center justify-center text-foreground disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 9"
        fill="currentColor"
        className="h-2.25 w-5"
      >
        <rect width="20" height="2" />
        <rect y="7" width="20" height="2" />
      </svg>
    </button>
  );
}
