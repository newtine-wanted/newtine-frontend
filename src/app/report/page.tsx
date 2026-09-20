import type { Metadata } from "next";
import { ReportScreen, type ReportPreviewState } from "@/features/report";

export const metadata: Metadata = {
  title: "진단보고서",
};

const previewStates = new Set<ReportPreviewState>([
  "request",
  "queued",
  "running",
  "ready",
  "insufficient-data",
  "no-connection",
  "failed",
  "daily-limit",
]);

export default async function ReportPage({
  searchParams,
}: PageProps<"/report">) {
  const { preview } = await searchParams;
  const requestedPreview = Array.isArray(preview) ? preview[0] : preview;
  const initialPreview = previewStates.has(
    requestedPreview as ReportPreviewState,
  )
    ? (requestedPreview as ReportPreviewState)
    : "request";

  return <ReportScreen initialPreview={initialPreview} />;
}
