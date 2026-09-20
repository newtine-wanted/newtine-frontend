import { RequireAuth } from "@/features/auth-session";

export default function MyPageLayout({ children }: LayoutProps<"/my-page">) {
  return <RequireAuth>{children}</RequireAuth>;
}
