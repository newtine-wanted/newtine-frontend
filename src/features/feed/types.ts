export type FeedContinuation =
  "CONSTRAINT_LIMITED" | "CONTINUE" | "EXHAUSTED" | "SEARCH_LIMITED";

export type FeedSelectionType =
  "CONNECTED" | "EXPLORATION" | "MAJOR" | "OPPOSITE" | "PERSONALIZED";

export interface FeedCategory {
  code: string;
  name: string;
}

export interface FeedCardResponse {
  issueId: string;
  title: string;
  category: FeedCategory;
  eventAt: string | null;
  publishedAt: string | null;
  integratedSummary: string;
  summaryLines: [string, string, string];
  articleCount: number;
  selectionType: FeedSelectionType;
  reasonCodes: string[];
}

export interface FeedResponse {
  items: FeedCardResponse[];
  nextCursor: string | null;
  continuation: FeedContinuation;
}

export type IssueInteractionAction = "LIKE" | "PASS" | "SKIP";

export interface IssueInteractionRequest {
  eventId: string;
  sessionId: string;
  action: IssueInteractionAction;
}

export interface IssueInteractionResponse {
  eventId: string;
  issueId: string;
  acceptedAction: IssueInteractionAction;
  acceptedAt: string;
}

export interface FeedApi {
  getFeed(cursor?: string): Promise<FeedResponse>;
  recordInteraction(
    issueId: string,
    request: IssueInteractionRequest,
  ): Promise<IssueInteractionResponse>;
}
