import type { ReportContent, ReportResponse } from "./types";

export type ReportViewState =
  | "loading"
  | "error"
  | "request"
  | "queued"
  | "running"
  | "ready"
  | "insufficient-data"
  | "no-connection"
  | "failed"
  | "daily-limit";

export interface ReportSummaryViewModel {
  description: string;
  hasNoConnection: boolean;
  isInsufficient: boolean;
  issueCount: number;
  minimumIssueCount: number;
  title: string;
}

export function getReportViewState({
  report,
  isLoading,
  hasError,
  isDailyLimited,
}: {
  report: ReportResponse | null;
  isLoading: boolean;
  hasError: boolean;
  isDailyLimited: boolean;
}): ReportViewState {
  if (isLoading) return "loading";
  if (hasError || !report) return "error";
  if (isDailyLimited) return "daily-limit";
  if (report.contentAvailability === "NOT_REQUESTED") return "request";
  if (report.contentAvailability === "PENDING" && report.reportId) {
    return "running";
  }

  switch (report.status) {
    case "REQUEST_REQUIRED":
      return "request";
    case "QUEUED":
      return "queued";
    case "RUNNING":
      return "running";
    case "FAILED":
      return "failed";
    case "SUCCEEDED":
      switch (report.content?.analysisStatus) {
        case "READY":
          return "ready";
        case "INSUFFICIENT_DATA":
          return "insufficient-data";
        case "NO_CONNECTION":
          return "no-connection";
        default:
          return "error";
      }
    default:
      return "error";
  }
}

export function getReportStatusLabel(
  viewState: ReportViewState,
  issueCount?: number,
): string {
  switch (viewState) {
    case "loading":
      return "보고서 확인 중";
    case "error":
      return "조회 실패";
    case "request":
      return "아직 생성 전";
    case "queued":
    case "running":
      return "생성 요청됨";
    case "failed":
      return "생성 실패";
    case "daily-limit":
      return "오늘 생성 요청 완료";
    default:
      return `관심 이슈 ${issueCount ?? 0}건`;
  }
}

export function createReportSummaryViewModel(
  content: ReportContent,
): ReportSummaryViewModel {
  const topCategories = [...content.categoryCounts]
    .sort((left, right) => right.count - left.count)
    .slice(0, 2)
    .map((category) => category.displayName);
  const isInsufficient = content.analysisStatus === "INSUFFICIENT_DATA";
  const hasNoConnection = content.analysisStatus === "NO_CONNECTION";
  const readyTitle =
    topCategories.length > 0
      ? `오늘, 관심은\n${topCategories.join("와 ")}에 모였어요`
      : "오늘의 관심 이슈를\n한곳에 모아봤어요";

  return {
    isInsufficient,
    hasNoConnection,
    issueCount: content.issueCount,
    minimumIssueCount: content.minimumIssueCount,
    title: isInsufficient
      ? "연결을 찾기엔\n아직 기록이 적어요"
      : hasNoConnection
        ? "오늘에는 뚜렷한\n연결을 찾지 못했어요"
        : readyTitle,
    description: isInsufficient
      ? `관심 이슈가 ${content.minimumIssueCount}건 이상 쌓이면 공통점과 차이를 연결해 드릴게요.`
      : hasNoConnection
        ? "기록은 충분하지만 오늘 관심 이슈 사이에서 의미 있는 공통 쟁점이 없었어요."
        : `${content.categoryCounts.length}개 주제에서 ${content.issueCount}개의 관심 이슈가 모였어요.`,
  };
}
