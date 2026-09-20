import { apiClient } from "@/lib/api-client";
import {
  normalizeReportLookup,
  normalizeReportResponse,
  normalizeReportSummaryResponse,
} from "./report-contract";
import type { ReportApi, ReportLookupResult } from "./types";

function getReportPath(reportId: string): string {
  return `/api/me/reports/${encodeURIComponent(reportId)}`;
}

export const reportApi: ReportApi = {
  async getByDate(reportDate, signal) {
    const response = await apiClient.get<unknown>("/api/me/reports", {
      params: { reportDate },
      signal,
    });
    const lookup = normalizeReportLookup(response.data, reportDate);

    if (
      lookup.report.status === "SUCCEEDED" &&
      lookup.report.reportId &&
      lookup.report.content === null
    ) {
      const detailResponse = await apiClient.get<unknown>(
        getReportPath(lookup.report.reportId),
        { signal },
      );

      return {
        ...lookup,
        report: normalizeReportResponse(detailResponse.data),
      } satisfies ReportLookupResult;
    }

    return lookup;
  },

  async request(request) {
    const body =
      request.contract === "daily"
        ? { reportDate: request.reportDate }
        : { periodStart: request.periodStart };
    const response = await apiClient.post<unknown>("/api/me/reports", body);

    return normalizeReportSummaryResponse(response.data);
  },

  async get(reportId, signal) {
    const response = await apiClient.get<unknown>(getReportPath(reportId), {
      signal,
    });

    return normalizeReportResponse(response.data);
  },

  async retry(reportId) {
    const response = await apiClient.post<unknown>(
      `${getReportPath(reportId)}/retry`,
    );

    return normalizeReportSummaryResponse(response.data);
  },
};
