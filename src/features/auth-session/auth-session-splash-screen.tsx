import Image from "next/image";

export function AuthSessionSplashScreen({
  message = "앱을 준비하고 있어요",
}: {
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col items-center justify-center gap-5 bg-background px-6 text-center"
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/images/logo/logo.png"
          width={88}
          height={88}
          alt=""
          priority
        />
        <Image
          src="/images/logo/newtine-logo-container.svg"
          width={134}
          height={40}
          alt="newtine"
          priority
        />
      </div>

      <div className="flex items-center gap-2 text-label text-muted">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-4 animate-spin text-accent motion-reduce:animate-none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
