import type { Topic } from "@/design-system/topics";
import { cx } from "@/lib/cx";
import { NumberBadge } from "./number-badge";
import { TopicChip } from "./topic-chip";

interface IssueCardBaseProps {
  className?: string;
}

export type IssueCardProps = IssueCardBaseProps &
  (
    | { state: "skeleton" }
    | {
        state: "basic";
        topic: Topic;
        title: string;
        articleCount: number;
        onOpen: () => void;
      }
    | {
        state?: "revealing" | "summary";
        topic: Topic;
        title: string;
        articleCount: number;
        summary: readonly [string, string, string];
        onOpen: () => void;
      }
  );

const delays = [
  "[animation-delay:500ms]",
  "[animation-delay:700ms]",
  "[animation-delay:900ms]",
];

export function IssueCard(props: IssueCardProps) {
  const revealing = !props.state || props.state === "revealing";
  const classes = cx(
    "relative flex min-h-[602px] w-full min-w-0 flex-col gap-4 rounded-card border border-border bg-background p-6 shadow-card",
    props.className,
  );
  if (props.state === "skeleton")
    return (
      <article
        aria-busy="true"
        aria-label="이슈 불러오는 중"
        className={classes}
      >
        <div
          aria-hidden="true"
          className="flex flex-col gap-4 motion-safe:animate-skeleton"
        >
          <div className="flex items-center justify-between">
            <span className="h-6 w-20 rounded-full bg-surface-muted" />
            <span className="h-3.5 w-15 rounded-md bg-surface-muted" />
          </div>
          <span className="h-[30px] w-full rounded-md bg-surface-muted" />
          <span className="h-[30px] w-[min(220px,100%)] rounded-md bg-surface-muted" />
        </div>
      </article>
    );

  return (
    <article className={classes}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TopicChip topic={props.topic} />
        <span className="text-label text-muted">
          기사 {props.articleCount}건 묶음
        </span>
      </div>
      <h2 className="text-card-title font-bold break-words text-foreground">
        {props.title}
      </h2>
      {"summary" in props && (
        <>
          <div aria-hidden="true" className="h-px bg-divider" />
          <div className="flex flex-col gap-2.5">
            <p className="text-label font-bold text-foreground-secondary">
              3줄 요약
            </p>
            <ol className="flex flex-col gap-2.5">
              {props.summary.map((line, index) => (
                <li
                  key={index}
                  className={cx(
                    "flex items-start gap-2.5",
                    revealing && "motion-safe:animate-summary-in",
                    revealing && delays[index],
                  )}
                >
                  <NumberBadge value={index + 1} aria-hidden />
                  <p className="min-w-0 flex-1 text-body leading-normal break-words text-foreground">
                    {line}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
      <p
        className={cx(
          "mt-auto pt-4",
          props.state === "basic"
            ? "text-label font-medium text-foreground-secondary"
            : "text-hint text-muted",
        )}
      >
        탭하면 자세히 볼 수 있어요 ›
      </p>
      <button
        type="button"
        onClick={props.onOpen}
        aria-label={`${props.title} 자세히 보기`}
        className="absolute inset-0 rounded-card focus-ring"
      />
    </article>
  );
}
