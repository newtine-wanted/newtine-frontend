import type { LikedIssue } from "./types";

function formatLikedAt(likedAt: string) {
  const date = new Date(likedAt);

  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export function LikedNewsItem({ item }: { item: LikedIssue }) {
  return (
    <li className="flex flex-col gap-1.5 px-5 py-3.5">
      <div className="flex items-center gap-2">
        <span className="bg-surface px-2.5 py-1 text-label text-foreground">
          {item.category.name}
        </span>
        <span className="text-hint text-muted">
          관심 표시 {formatLikedAt(item.likedAt)}
        </span>
      </div>
      <p className="line-clamp-2 text-body text-foreground">{item.title}</p>
    </li>
  );
}
