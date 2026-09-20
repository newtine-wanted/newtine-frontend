import type { ReportConnection } from "./types";

export function ReportConnectionsSection({
  connections,
}: {
  connections: ReportConnection[];
}) {
  if (connections.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 border-t-2 border-foreground pt-4">
      <div>
        <p lang="en" className="text-heading font-extrabold text-foreground">
          Connections
        </p>
        <h2 className="mt-0.5 text-caption text-muted">
          따로 본 이슈가 이렇게 연결돼요
        </h2>
      </div>
      <ul className="flex flex-col divide-y divide-divider border-y border-divider">
        {connections.map((connection) => (
          <li key={`${connection.label}-${connection.title}`} className="py-4">
            <p className="text-label font-bold text-accent">
              {connection.label}
            </p>
            <h3 className="mt-1 text-body font-bold break-keep text-foreground">
              {connection.title}
            </h3>
            <p className="mt-1 text-caption leading-5 break-keep text-muted">
              {connection.description} · 근거 이슈 {connection.issueIds.length}
              건
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
