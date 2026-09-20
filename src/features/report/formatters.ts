const reportDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getTodayReportDate(): string {
  const parts = reportDateFormatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("오늘 날짜를 계산할 수 없습니다.");
  }

  return `${year}-${month}-${day}`;
}

export function formatReportDate(reportDate: string): string {
  const [, month, day] = reportDate.split("-");
  return month && day ? `${month}.${day}` : reportDate;
}

export function isReportDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
