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
