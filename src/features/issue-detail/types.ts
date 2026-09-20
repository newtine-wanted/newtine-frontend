export type IssueDetailAction = "LIKE" | "PASS" | "SKIP";

export interface IssueDetailCategory {
  code: string;
  name: string;
}

export interface IssueDetailViewpoint {
  statement: string;
  articleIds: string[];
}

export interface IssueDetailGlossary {
  term: string;
  definition: string;
  articleIds: string[];
}

export interface IssueDetailArticle {
  id: string;
  title: string;
  url: string;
  publisherName: string;
  publishedAt: string | null;
}

export type IssueDetailImpactTargetType = "AGE_GROUP" | "REGION";

export interface IssueDetailImpact {
  targetType: IssueDetailImpactTargetType;
  targetValue: string;
  description: string;
  timing: string | null;
  action: string | null;
}

export interface IssueDetailResponse {
  id: string;
  title: string;
  category: IssueDetailCategory;
  subCategory: string | null;
  eventAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  integratedSummary: string;
  summaryLines: [string, string, string];
  articleCount: number;
  viewpoints: IssueDetailViewpoint[];
  glossary: IssueDetailGlossary[];
  articles: IssueDetailArticle[];
  impacts: IssueDetailImpact[];
  myAction: IssueDetailAction | null;
}

export interface DetailViewStartRequest {
  sessionId: string;
}

export interface DetailViewStartResponse {
  viewId: string;
  issueId: string;
  startedAt: string;
  expiresAt: string;
}

export interface DetailViewProgressRequest {
  activeMilliseconds: number;
}

export type DetailViewDwellScore = 0 | 0.5 | 1;

export interface DetailViewProgressResponse {
  viewId: string;
  issueId: string;
  acceptedActiveMilliseconds: number;
  totalCreditedMilliseconds: number;
  dwellScore: DetailViewDwellScore;
}

export interface IssueDetailApi {
  getIssueDetail(issueId: string): Promise<IssueDetailResponse>;
  startDetailView(
    issueId: string,
    viewId: string,
    request: DetailViewStartRequest,
  ): Promise<DetailViewStartResponse>;
  updateDetailViewProgress(
    issueId: string,
    viewId: string,
    request: DetailViewProgressRequest,
  ): Promise<DetailViewProgressResponse>;
}
