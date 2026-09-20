import type { Metadata } from "next";
import { OnboardingScreen } from "@/features/onboarding";

export const metadata: Metadata = { title: "관심 설정" };

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
