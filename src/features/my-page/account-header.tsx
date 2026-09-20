export function AccountHeader({ email }: { email: string | null }) {
  const initial = email?.trim().charAt(0).toUpperCase() ?? "";

  return (
    <div className="flex items-start justify-between gap-3">
      {email && (
        <p className="min-w-0 flex-1 text-caption wrap-anywhere text-muted">
          {email}
        </p>
      )}
      {initial && (
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center bg-primary"
        >
          <span className="text-heading leading-none font-extrabold text-primary-foreground">
            {initial}
          </span>
        </div>
      )}
    </div>
  );
}
