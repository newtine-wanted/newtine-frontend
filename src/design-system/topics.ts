export const topics = {
  housing: { label: "주거", tone: "sage", icon: "housing" },
  labor: { label: "노동", tone: "olive", icon: "labor" },
  finance: { label: "금융·세제", tone: "moss", icon: "finance" },
  education: { label: "교육", tone: "neutral", icon: "topic" },
  welfare: { label: "복지", tone: "sage", icon: "topic" },
  diplomacy: { label: "외교·안보", tone: "olive", icon: "topic" },
  environment: { label: "환경·에너지", tone: "moss", icon: "topic" },
  local: { label: "지역", tone: "neutral", icon: "topic" },
  generation: { label: "청년·세대", tone: "sage", icon: "topic" },
  justice: { label: "사법·검찰", tone: "olive", icon: "topic" },
  assembly: { label: "국회·정당", tone: "moss", icon: "topic" },
  media: { label: "미디어", tone: "neutral", icon: "topic" },
} as const;

export type Topic = keyof typeof topics;
