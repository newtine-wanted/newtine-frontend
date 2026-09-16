import { POLICY_AREAS } from "@/domain/policy-area";
import type { InterestSummary, PolicyAreaLikeCounts } from "./types";

export function getInterestSummary(
  likeCounts: PolicyAreaLikeCounts,
  sampleThreshold: number,
): InterestSummary {
  const counted = POLICY_AREAS.map((area) => ({
    area,
    count: likeCounts[area] ?? 0,
  }))
    .filter(({ count }) => count > 0)
    // 안정 정렬 → 동률은 POLICY_AREAS 순서 유지
    .sort((a, b) => b.count - a.count);

  const total = counted.reduce((sum, { count }) => sum + count, 0);

  if (total === 0) {
    return { state: "empty", total, bars: [] };
  }

  const max = counted[0].count;

  return {
    state: total < sampleThreshold ? "low-sample" : "normal",
    total,
    bars: counted.map(({ area, count }) => ({
      area,
      count,
      widthPercent: (count / max) * 100,
    })),
  };
}
