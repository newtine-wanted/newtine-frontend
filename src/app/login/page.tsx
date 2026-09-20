import type { Metadata } from "next";
import { LoginStartScreen } from "@/features/login";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage(props: PageProps<"/login">) {
  const { reason } = await props.searchParams;

  return <LoginStartScreen showWithdrawNotice={reason === "withdrawn"} />;
}
