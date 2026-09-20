"use client";

import { useMemo, useState } from "react";
import { createMockReport } from "./mock-data";
import type { ReportPreviewState } from "./types";

export function useReportScreen(initialPreview: ReportPreviewState) {
  const [preview, setPreview] = useState(initialPreview);
  const report = useMemo(() => createMockReport(preview), [preview]);

  return {
    preview,
    report,
    requestReport: () => setPreview("running"),
    retryReport: () => setPreview("running"),
    openTodayReport: () => setPreview("ready"),
  };
}
