export function IssueDetailSectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 shrink-0 text-button leading-none font-bold text-foreground">
        {number}
      </span>
      <h3 className="text-[17px] leading-[1.35] font-extrabold text-foreground">
        {title}
      </h3>
    </div>
  );
}
