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
