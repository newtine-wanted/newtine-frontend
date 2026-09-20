"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import { getProblemDetails, getResponseStatus } from "@/domain/auth";
import { authSessionStore } from "@/domain/auth/store";
import { reportApi } from "./api";
import {
  formatReportDate,
  getTodayReportDate,
  isReportDate,
} from "./formatters";
import {
  createReportSummaryViewModel,
  getReportStatusLabel,
  getReportViewState,
} from "./report-view-model";
import type {
  ReportApi,
  ReportGenerationRequest,
  ReportLookupResult,
  ReportResponse,
  ReportSummaryResponse,
} from "./types";

const POLLING_INTERVAL_MS = 2_000;
const REPORT_LOAD_ERROR_MESSAGE =
  "진단보고서를 불러오는 중 문제가 발생했습니다.";

function getErrorMessage(error: unknown, fallback: string): string {
  return getProblemDetails(error)?.detail ?? fallback;
}

export function useReportScreen(api: ReportApi = reportApi) {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const todayReportDate = useMemo(() => getTodayReportDate(), []);
  const [selectedReportDate, setSelectedReportDate] = useState(todayReportDate);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [generationRequest, setGenerationRequest] =
    useState<ReportGenerationRequest | null>(null);
  const [supportsDateSelection, setSupportsDateSelection] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isDailyLimited, setIsDailyLimited] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const actionPendingRef = useRef(false);
  const requestIdRef = useRef(0);

  const applyLookup = useCallback((lookup: ReportLookupResult) => {
    setReport(lookup.report);
    setGenerationRequest(lookup.generationRequest);
    setSupportsDateSelection(lookup.supportsDateSelection);
  }, []);

  const loadReport = useCallback(
    async (signal?: AbortSignal) => {
      if (authStatus !== "authenticated") return;

      const requestId = ++requestIdRef.current;

      try {
        const lookup = await api.getByDate(selectedReportDate, signal);
        if (requestId !== requestIdRef.current || signal?.aborted) return;
        applyLookup(lookup);
      } catch (error) {
        if (requestId !== requestIdRef.current || signal?.aborted) return;
        setReport(null);
        setErrorMessage(getErrorMessage(error, REPORT_LOAD_ERROR_MESSAGE));
      } finally {
        if (requestId === requestIdRef.current && !signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [api, applyLookup, authStatus, selectedReportDate],
  );

  const reloadReport = useCallback(() => {
    setIsLoading(true);
    setIsDailyLimited(false);
    setErrorMessage(null);
    void loadReport();
  }, [loadReport]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    void api
      .getByDate(selectedReportDate, controller.signal)
      .then((lookup) => {
        if (requestId !== requestIdRef.current) return;
        applyLookup(lookup);
      })
      .catch((error: unknown) => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }
        setReport(null);
        setErrorMessage(getErrorMessage(error, REPORT_LOAD_ERROR_MESSAGE));
      })
      .finally(() => {
        if (requestId === requestIdRef.current && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
      requestIdRef.current += 1;
    };
  }, [api, applyLookup, authStatus, selectedReportDate]);

  useEffect(() => {
    if (
      isDailyLimited ||
      !report?.reportId ||
      (report.status !== "QUEUED" && report.status !== "RUNNING")
    ) {
      return;
    }

    const reportId = report.reportId;
    const controller = new AbortController();
    let timeoutId: number | null = null;

    const poll = async () => {
      try {
        const response = await api.get(reportId, controller.signal);
        if (controller.signal.aborted) return;

        setErrorMessage(null);
        setReport(response);

        if (response.status === "QUEUED" || response.status === "RUNNING") {
          timeoutId = window.setTimeout(poll, POLLING_INTERVAL_MS);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage(
          getErrorMessage(
            error,
            "보고서 생성 상태를 확인하는 중 문제가 발생했습니다.",
          ),
        );
      }
    };

    timeoutId = window.setTimeout(poll, POLLING_INTERVAL_MS);

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      controller.abort();
    };
  }, [api, isDailyLimited, report?.reportId, report?.status]);

  const loadSummaryReport = useCallback(
    async (summary: ReportSummaryResponse): Promise<ReportResponse> => {
      if (summary.reportId) {
        return api.get(summary.reportId);
      }

      return (await api.getByDate(selectedReportDate)).report;
    },
    [api, selectedReportDate],
  );

  const requestReport = useCallback(async () => {
    if (actionPendingRef.current) return;

    if (!generationRequest) return;

    const requestId = ++requestIdRef.current;
    actionPendingRef.current = true;
    setIsActionPending(true);
    setIsDailyLimited(false);
    setErrorMessage(null);

    try {
      const summary = await api.request(generationRequest);
      const response = await loadSummaryReport(summary);
      if (requestId !== requestIdRef.current) return;
      setReport(response);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      if (getResponseStatus(error) === 429) {
        try {
          const lookup = await api.getByDate(selectedReportDate);
          if (requestId !== requestIdRef.current) return;

          applyLookup(lookup);
          setIsDailyLimited(lookup.report.status === "REQUEST_REQUIRED");
        } catch {
          if (requestId !== requestIdRef.current) return;
          setIsDailyLimited(true);
        }
      } else {
        setErrorMessage(
          getErrorMessage(
            error,
            "진단보고서 생성을 요청하는 중 문제가 발생했습니다.",
          ),
        );
      }
    } finally {
      actionPendingRef.current = false;
      setIsActionPending(false);
    }
  }, [
    api,
    applyLookup,
    generationRequest,
    loadSummaryReport,
    selectedReportDate,
  ]);

  const retryReport = useCallback(async () => {
    if (actionPendingRef.current || !report?.reportId || !report.retryable) {
      return;
    }

    const requestId = ++requestIdRef.current;
    actionPendingRef.current = true;
    setIsActionPending(true);
    setErrorMessage(null);

    try {
      const summary = await api.retry(report.reportId);
      const response = await loadSummaryReport(summary);
      if (requestId !== requestIdRef.current) return;
      setReport(response);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setErrorMessage(
        getErrorMessage(
          error,
          getResponseStatus(error) === 429
            ? "아직 다시 시도할 수 없습니다. 잠시 후 다시 시도해 주세요."
            : "진단보고서를 다시 만드는 중 문제가 발생했습니다.",
        ),
      );
    } finally {
      actionPendingRef.current = false;
      setIsActionPending(false);
    }
  }, [api, loadSummaryReport, report]);

  const selectReportDate = useCallback(
    (reportDate: string) => {
      if (
        !isReportDate(reportDate) ||
        reportDate > todayReportDate ||
        reportDate === selectedReportDate
      ) {
        return;
      }

      requestIdRef.current += 1;
      setSelectedReportDate(reportDate);
      setReport(null);
      setGenerationRequest(null);
      setIsLoading(true);
      setIsDailyLimited(false);
      setErrorMessage(null);
    },
    [selectedReportDate, todayReportDate],
  );

  const viewState = getReportViewState({
    report,
    isLoading,
    hasError: errorMessage !== null,
    isDailyLimited,
  });
  const content = report?.status === "SUCCEEDED" ? report.content : null;
  const summary = useMemo(
    () => (content ? createReportSummaryViewModel(content) : null),
    [content],
  );

  return {
    content,
    dateLabel: formatReportDate(report?.reportDate ?? selectedReportDate),
    errorMessage:
      errorMessage ??
      (viewState === "error" ? "보고서 내용 형식이 올바르지 않습니다." : null),
    isActionPending,
    maxReportDate: todayReportDate,
    reloadReport,
    report,
    requestReport,
    retryReport,
    selectedReportDate,
    selectReportDate,
    statusLabel: getReportStatusLabel(viewState, report?.content?.issueCount),
    summary,
    supportsDateSelection,
    viewState,
  };
}
