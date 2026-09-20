import type { IssueDetailImpactTargetType } from "./types";

type IssueDetailAgeGroupCode =
  "AGE_19_34" | "AGE_35_49" | "AGE_50_64" | "AGE_65_PLUS";

const ageGroupNames = {
  AGE_19_34: "19~34세",
  AGE_35_49: "35~49세",
  AGE_50_64: "50~64세",
  AGE_65_PLUS: "65세 이상",
} satisfies Record<IssueDetailAgeGroupCode, string>;

export function formatIssueImpactTarget(
  targetType: IssueDetailImpactTargetType,
  targetValue: string,
): string {
  if (targetType !== "AGE_GROUP") return targetValue;

  return ageGroupNames[targetValue as IssueDetailAgeGroupCode] ?? targetValue;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatIssueDate(value: string): string {
  const parts = Object.fromEntries(
    dateFormatter
      .formatToParts(new Date(value))
      .map(({ type, value: partValue }) => [type, partValue]),
  );

  return `${parts.month}.${parts.day}`;
}

export function formatIssueDateTime(value: string): string {
  const parts = Object.fromEntries(
    dateTimeFormatter
      .formatToParts(new Date(value))
      .map(({ type, value: partValue }) => [type, partValue]),
  );

  return `${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
}
