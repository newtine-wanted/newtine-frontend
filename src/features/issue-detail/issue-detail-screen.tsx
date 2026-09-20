"use client";

import {
  AppBar,
  AsyncContentError,
  AsyncContentLoading,
} from "@/components/ui";
import { IssueArticlesSection } from "./issue-articles-section";
import { IssueDetailHeader } from "./issue-detail-header";
import { IssueGlossarySection } from "./issue-glossary-section";
import { IssueImpactSection } from "./issue-impact-section";
import { IssueSummarySection } from "./issue-summary-section";
import { IssueViewpointsSection } from "./issue-viewpoints-section";
import { ShareIssueButton } from "./share-issue-button";
import { useDetailViewTracking } from "./use-detail-view-tracking";
import { useIssueDetail } from "./use-issue-detail";

export function IssueDetailScreen({ issueId }: { issueId: string }) {
  const { issue, status, errorMessage, retry } = useIssueDetail(issueId);
  const isReady = status === "ready" && issue?.id === issueId;
  const isLoading = status === "loading" || (status === "ready" && !isReady);

  useDetailViewTracking(issueId, isReady);

  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-20 border-b-2 border-foreground bg-background">
        <AppBar
          backMode="history"
          title="이슈 상세"
          action={
            isReady ? <ShareIssueButton title={issue.title} /> : undefined
          }
        />
      </div>

      {isLoading && (
        <AsyncContentLoading
          title="이슈 상세를 불러오는 중이에요"
          className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-54px)] px-5"
        />
      )}

      {status === "error" && (
        <AsyncContentError
          title="이슈 상세를 불러오지 못했어요"
          description={
            errorMessage ?? "이슈 상세를 불러오는 중 문제가 발생했습니다."
          }
          onRetry={() => void retry()}
          className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-54px)] px-5"
        />
      )}

      {isReady && (
        <article className="flex flex-col gap-[26px] px-5 pt-3 pb-10">
          <IssueDetailHeader issue={issue} />
          <IssueSummarySection summaryLines={issue.summaryLines} />
          {issue.impacts.length > 0 && (
            <IssueImpactSection impacts={issue.impacts} />
          )}
          {issue.viewpoints.length > 0 && (
            <IssueViewpointsSection viewpoints={issue.viewpoints} />
          )}
          {issue.glossary.length > 0 && (
            <IssueGlossarySection glossary={issue.glossary} />
          )}
          {issue.articles.length > 0 && (
            <IssueArticlesSection articles={issue.articles} />
          )}
        </article>
      )}
    </div>
  );
}
