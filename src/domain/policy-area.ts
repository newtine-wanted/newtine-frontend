export const POLICY_AREAS = [
  "주거",
  "노동",
  "금융·세제",
  "교육",
  "복지",
  "외교·안보",
  "환경·에너지",
  "지역",
  "청년·세대",
  "사법·검찰",
  "국회·정당",
  "미디어",
] as const;

export type PolicyArea = (typeof POLICY_AREAS)[number];
