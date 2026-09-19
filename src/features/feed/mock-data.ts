import type { FeedResponse } from "./types";

export const MOCK_NEXT_CURSOR = "mock-feed-page-2";

export const MOCK_FEED_FIRST_PAGE: FeedResponse = {
  items: [
    {
      issueId: "10000000-0000-4000-8000-000000000001",
      title: "청년 주거 지원 대상과 기간을 확대하는 방안이 논의되고 있어요",
      category: { code: "housing", name: "주거" },
      eventAt: "2026-09-17T09:00:00.000Z",
      publishedAt: "2026-09-17T12:30:00.000Z",
      integratedSummary:
        "청년 주거비 부담을 낮추기 위해 지원 대상과 기간을 확대하는 방안이 논의되고 있습니다.",
      summaryLines: [
        "지원 대상의 소득 기준을 완화하는 방안이 포함됐어요.",
        "지원 기간을 늘리고 신청 절차를 단순화하는 내용도 검토 중이에요.",
        "구체적인 대상과 시행 시기는 추가 논의를 거쳐 정해질 예정이에요.",
      ],
      articleCount: 18,
      selectionType: "PERSONALIZED",
      reasonCodes: ["INTEREST_TOPIC"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000002",
      title: "지역 의료 인력을 확보하기 위한 지원책이 발표됐어요",
      category: { code: "health", name: "보건·의료" },
      eventAt: "2026-09-16T01:00:00.000Z",
      publishedAt: "2026-09-16T06:20:00.000Z",
      integratedSummary:
        "의료 인력이 부족한 지역의 진료 공백을 줄이기 위한 인력 지원 방안이 발표됐습니다.",
      summaryLines: [
        "지역 근무 의료인에게 교육과 정착 지원을 제공해요.",
        "필수 진료과를 중심으로 인력 배치를 우선 추진해요.",
        "지역별 수요를 반영한 세부 기준은 추후 공개될 예정이에요.",
      ],
      articleCount: 12,
      selectionType: "CONNECTED",
      reasonCodes: ["RELATED_TOPIC"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000003",
      title: "재생에너지 사업의 인허가 절차를 정비하는 개정안이 나왔어요",
      category: { code: "climate", name: "환경·에너지" },
      eventAt: null,
      publishedAt: "2026-09-15T08:00:00.000Z",
      integratedSummary:
        "재생에너지 사업의 준비 기간을 줄이기 위해 관련 인허가 절차를 정비하는 개정안이 제안됐습니다.",
      summaryLines: [
        "여러 기관에 나뉜 심사 절차를 연계하는 내용이 담겼어요.",
        "환경성과 주민 수용성을 확인하는 절차는 유지돼요.",
        "사업 기간 단축 효과를 두고 다양한 의견이 나오고 있어요.",
      ],
      articleCount: 9,
      selectionType: "EXPLORATION",
      reasonCodes: ["NEW_TOPIC"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000004",
      title: "내년도 예산안 심사를 위한 국회 논의가 시작됐어요",
      category: { code: "politics", name: "정치" },
      eventAt: "2026-09-14T00:00:00.000Z",
      publishedAt: null,
      integratedSummary:
        "국회가 내년도 예산안의 주요 지출 항목과 재원 마련 방안을 검토하기 시작했습니다.",
      summaryLines: [
        "민생과 지역 사업 예산이 주요 쟁점으로 다뤄질 예정이에요.",
        "재정 건전성과 경기 대응의 균형을 두고 의견이 엇갈려요.",
        "상임위원회 심사 뒤 전체 예산안 조정이 진행돼요.",
      ],
      articleCount: 24,
      selectionType: "MAJOR",
      reasonCodes: ["MAJOR_ISSUE"],
    },
  ],
  nextCursor: MOCK_NEXT_CURSOR,
  continuation: "CONTINUE",
};

export const MOCK_FEED_SECOND_PAGE: FeedResponse = {
  items: [
    {
      issueId: "10000000-0000-4000-8000-000000000005",
      title: "육아휴직 급여의 지원 범위를 넓히는 방안이 검토되고 있어요",
      category: { code: "welfare", name: "복지" },
      eventAt: "2026-09-13T05:00:00.000Z",
      publishedAt: "2026-09-13T09:10:00.000Z",
      integratedSummary:
        "육아휴직을 사용하는 가정의 소득 감소를 줄이기 위한 급여 확대 방안이 검토되고 있습니다.",
      summaryLines: [
        "초기 휴직 기간의 급여 비율을 높이는 안이 논의돼요.",
        "중소기업의 대체 인력 지원도 함께 검토되고 있어요.",
        "재원 규모와 적용 시기는 아직 확정되지 않았어요.",
      ],
      articleCount: 15,
      selectionType: "PERSONALIZED",
      reasonCodes: ["INTEREST_TOPIC"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000006",
      title: "대중교통 정기권 지원 지역을 확대하는 시범사업이 추진돼요",
      category: { code: "local", name: "지역" },
      eventAt: "2026-09-12T03:30:00.000Z",
      publishedAt: "2026-09-12T07:00:00.000Z",
      integratedSummary:
        "대중교통비 부담을 낮추기 위해 정기권 지원 지역을 확대하는 시범사업이 추진됩니다.",
      summaryLines: [
        "참여 지역과 교통수단의 범위를 단계적으로 늘릴 계획이에요.",
        "청년과 저소득층에는 추가 할인 방안이 검토돼요.",
        "시범사업 결과를 바탕으로 전국 확대 여부를 결정해요.",
      ],
      articleCount: 7,
      selectionType: "CONNECTED",
      reasonCodes: ["REGION_MATCH"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000007",
      title: "직업훈련 지원 대상을 플랫폼 노동자까지 넓히는 방안이 제안됐어요",
      category: { code: "labor", name: "노동" },
      eventAt: null,
      publishedAt: "2026-09-11T11:40:00.000Z",
      integratedSummary:
        "고용 형태와 관계없이 직업훈련을 받을 수 있도록 지원 대상을 확대하는 방안이 제안됐습니다.",
      summaryLines: [
        "플랫폼 노동자와 프리랜서도 지원 대상에 포함하는 내용이에요.",
        "훈련비 지원과 함께 소득 공백을 보완하는 방안도 검토돼요.",
        "기존 고용보험 제도와의 연계 방식이 쟁점이에요.",
      ],
      articleCount: 11,
      selectionType: "OPPOSITE",
      reasonCodes: ["DIFFERENT_VIEWPOINT"],
    },
    {
      issueId: "10000000-0000-4000-8000-000000000008",
      title: "대학 등록금 지원 제도의 신청 기준이 일부 조정돼요",
      category: { code: "education", name: "교육" },
      eventAt: "2026-09-10T02:00:00.000Z",
      publishedAt: "2026-09-10T04:45:00.000Z",
      integratedSummary:
        "대학 등록금 지원을 받을 수 있는 소득 기준과 신청 절차가 일부 조정됩니다.",
      summaryLines: [
        "지원 구간 산정에 반영되는 항목이 일부 달라져요.",
        "온라인 신청 과정에서 제출해야 하는 서류가 줄어들어요.",
        "변경된 기준은 다음 학기 신청부터 적용될 예정이에요.",
      ],
      articleCount: 6,
      selectionType: "EXPLORATION",
      reasonCodes: ["NEW_TOPIC"],
    },
  ],
  nextCursor: null,
  continuation: "EXHAUSTED",
};

export const MOCK_EMPTY_FEED: FeedResponse = {
  items: [],
  nextCursor: null,
  continuation: "EXHAUSTED",
};
