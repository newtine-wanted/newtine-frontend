// openapi.json의 components.schemas를 수동 반영한다.
// API 명세가 변경되면 원본 스키마와 이 파일을 함께 대조한다.

/** OpenAPI schema: MetadataCategoryResponse */
export interface LikedNewsCategory {
  code: string;
  name: string;
  displayOrder: number;
}

export interface LikedIssueCategory {
  code: string;
  name: string;
}

export interface LikedIssue {
  issueId: string;
  title: string;
  category: LikedIssueCategory;
  likedAt: string;
  /** 서버가 항상 null을 주므로 썸네일은 표시하지 않는다. */
  thumbnailUrl: null;
}

/** OpenAPI schema: LikedIssuesResponse */
export interface LikedIssuesResponse {
  items: LikedIssue[];
  totalCount: number;
  nextCursor: string | null;
}
