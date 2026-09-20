import { apiClient } from "@/lib/api-client";
import type { LikedIssuesResponse, LikedNewsCategory } from "./types";

const PAGE_SIZE = 20;

interface GetLikedIssuesParams {
  categoryCode?: string;
  cursor?: string;
}

export async function getLikedNewsCategories(): Promise<LikedNewsCategory[]> {
  const response = await apiClient.get<LikedNewsCategory[]>(
    "/api/metadata/categories",
  );

  return [...response.data].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}

export async function getLikedIssues({
  categoryCode,
  cursor,
}: GetLikedIssuesParams): Promise<LikedIssuesResponse> {
  const response = await apiClient.get<LikedIssuesResponse>(
    "/api/me/liked-issues",
    { params: { categoryCode, cursor, limit: PAGE_SIZE } },
  );

  return response.data;
}
