import type { Metadata } from "next";
import { EmailLoginScreen } from "@/features/login";

export const metadata: Metadata = { title: "이메일 로그인" };

export default function EmailLoginRoute() {
  return <EmailLoginScreen />;
}
