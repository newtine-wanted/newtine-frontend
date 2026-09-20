import type {
  ReportContent,
  ReportContentAvailability,
  ReportLookupResult,
  ReportResponse,
  ReportStatus,
  ReportSummaryResponse,
} from "./types";

interface LegacyReportPeriod {
  end: string;
  endAt: string;
  start: string;
  startAt: string;
  timeZone: "Asia/Seoul";
}

interface LegacyReportSummary {
  completedAt: string | null;
  failureCode: string | null;
  nextRetryAt: string | null;
  period: LegacyReportPeriod;
  reportId: string;
  requestedAt: string;
  retryable: boolean;
  startedAt: string | null;
  status: Exclude<ReportStatus, "REQUEST_REQUIRED">;
}

interface LegacyReportListResponse {
  eligiblePeriod: LegacyReportPeriod;
  latestSucceeded: LegacyReportSummary | null;
  nextEligibleAt: string;
  periods: Array<{
    period: LegacyReportPeriod;
    report: LegacyReportSummary | null;
  }>;
}

interface LegacyReportResponse extends LegacyReportSummary {
  content: ReportContent | null;
  contentAvailability: Exclude<ReportContentAvailability, "NOT_REQUESTED">;
}

const legacyStatuses = new Set<LegacyReportSummary["status"]>([
  "FAILED",
  "QUEUED",
  "RUNNING",
  "SUCCEEDED",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isLegacyPeriod(value: unknown): value is LegacyReportPeriod {
  return (
    isRecord(value) &&
    typeof value.start === "string" &&
    typeof value.end === "string" &&
    typeof value.startAt === "string" &&
    typeof value.endAt === "string" &&
    value.timeZone === "Asia/Seoul"
  );
}

function isLegacySummary(value: unknown): value is LegacyReportSummary {
  return (
    isRecord(value) &&
    typeof value.reportId === "string" &&
    legacyStatuses.has(value.status as LegacyReportSummary["status"]) &&
    isLegacyPeriod(value.period) &&
    typeof value.requestedAt === "string" &&
    isNullableString(value.startedAt) &&
    isNullableString(value.completedAt) &&
    typeof value.retryable === "boolean" &&
    isNullableString(value.nextRetryAt) &&
    isNullableString(value.failureCode)
  );
}

function isLegacyListResponse(
  value: unknown,
): value is LegacyReportListResponse {
  if (
    !isRecord(value) ||
    !isLegacyPeriod(value.eligiblePeriod) ||
    typeof value.nextEligibleAt !== "string" ||
    !Array.isArray(value.periods)
  ) {
    return false;
  }

  return value.periods.every(
    (item) =>
      isRecord(item) &&
      isLegacyPeriod(item.period) &&
      (item.report === null || isLegacySummary(item.report)),
  );
}

function isDailyReportResponse(value: unknown): value is ReportResponse {
  return (
    isRecord(value) &&
    typeof value.reportDate === "string" &&
    typeof value.status === "string" &&
    "content" in value &&
    typeof value.contentAvailability === "string"
  );
}

function isDailyReportSummary(value: unknown): value is ReportSummaryResponse {
  return (
    isRecord(value) &&
    typeof value.reportDate === "string" &&
    typeof value.status === "string" &&
    "reportId" in value
  );
}

function isLegacyReportResponse(value: unknown): value is LegacyReportResponse {
  return (
    isLegacySummary(value) &&
    "content" in value &&
    "contentAvailability" in value &&
    typeof value.contentAvailability === "string"
  );
}

function getContentAvailability(
  status: LegacyReportSummary["status"],
): ReportContentAvailability {
  switch (status) {
    case "QUEUED":
    case "RUNNING":
      return "PENDING";
    case "SUCCEEDED":
      return "AVAILABLE";
    case "FAILED":
      return "UNAVAILABLE";
  }
}

function normalizeLegacySummary(
  summary: LegacyReportSummary,
): ReportSummaryResponse {
  return {
    reportId: summary.reportId,
    status: summary.status,
    reportDate: summary.period.start,
    requestedAt: summary.requestedAt,
    startedAt: summary.startedAt,
    completedAt: summary.completedAt,
    retryable: summary.retryable,
    nextRetryAt: summary.nextRetryAt,
    failureCode: summary.failureCode,
  };
}

function createReportFromSummary(summary: LegacyReportSummary): ReportResponse {
  return {
    ...normalizeLegacySummary(summary),
    content: null,
    contentAvailability: getContentAvailability(summary.status),
  };
}

function createRequestRequiredReport(reportDate: string): ReportResponse {
  return {
    reportId: null,
    status: "REQUEST_REQUIRED",
    reportDate,
    requestedAt: null,
    startedAt: null,
    completedAt: null,
    retryable: false,
    nextRetryAt: null,
    failureCode: null,
    content: null,
    contentAvailability: "NOT_REQUESTED",
  };
}

export function normalizeReportLookup(
  value: unknown,
  requestedReportDate: string,
): ReportLookupResult {
  if (isDailyReportResponse(value)) {
    return {
      report: value,
      generationRequest: {
        contract: "daily",
        reportDate: value.reportDate || requestedReportDate,
      },
      supportsDateSelection: true,
    };
  }

  if (!isLegacyListResponse(value)) {
    throw new TypeError("지원하지 않는 진단보고서 응답 형식입니다.");
  }

  const periodStart = value.eligiblePeriod.start;
  const eligibleItem = value.periods.find(
    ({ period }) => period.start === periodStart,
  );

  return {
    report: eligibleItem?.report
      ? createReportFromSummary(eligibleItem.report)
      : createRequestRequiredReport(periodStart),
    generationRequest: { contract: "weekly", periodStart },
    supportsDateSelection: false,
  };
}

export function normalizeReportResponse(value: unknown): ReportResponse {
  if (isDailyReportResponse(value)) return value;

  if (!isLegacyReportResponse(value)) {
    throw new TypeError("지원하지 않는 진단보고서 상세 응답 형식입니다.");
  }

  return {
    ...normalizeLegacySummary(value),
    content: value.content,
    contentAvailability: value.contentAvailability,
  };
}

export function normalizeReportSummaryResponse(
  value: unknown,
): ReportSummaryResponse {
  if (isDailyReportSummary(value)) return value;

  if (!isLegacySummary(value)) {
    throw new TypeError("지원하지 않는 진단보고서 요약 응답 형식입니다.");
  }

  return normalizeLegacySummary(value);
}
