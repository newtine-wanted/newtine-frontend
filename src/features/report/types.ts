export type ReportStatus =
  "FAILED" | "QUEUED" | "REQUEST_REQUIRED" | "RUNNING" | "SUCCEEDED";

export type ReportContentAvailability =
  "AVAILABLE" | "NOT_REQUESTED" | "PARTIAL" | "PENDING" | "UNAVAILABLE";

export type ReportAnalysisStatus =
  "INSUFFICIENT_DATA" | "NO_CONNECTION" | "READY";

export interface ReportCategoryCount {
  categoryCode: string;
  displayName: string;
  count: number;
}

export interface ReportConnection {
  label: string;
  title: string;
  description: string;
  issueIds: string[];
}

export interface ReportIssue {
  issueId: string;
  title: string;
  categoryCode: string;
  categoryName: string;
  categoryOrder: number;
  summary: string;
  summaryLines: string[];
}

export interface RelatedReportIssue extends ReportIssue {
  sourceIssueId: string;
  reason: string;
}

export interface ReportContent {
  schemaVersion: 1;
  analysisStatus: ReportAnalysisStatus;
  issueCount: number;
  minimumIssueCount: 5;
  categoryCounts: ReportCategoryCount[];
  connections: ReportConnection[];
  evidenceIssues: ReportIssue[];
  relatedIssues: RelatedReportIssue[];
  majorIssues: ReportIssue[];
  majorIssueCategoryCodes: string[];
  majorIssuesStatus: "NO_CANDIDATES" | "NO_INTEREST" | "READY";
  recommendationsStatus: "PARTIAL" | "READY";
  recommendationCapturedAt: string;
}

export interface ReportResponse {
  reportId: string | null;
  status: ReportStatus;
  reportDate: string;
  requestedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  retryable: boolean;
  nextRetryAt: string | null;
  failureCode: string | null;
  content: ReportContent | null;
  contentAvailability: ReportContentAvailability;
}

export type ReportSummaryResponse = Omit<
  ReportResponse,
  "content" | "contentAvailability"
>;

export type ReportGenerationRequest =
  | {
      contract: "daily";
      reportDate: string;
    }
  | {
      contract: "weekly";
      periodStart: string;
    };

export interface ReportLookupResult {
  generationRequest: ReportGenerationRequest;
  report: ReportResponse;
  supportsDateSelection: boolean;
}

export interface ReportApi {
  getByDate: (
    reportDate: string,
    signal?: AbortSignal,
  ) => Promise<ReportLookupResult>;
  request: (request: ReportGenerationRequest) => Promise<ReportSummaryResponse>;
  get: (reportId: string, signal?: AbortSignal) => Promise<ReportResponse>;
  retry: (reportId: string) => Promise<ReportSummaryResponse>;
}
