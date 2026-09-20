import { AppBar } from "@/components/ui";
import { IssueArticlesSection } from "./issue-articles-section";
import { IssueDetailBackButton } from "./issue-detail-back-button";
import { IssueDetailHeader } from "./issue-detail-header";
import { IssueGlossarySection } from "./issue-glossary-section";
import { IssueImpactSection } from "./issue-impact-section";
import { IssueSummarySection } from "./issue-summary-section";
import { IssueViewpointsSection } from "./issue-viewpoints-section";
import { ShareIssueButton } from "./share-issue-button";
import type { IssueDetailResponse } from "./types";

export function IssueDetailScreen({ issue }: { issue: IssueDetailResponse }) {
  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-20 border-b-2 border-foreground bg-background">
        <AppBar
          backAction={<IssueDetailBackButton />}
          title="이슈 상세"
          action={<ShareIssueButton title={issue.title} />}
        />
      </div>

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
    </div>
  );
}
