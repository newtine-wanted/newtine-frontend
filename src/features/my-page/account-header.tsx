export function AccountHeader({ email }: { email: string | null }) {
  const initial = email?.trim().charAt(0).toUpperCase() ?? "";

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h1
          lang="en"
          className="text-hero leading-none font-black text-foreground"
        >
          My Page
        </h1>
        {email && (
          <p className="text-caption wrap-anywhere text-muted">{email}</p>
        )}
      </div>
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
