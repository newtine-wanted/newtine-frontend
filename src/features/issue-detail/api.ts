import { apiClient } from "@/lib/api-client";
import type {
  DetailViewProgressRequest,
  DetailViewProgressResponse,
  DetailViewStartRequest,
  DetailViewStartResponse,
  IssueDetailApi,
  IssueDetailResponse,
} from "./types";

function getIssuePath(issueId: string): string {
  return `/api/issues/${encodeURIComponent(issueId)}`;
}

export const issueDetailApi: IssueDetailApi = {
  async getIssueDetail(issueId) {
    const response = await apiClient.get<IssueDetailResponse>(
      getIssuePath(issueId),
    );

    return response.data;
  },

  async startDetailView(issueId, viewId, request) {
    const response = await apiClient.put<DetailViewStartResponse>(
      `${getIssuePath(issueId)}/detail-views/${encodeURIComponent(viewId)}`,
      request satisfies DetailViewStartRequest,
    );

    return response.data;
  },

  async updateDetailViewProgress(issueId, viewId, request) {
    const response = await apiClient.put<DetailViewProgressResponse>(
      `${getIssuePath(issueId)}/detail-views/${encodeURIComponent(viewId)}/progress`,
      request satisfies DetailViewProgressRequest,
    );

    return response.data;
  },
};
