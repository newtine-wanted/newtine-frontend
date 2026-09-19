import { apiClient } from "@/lib/api-client";
import type { OnboardingCategory } from "./types";

export async function getOnboardingCategories(
  signal?: AbortSignal,
): Promise<OnboardingCategory[]> {
  const response = await apiClient.get<OnboardingCategory[]>(
    "/api/metadata/categories",
    { signal },
  );

  if (response.data.length === 0) {
    throw new Error("온보딩 주제 목록이 비어 있습니다.");
  }

  return [...response.data].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}
