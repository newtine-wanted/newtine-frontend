import type { Metadata } from "next";
import { ReportScreen } from "@/features/report";

export const metadata: Metadata = {
  title: "진단보고서",
};

export default function ReportPage() {
  return <ReportScreen />;
}
