import { apiClient } from "@/lib/api-client";
import type {
  CompleteOnboardingRequest,
  OnboardingAgeGroup,
  OnboardingCategory,
  OnboardingRegion,
  PoliticalActorSearchResponse,
  PoliticalActorType,
} from "./types";

interface GetPoliticalActorsParams {
  query: string;
  type: PoliticalActorType | null;
  signal?: AbortSignal;
}

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

export async function getPoliticalActors({
  query,
  type,
  signal,
}: GetPoliticalActorsParams): Promise<PoliticalActorSearchResponse> {
  const response = await apiClient.get<PoliticalActorSearchResponse>(
    "/api/metadata/political-actors",
    {
      params: {
        q: query || undefined,
        type: type ?? undefined,
        limit: 100,
        offset: 0,
      },
      signal,
    },
  );

  return response.data;
}

export async function getOnboardingRegions(
  signal?: AbortSignal,
): Promise<OnboardingRegion[]> {
  const response = await apiClient.get<OnboardingRegion[]>(
    "/api/metadata/regions",
    { signal },
  );

  if (response.data.length === 0) {
    throw new Error("온보딩 지역 목록이 비어 있습니다.");
  }

  return [...response.data].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}

export async function getOnboardingAgeGroups(
  signal?: AbortSignal,
): Promise<OnboardingAgeGroup[]> {
  const response = await apiClient.get<OnboardingAgeGroup[]>(
    "/api/metadata/age-groups",
    { signal },
  );

  if (response.data.length === 0) {
    throw new Error("온보딩 나이대 목록이 비어 있습니다.");
  }

  return [...response.data].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}

export async function completeOnboarding(
  request: CompleteOnboardingRequest,
): Promise<void> {
  await apiClient.post("/api/me/onboarding/complete", request);
}

export async function skipOnboarding(): Promise<void> {
  await apiClient.post("/api/me/onboarding/skip");
}
