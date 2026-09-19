interface FeedToastProps {
  message: string;
  onDismiss: () => void;
}

export function FeedToast({ message, onDismiss }: FeedToastProps) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      className="absolute bottom-4 left-1/2 z-30 min-h-11 -translate-x-1/2 bg-primary px-5 py-3 text-body-sm whitespace-nowrap text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span aria-hidden="true" className="mr-2 font-bold">
        ✓
      </span>
      {message}
    </button>
  );
}
