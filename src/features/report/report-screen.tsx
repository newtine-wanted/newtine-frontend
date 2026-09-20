"use client";

import {
  AppBar,
  AsyncContentError,
  AsyncContentLoading,
} from "@/components/ui";
import { ReportContent } from "./report-content";
import { ReportDatePicker } from "./report-date-picker";
import { ReportStatusPanel } from "./report-status-panel";
import { useReportScreen } from "./use-report-screen";

export function ReportScreen() {
  const {
    content,
    dateLabel,
    errorMessage,
    isActionPending,
    maxReportDate,
    reloadReport,
    report,
    requestReport,
    retryReport,
    selectedReportDate,
    selectReportDate,
    statusLabel,
    summary,
    supportsDateSelection,
    viewState,
  } = useReportScreen();
  const showDateSelector =
    supportsDateSelection &&
    (content !== null || selectedReportDate !== maxReportDate);

  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-20 border-b-2 border-foreground bg-background">
        <AppBar
          backHref="/my-page"
          title="진단보고서"
          action={
            showDateSelector ? (
              <ReportDatePicker
                max={maxReportDate}
                value={selectedReportDate}
                onChange={selectReportDate}
              />
            ) : undefined
          }
        />
      </div>

      <header className="px-5 pt-3 pb-2">
        <p lang="en" className="text-title font-black text-foreground">
          Daily Report
        </p>
        <p className="mt-0.5 text-hint text-muted">
          {dateLabel} · {statusLabel}
        </p>
      </header>

      {viewState === "loading" && (
        <AsyncContentLoading
          title="진단보고서를 불러오는 중이에요"
          description="오늘의 기록을 확인하고 있어요."
          className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-128px)] px-5"
        />
      )}
      {viewState === "error" && (
        <AsyncContentError
          title="진단보고서를 불러오지 못했어요"
          description={errorMessage ?? "잠시 후 다시 시도해 주세요."}
          onRetry={reloadReport}
          className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-128px)] px-5"
        />
      )}
      {viewState === "request" && (
        <ReportStatusPanel
          kind="request"
          isActionPending={isActionPending}
          onAction={() => void requestReport()}
        />
      )}
      {(viewState === "queued" || viewState === "running") && (
        <ReportStatusPanel kind="running" />
      )}
      {viewState === "failed" && (
        <ReportStatusPanel
          kind="failed"
          isActionPending={isActionPending}
          onAction={report?.retryable ? () => void retryReport() : undefined}
        />
      )}
      {viewState === "daily-limit" && (
        <ReportStatusPanel
          kind="daily-limit"
          isActionPending={isActionPending}
          onAction={reloadReport}
        />
      )}
      {content && summary && (
        <ReportContent content={content} summary={summary} />
      )}
    </div>
  );
}
