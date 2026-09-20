export function ReportDatePicker({
  max,
  value,
  onChange,
}: {
  max: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex min-h-11 min-w-22 cursor-pointer items-center justify-end text-body-sm text-foreground-secondary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
      <span aria-hidden="true">날짜 선택 ▾</span>
      <span className="sr-only">보고서 날짜 선택</span>
      <input
        type="date"
        value={value}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer text-button opacity-0"
      />
    </label>
  );
}
