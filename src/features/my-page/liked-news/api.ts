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

  // 배열이 아닌 본문을 전개하면 조용히 깨진 칩 목록이 되므로 여기서 끊는다.
  if (!Array.isArray(response.data)) {
    throw new Error("주제 목록 형식이 올바르지 않습니다.");
  }

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
