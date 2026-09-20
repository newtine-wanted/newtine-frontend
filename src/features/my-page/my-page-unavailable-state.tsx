import { Button } from "@/components/ui";

interface MyPageUnavailableStateProps {
  description: string;
  onRetry: () => void;
}

export function MyPageUnavailableState({
  description,
  onRetry,
}: MyPageUnavailableStateProps) {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-5 px-5 text-center">
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
