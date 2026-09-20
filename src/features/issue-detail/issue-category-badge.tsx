import type { IssueDetailCategory } from "./types";

export function IssueCategoryBadge({
  category,
}: {
  category: IssueDetailCategory;
}) {
  return (
    <span className="flex min-h-7 items-center gap-1.5 bg-surface px-2.5 py-1 text-label font-bold text-foreground">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className="size-3.5 text-muted"
      >
        <path
          d="M3 2.5h10v11H3zM5.5 5h5M5.5 7.5h5M5.5 10h3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {category.name}
    </span>
  );
}
