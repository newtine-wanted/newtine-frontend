import type { ReportCategoryCount } from "./types";

export function ReportCategoryList({
  categories,
}: {
  categories: ReportCategoryCount[];
}) {
  const visibleCategories = categories.filter((category) => category.count > 0);
  const maxCount = visibleCategories.reduce(
    (maximum, category) => Math.max(maximum, category.count),
    1,
  );

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 border-t-2 border-foreground pt-4">
      <div>
        <p lang="en" className="text-heading font-extrabold text-foreground">
          Interest
        </p>
        <h2 className="mt-0.5 text-caption text-muted">오늘 관심 분야</h2>
      </div>
      <ul className="flex flex-col gap-2.5">
        {visibleCategories.map((category) => (
          <li key={category.categoryCode} className="flex items-center gap-2.5">
            <span className="w-14 shrink-0 text-caption text-foreground-secondary">
              {category.displayName}
            </span>
            <span aria-hidden="true" className="h-2 flex-1 bg-surface-muted">
              <span
                className="block h-full min-w-1 bg-foreground"
                style={{ width: `${(category.count / maxCount) * 100}%` }}
              />
            </span>
            <span className="w-7 text-right text-body-sm font-bold tabular-nums">
              {category.count}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
