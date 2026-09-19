import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding";

export const metadata: Metadata = { title: "관심 설정" };

export default function OnboardingRoute() {
  return <OnboardingFlow />;
}
