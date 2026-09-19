"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Region } from "./regions";
import type { OnboardingStep } from "./types";
import { useOnboardingTopics } from "./use-onboarding-topics";

function toggle<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function useOnboarding() {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<OnboardingStep>("topics");
  const [entityIds, setEntityIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [nationwideOnly, setNationwideOnly] = useState(false);
  const topics = useOnboardingTopics();

  function goTo(next: OnboardingStep) {
    // 새 단계의 제목이 DOM에 붙은 뒤에 포커스를 옮겨야 해서 동기로 반영한다.
    flushSync(() => setStep(next));
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  // 온보딩이 방문 기록에 남지 않도록 현재 기록을 교체한다.
  function finish() {
    router.replace("/");
  }

  // ‹는 설문 이전 단계가 아니라 로그인 화면으로 돌아간다.
  function backToLogin() {
    router.replace("/login");
  }

  function toggleEntity(id: string) {
    setEntityIds((current) => toggle(current, id));
  }

  function toggleRegion(region: Region) {
    setRegions((current) => toggle(current, region));
  }

  function toggleNationwideOnly() {
    setNationwideOnly((current) => !current);
    setRegions([]);
  }

  return {
    backToLogin,
    categories: topics.categories,
    categoryStatus: topics.requestStatus,
    entityIds,
    finish,
    goTo,
    headingRef,
    nationwideOnly,
    regions,
    retryCategories: topics.retry,
    step,
    toggleEntity,
    toggleNationwideOnly,
    toggleRegion,
    toggleTopic: topics.toggle,
    topicCodes: topics.selectedCodes,
  };
}
