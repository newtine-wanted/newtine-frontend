import { apiClient } from "@/lib/api-client";
import type { InterestAnalysisResponse } from "./types";

export async function getInterestAnalysis(): Promise<InterestAnalysisResponse> {
  const response = await apiClient.get<InterestAnalysisResponse>(
    "/api/me/interest-analysis",
  );

  return response.data;
}
