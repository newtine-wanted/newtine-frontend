"use client";

export function ShareIssueButton({ title }: { title: string }) {
  async function shareIssue() {
    try {
      const shareData = { title, url: window.location.href };

      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
    } catch {
      return;
    }
  }

  return (
    <button
      type="button"
      onClick={() => void shareIssue()}
      className="flex min-h-11 items-center px-1 text-body-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="이슈 공유하기"
    >
      ↗ 공유
    </button>
  );
}
