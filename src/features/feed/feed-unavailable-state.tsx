import { Button } from "@/components/ui";

interface FeedUnavailableStateProps {
  description: string;
  onRetry: () => void;
}

export function FeedUnavailableState({
  description,
  onRetry,
}: FeedUnavailableStateProps) {
  return (
    <section className="flex h-full min-h-[37.625rem] flex-col items-center justify-center gap-5 px-6 text-center">
      <p role="status" className="text-body-sm leading-6 text-muted">
        {description}
      </p>
      <Button
        variant="ghost"
        className="w-full max-w-[310px]"
        onClick={onRetry}
      >
        다시 시도
      </Button>
    </section>
  );
}
