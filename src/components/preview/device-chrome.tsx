/** Design-reference chrome only. Real devices supply their own system UI. */
export function StatusBar() {
  return (
    <div
      aria-hidden="true"
      className="flex h-11 items-center justify-between bg-background px-6"
    >
      <span className="text-body-sm font-medium text-foreground">9:41</span>
      <span className="text-hint text-foreground-secondary">●●● ◔ ▮</span>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[34px] items-center justify-center bg-background"
    >
      <span className="h-[5px] w-[134px] rounded-[3px] bg-primary" />
    </div>
  );
}
