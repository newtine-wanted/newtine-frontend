import type { Metadata } from "next";
import { LoginStart } from "@/features/login";

export const metadata: Metadata = { title: "로그인" };

export default function LoginRoute() {
  return <LoginStart />;
}
