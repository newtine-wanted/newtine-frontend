"use client";

import { AppBar } from "@/components/ui";
import { ReportContent } from "./report-content";
import { ReportStatusPanel } from "./report-status-panel";
import type { ReportPreviewState } from "./types";
import { useReportScreen } from "./use-report-screen";

function formatReportDate(reportDate: string) {
  const [, month, day] = reportDate.split("-");
  return month && day ? `${month}.${day}` : reportDate;
}

export function ReportScreen({
  initialPreview,
}: {
  initialPreview: ReportPreviewState;
}) {
  const { preview, report, requestReport, retryReport, openTodayReport } =
    useReportScreen(initialPreview);
  const dateLabel = formatReportDate(report.reportDate);
  const content = report.status === "SUCCEEDED" ? report.content : null;
  const showDateSelector = content !== null;

  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] bg-background">
      <div className="sticky top-[env(safe-area-inset-top)] z-20 border-b-2 border-foreground bg-background">
        <AppBar
          backHref="/my-page"
          title="진단보고서"
          action={
            showDateSelector ? (
              <span className="text-body-sm text-foreground-secondary">
                날짜 선택 ▾
              </span>
            ) : undefined
          }
        />
      </div>

      <header className="px-5 pt-3 pb-2">
        <p lang="en" className="text-title font-black text-foreground">
          Daily Report
        </p>
        <p className="mt-0.5 text-hint text-muted">
          {dateLabel} · {getStatusLabel(preview, report.content?.issueCount)}
        </p>
      </header>

      {preview === "request" && (
        <ReportStatusPanel kind="request" onAction={requestReport} />
      )}
      {(preview === "queued" || preview === "running") && (
        <ReportStatusPanel kind="running" />
      )}
      {preview === "failed" && (
        <ReportStatusPanel kind="failed" onAction={retryReport} />
      )}
      {preview === "daily-limit" && (
        <ReportStatusPanel kind="daily-limit" onAction={openTodayReport} />
      )}
      {content && <ReportContent content={content} />}
    </div>
  );
}

function getStatusLabel(
  preview: ReportPreviewState,
  issueCount?: number,
): string {
  if (preview === "request") return "아직 생성 전";
  if (preview === "queued" || preview === "running") return "생성 요청됨";
  if (preview === "failed") return "생성 실패";
  if (preview === "daily-limit") return "오늘 생성 요청 완료";
  return `관심 이슈 ${issueCount ?? 0}건`;
}
