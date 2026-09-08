import { topics, type Topic } from "@/design-system/topics";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

const tones = {
  sage: "bg-topic-sage",
  olive: "bg-topic-olive",
  moss: "bg-topic-moss",
  neutral: "bg-topic-neutral",
} as const;

export interface TopicChipProps {
  topic: Topic;
  showIcon?: boolean;
  className?: string;
}

export function TopicChip({
  topic,
  showIcon = true,
  className,
}: TopicChipProps) {
  const { label, tone, icon } = topics[topic];
  return (
    <span
      className={cx(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-[5px] text-label font-medium text-foreground-secondary",
        tones[tone],
        className,
      )}
    >
      {showIcon && <Icon name={icon} />}
      {label}
    </span>
  );
}
