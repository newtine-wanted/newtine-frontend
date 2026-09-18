import type { Metadata } from "next";
import { StartStep } from "@/features/onboarding";

export const metadata: Metadata = { title: "시작하기" };

export default function LoginRoute() {
  return <StartStep />;
}
