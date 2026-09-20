export function AccountHeader({ email }: { email: string | null }) {
  const initial = email?.trim().charAt(0).toUpperCase() ?? "";

  return (
    <div className="flex items-center gap-3">
      {initial && (
        <div
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center bg-primary"
        >
          <span className="text-heading leading-none font-extrabold text-primary-foreground">
            {initial}
          </span>
        </div>
      )}
      {email && (
        <p className="min-w-0 text-body wrap-anywhere text-muted">{email}</p>
      )}
    </div>
  );
}
