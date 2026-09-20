"use client";

import { AccountHeader } from "./account-header";
import { AccountSection } from "./account-section";
import { InterestSection } from "./interest-section";
import { MyPageLoadingState } from "./my-page-loading-state";
import { MyPageUnavailableState } from "./my-page-unavailable-state";
import { ShortcutTiles } from "./shortcut-tiles";
import { useMyPage } from "./use-my-page";

export function MyPageContent() {
  const { analysis, email, errorMessage, isLoading, reload } = useMyPage();

  if (isLoading) {
    return <MyPageLoadingState />;
  }

  if (!analysis) {
    return (
      <MyPageUnavailableState
        description={
          errorMessage ?? "관심 분석을 불러오는 중 문제가 발생했습니다."
        }
        onRetry={reload}
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
