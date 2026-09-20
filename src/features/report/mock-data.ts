import type {
  ReportAnalysisStatus,
  ReportContent,
  ReportPreviewState,
  ReportResponse,
} from "./types";

const evidenceIssues = [
  {
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76c1",
    title: "청년 주거 지원 대상 확대 논의",
    categoryCode: "housing",
    categoryName: "주거",
    categoryOrder: 1,
    summary: "청년 주거 지원의 대상과 재원 마련 방안을 함께 논의하고 있어요.",
    summaryLines: [
      "청년 주거 지원 대상 확대가 논의되고 있어요.",
      "재원 마련과 지원 기준이 주요 쟁점이에요.",
      "지역별 주거비 차이도 함께 검토되고 있어요.",
    ],
  },
  {
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76c2",
    title: "생활비 부담에 따른 청년 고용 변화",
    categoryCode: "labor",
    categoryName: "노동",
    categoryOrder: 2,
    summary: "임금과 생활비 변화가 청년 고용 선택에 미치는 영향을 살펴봐요.",
    summaryLines: [
      "생활비 부담이 청년의 일자리 선택에 영향을 주고 있어요.",
      "임금 수준과 고용 안정성이 함께 거론돼요.",
      "주거비와 금융 비용도 연결된 쟁점이에요.",
    ],
  },
];

const relatedIssues = [
  {
    ...evidenceIssues[0],
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76d1",
    sourceIssueId: evidenceIssues[0].issueId,
    reason: "관심 표시한 주거 정책과 지원 대상 기준이 비슷해요.",
  },
  {
    ...evidenceIssues[1],
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76d2",
    sourceIssueId: evidenceIssues[1].issueId,
    reason: "노동 소득과 생활비 부담의 관계를 함께 볼 수 있어요.",
  },
];

const majorIssues = [
  {
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76e1",
    title: "국회, 내년도 예산안 심사를 시작했어요",
    categoryCode: "politics",
    categoryName: "정치",
    categoryOrder: 1,
    summary: "내년도 예산안 심사에서 복지와 산업 지원 규모가 주요 쟁점이에요.",
    summaryLines: [
      "국회가 내년도 예산안 심사를 시작했어요.",
      "복지와 산업 지원 규모가 주요 쟁점이에요.",
      "상임위원회별 조정 과정이 이어질 예정이에요.",
    ],
  },
  {
    issueId: "01995d0d-6cc9-7d51-8b93-a430869c76e2",
    title: "반도체 세액공제 연장안 상임위 통과",
    categoryCode: "finance",
    categoryName: "경제·주식",
    categoryOrder: 2,
    summary: "반도체 투자 세액공제 연장안이 상임위원회를 통과했어요.",
    summaryLines: [
      "반도체 투자 세액공제 연장안이 상임위를 통과했어요.",
      "투자 촉진 효과와 세수 감소가 함께 논의돼요.",
      "본회의 의결 절차가 남아 있어요.",
    ],
  },
];

function createContent(
  analysisStatus: ReportAnalysisStatus,
  issueCount: number,
): ReportContent {
  const categoryCounts =
    analysisStatus === "INSUFFICIENT_DATA"
      ? [{ categoryCode: "housing", displayName: "주거", count: issueCount }]
      : [
          { categoryCode: "housing", displayName: "주거", count: 6 },
          { categoryCode: "labor", displayName: "노동", count: 4 },
          { categoryCode: "finance", displayName: "금융", count: 3 },
          { categoryCode: "education", displayName: "교육", count: 1 },
        ];

  return {
    schemaVersion: 1,
    analysisStatus,
    issueCount,
    minimumIssueCount: 5,
    categoryCounts,
    connections:
      analysisStatus === "READY"
        ? [
            {
              label: "주거 × 청년",
              title: "지원 대상은 넓어지고, 지속 가능성이 쟁점이 됐어요",
              description:
                "청년 주거 지원 확대와 재정 부담을 함께 비교할 수 있어요.",
              issueIds: evidenceIssues.map((issue) => issue.issueId),
            },
            {
              label: "노동 × 금융",
              title: "소득 변화가 생활비 부담으로 이어졌어요",
              description:
                "임금과 금리 변화가 가계 부담에 만드는 연결을 모아봤어요.",
              issueIds: [evidenceIssues[1].issueId],
            },
          ]
        : [],
    evidenceIssues,
    relatedIssues,
    majorIssues,
    majorIssueCategoryCodes: ["politics", "finance"],
    majorIssuesStatus: "READY",
    recommendationsStatus: "READY",
    recommendationCapturedAt: "2026-09-20T09:00:00.000Z",
  };
}

export function createMockReport(preview: ReportPreviewState): ReportResponse {
  const base = {
    reportDate: "2026-09-20",
    requestedAt: "2026-09-20T08:58:00.000Z",
    startedAt: "2026-09-20T08:58:02.000Z",
    completedAt: null,
    nextRetryAt: null,
    failureCode: null,
  };

  if (preview === "request") {
    return {
      ...base,
      reportId: null,
      status: "REQUEST_REQUIRED",
      requestedAt: null,
      startedAt: null,
      retryable: false,
      content: null,
      contentAvailability: "NOT_REQUESTED",
    };
  }

  if (preview === "queued" || preview === "running") {
    return {
      ...base,
      reportId: "01995d0d-6cc9-7d51-8b93-a430869c7701",
      status: preview === "queued" ? "QUEUED" : "RUNNING",
      retryable: false,
      content: null,
      contentAvailability: "PENDING",
    };
  }

  if (preview === "failed") {
    return {
      ...base,
      reportId: "01995d0d-6cc9-7d51-8b93-a430869c7701",
      status: "FAILED",
      completedAt: "2026-09-20T08:59:00.000Z",
      retryable: true,
      failureCode: "REPORT_GENERATION_FAILED",
      content: null,
      contentAvailability: "UNAVAILABLE",
    };
  }

  if (preview === "daily-limit") {
    return {
      ...base,
      reportId: "01995d0d-6cc9-7d51-8b93-a430869c7701",
      status: "RUNNING",
      retryable: false,
      content: null,
      contentAvailability: "PENDING",
    };
  }

  const analysisStatus =
    preview === "insufficient-data"
      ? "INSUFFICIENT_DATA"
      : preview === "no-connection"
        ? "NO_CONNECTION"
        : "READY";
  const issueCount = analysisStatus === "INSUFFICIENT_DATA" ? 2 : 14;

  return {
    ...base,
    reportId: "01995d0d-6cc9-7d51-8b93-a430869c7701",
    status: "SUCCEEDED",
    completedAt: "2026-09-20T08:59:20.000Z",
    retryable: false,
    content: createContent(analysisStatus, issueCount),
    contentAvailability: analysisStatus === "READY" ? "AVAILABLE" : "PARTIAL",
  };
}
