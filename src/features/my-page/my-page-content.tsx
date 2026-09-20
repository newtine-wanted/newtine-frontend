"use client";

import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { AccountHeader } from "./account-header";
import { AccountSection } from "./account-section";
import { InterestSection } from "./interest-section";
import { ShortcutTiles } from "./shortcut-tiles";
import { useMyPage } from "./use-my-page";

export function MyPageContent() {
  const { analysis, email, errorMessage, isLoading, reload } = useMyPage();

  if (isLoading) {
    return (
      <AsyncContentLoading
        title="마이페이지를 불러오는 중이에요"
        className="min-h-[60dvh]"
      />
    );
  }

  if (!analysis) {
    return (
      <AsyncContentError
        title="마이페이지를 불러오지 못했어요"
        description={
          errorMessage ?? "관심 분석을 불러오는 중 문제가 발생했습니다."
        }
        onRetry={reload}
        className="min-h-[60dvh]"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4.5 px-5 pt-4 pb-6">
      <AccountHeader email={email} />
      <ShortcutTiles likedIssueCount={analysis.likedIssueCount} />
      <InterestSection
        categoryCounts={analysis.categoryCounts}
        issueCount={analysis.issueCount}
        periodDays={analysis.period.days}
        sampleStatus={analysis.sampleStatus}
      />
      <AccountSection />
    </div>
  );
}
