export const topics = {
  housing: { label: "주거", icon: "housing" },
  labor: { label: "노동", icon: "labor" },
  finance: { label: "금융·세제", icon: "finance" },
  education: { label: "교육", icon: "topic" },
  welfare: { label: "복지", icon: "topic" },
  diplomacy: { label: "외교·안보", icon: "topic" },
  environment: { label: "환경·에너지", icon: "topic" },
  local: { label: "지역", icon: "topic" },
  generation: { label: "청년·세대", icon: "topic" },
  justice: { label: "사법·검찰", icon: "topic" },
  assembly: { label: "국회·정당", icon: "topic" },
  media: { label: "미디어", icon: "topic" },
} as const;

export type Topic = keyof typeof topics;
