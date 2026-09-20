import type { IssueDetailResponse } from "./types";

const issueDetailPreview: IssueDetailResponse = {
  id: "d167c87e-606f-42bb-aa7f-d65c7819f282",
  title: "청년 월세 지원, 소득 기준 완화해 대상 2배로 늘린다",
  category: {
    code: "HOUSING",
    name: "주거",
  },
  subCategory: "청년 주거",
  eventAt: "2026-09-07T05:20:00.000Z",
  publishedAt: "2026-09-06T09:40:00.000Z",
  updatedAt: "2026-09-07T05:20:00.000Z",
  integratedSummary: "청년 월세 지원을 받을 수 있는 사람이 두 배로 늘어난다",
  summaryLines: [
    "월세 지원 대상 소득 기준이 중위소득 60%에서 100%로 완화된다",
    "신청은 다음 달 1일부터 복지로 또는 주민센터에서 가능하다",
    "예산은 기존 대비 2배로 늘지만 재원 근거가 부족하다는 지적도 있다",
  ],
  articleCount: 4,
  viewpoints: [
    {
      statement: "사각지대 청년에게 실질적인 도움이 될 수 있어요.",
      articleIds: [
        "2f86c1e6-bb2e-48dd-b7ab-ad96840842d2",
        "df070be0-b037-4ca0-b077-584f8124eb92",
      ],
    },
    {
      statement: "재원 근거가 더 구체적이어야 한다는 지적이 있어요.",
      articleIds: ["a4c42ec7-9518-44f2-bcb5-696ec6554f93"],
    },
  ],
  glossary: [
    {
      term: "중위소득",
      definition: "전체 가구를 소득순으로 세웠을 때 가운데에 있는 가구의 소득",
      articleIds: ["2f86c1e6-bb2e-48dd-b7ab-ad96840842d2"],
    },
    {
      term: "무주택",
      definition: "본인 명의로 소유한 주택이 없는 상태",
      articleIds: ["df070be0-b037-4ca0-b077-584f8124eb92"],
    },
    {
      term: "복지로",
      definition: "복지 서비스 정보 확인과 신청을 제공하는 정부 온라인 서비스",
      articleIds: ["a4c42ec7-9518-44f2-bcb5-696ec6554f93"],
    },
  ],
  articles: [
    {
      id: "2f86c1e6-bb2e-48dd-b7ab-ad96840842d2",
      title: "청년 월세 지원 소득기준 완화…대상 2배",
      url: "https://example.com/news/youth-rent-1",
      publisherName: "○○일보",
      publishedAt: "2026-09-07T00:10:00.000Z",
    },
    {
      id: "df070be0-b037-4ca0-b077-584f8124eb92",
      title: "정부, 청년 주거지원 확대 발표",
      url: "https://example.com/news/youth-rent-2",
      publisherName: "△△뉴스",
      publishedAt: "2026-09-06T09:40:00.000Z",
    },
    {
      id: "a4c42ec7-9518-44f2-bcb5-696ec6554f93",
      title: "청년 월세 지원 확대, 재원 마련은 과제",
      url: "https://example.com/news/youth-rent-3",
      publisherName: "□□경제",
      publishedAt: "2026-09-06T11:20:00.000Z",
    },
    {
      id: "5df8e4c4-26f4-4ca9-a8df-779453c2ea09",
      title: "월세 지원 신청 대상과 방법 총정리",
      url: "https://example.com/news/youth-rent-4",
      publisherName: "◇◇통신",
      publishedAt: null,
    },
  ],
  impacts: [
    {
      targetType: "AGE_GROUP",
      targetValue: "만 19~34세 청년 · 무주택 · 소득 중위 100% 이하",
      description: "조건에 해당하면 월세 지원 신청 대상이 될 수 있어요.",
      timing: "10월 1일 신청 시작, 12월 첫 지급",
      action: "복지로 또는 주민센터에서 신청 조건 확인",
    },
  ],
  myAction: null,
};

export function getIssueDetailPreview(issueId: string): IssueDetailResponse {
  return { ...issueDetailPreview, id: issueId };
}
