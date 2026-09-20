import { RequireAuth } from "@/features/auth-session";

export default function ReportLayout({ children }: LayoutProps<"/report">) {
  return <RequireAuth>{children}</RequireAuth>;
}
