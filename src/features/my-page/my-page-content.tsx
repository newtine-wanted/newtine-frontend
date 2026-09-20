"use client";

import { AsyncContentError, AsyncContentLoading } from "@/components/ui";
import { AccountHeader } from "./account-header";
import { AccountSection } from "./account-section";
import { InterestSection } from "./interest-section";
import { ShortcutTiles } from "./shortcut-tiles";
import { ANALYSIS_ERROR_MESSAGE, useMyPage } from "./use-my-page";

export function MyPageContent() {
  const { analysis, email, errorMessage, isLoading, reload } = useMyPage();

  // 관심 분석 장애가 계정 액션까지 막지 않도록 로딩·에러를 데이터 영역에만 둔다.
  return (
    <div className="flex flex-col gap-4.5 px-5 pt-4 pb-6">
      <AccountHeader email={email} />
      {isLoading ? (
        <AsyncContentLoading title="관심 분석을 불러오는 중이에요" />
      ) : !analysis ? (
        <AsyncContentError
          title="관심 분석을 불러오지 못했어요"
          description={errorMessage ?? ANALYSIS_ERROR_MESSAGE}
          onRetry={reload}
        />
      ) : (
        <>
          <ShortcutTiles likedIssueCount={analysis.likedIssueCount} />
          <InterestSection
            categoryCounts={analysis.categoryCounts}
            issueCount={analysis.issueCount}
            periodDays={analysis.period.days}
            sampleStatus={analysis.sampleStatus}
          />
        </>
      )}
      <AccountSection />
    </div>
  );
}
