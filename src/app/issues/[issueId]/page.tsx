import type { Metadata } from "next";
import {
  getIssueDetailPreview,
  IssueDetailScreen,
} from "@/features/issue-detail";

export const metadata: Metadata = {
  title: "이슈 상세",
};

export default async function IssueDetailPage({
  params,
}: PageProps<"/issues/[issueId]">) {
  const { issueId } = await params;

  return <IssueDetailScreen issue={getIssueDetailPreview(issueId)} />;
}
