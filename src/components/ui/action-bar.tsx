import { cx } from "@/lib/cx";
import { Button } from "./button";
import { Icon } from "./icon";

export type ActionBarProps = { className?: string } & (
  | { state?: "default" | "sheet"; onSkip: () => void; onLike: () => void }
  | { state: "disabled"; onSkip?: never; onLike?: never }
  | { state: "unlike"; onUnlike: () => void; disabled?: boolean }
);

export function ActionBar(props: ActionBarProps) {
  const state = props.state ?? "default";
  const disabled =
    state === "disabled" || (props.state === "unlike" && props.disabled);
  return (
    <div
      aria-label="이슈 액션"
      role="group"
      data-disabled={Boolean(disabled)}
      className={cx(
        "flex w-full flex-col gap-2 bg-background px-4 py-2 data-[disabled=true]:opacity-35",
        props.className,
      )}
    >
      <div className="flex gap-3">
        {props.state === "unlike" ? (
          <Button
            variant="ghost"
            size="xl"
            fullWidth
            disabled={props.disabled}
            onClick={props.onUnlike}
            className="disabled:opacity-100"
          >
            <Icon name="like" />
            관심 해제
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="xl"
              disabled={disabled}
              onClick={props.onSkip}
              className="min-w-0 flex-1 disabled:opacity-100"
            >
              <Icon name="skip" />
              넘기기
            </Button>
            <Button
              size="xl"
              disabled={disabled}
              onClick={props.onLike}
              className="min-w-0 flex-1 disabled:opacity-100"
            >
              <Icon name="like" />
              관심 있어요
            </Button>
          </>
        )}
      </div>
      {(state === "default" || state === "disabled") && (
        <p className="text-center text-hint text-muted">
          ← 왼쪽으로 밀면 넘기기 · 오른쪽으로 밀면 관심 →
        </p>
      )}
    </div>
  );
}
