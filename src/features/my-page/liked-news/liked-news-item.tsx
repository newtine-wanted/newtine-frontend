import type { LikedIssue } from "./types";

function formatLikedAt(likedAt: string) {
  const date = new Date(likedAt);

  // 파싱할 수 없는 값은 NaN.NaN으로 읽히므로 표시하지 않는다.
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export function LikedNewsItem({ item }: { item: LikedIssue }) {
  const likedAtLabel = formatLikedAt(item.likedAt);

  return (
    <li className="flex flex-col gap-1.5 px-5 py-3.5">
      <div className="flex items-center gap-2">
        <span className="bg-surface px-2.5 py-1 text-label text-foreground">
          {item.category.name}
        </span>
        {likedAtLabel && (
          <span className="text-hint text-muted">관심 표시 {likedAtLabel}</span>
        )}
      </div>
      <p className="line-clamp-2 text-body text-foreground">{item.title}</p>
    </li>
  );
}
