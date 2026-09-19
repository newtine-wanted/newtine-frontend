import type { Metadata } from "next";
import { LoginStartScreen } from "@/features/login";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage() {
  return <LoginStartScreen />;
}
