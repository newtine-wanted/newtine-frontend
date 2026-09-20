import { apiClient } from "@/lib/api-client";
import type { FeedApi, FeedResponse, IssueInteractionResponse } from "./types";

export const feedApi: FeedApi = {
  async getFeed(cursor) {
    const response = await apiClient.get<FeedResponse>("/api/feed", {
      params: { cursor: cursor || undefined },
    });

    return response.data;
  },

  async recordInteraction(issueId, request) {
    const response = await apiClient.post<IssueInteractionResponse>(
      `/api/issues/${encodeURIComponent(issueId)}/interactions`,
      request,
    );

    return response.data;
  },
};
