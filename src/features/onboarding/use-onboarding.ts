"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { completeOnboarding, skipOnboarding } from "./api";
import type { OnboardingStep } from "./types";
import { useOnboardingAgeGroups } from "./use-onboarding-age-groups";
import { useOnboardingEntities } from "./use-onboarding-entities";
import { useOnboardingRegions } from "./use-onboarding-regions";
import { useOnboardingTopics } from "./use-onboarding-topics";

export function useOnboarding() {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<OnboardingStep>("topics");
  const [isSkipping, setIsSkipping] = useState(false);
  const [skipError, setSkipError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const ageGroups = useOnboardingAgeGroups(step === "age");
  const entities = useOnboardingEntities(step === "entities");
  const regions = useOnboardingRegions(step === "regions");
  const topics = useOnboardingTopics();

  function goTo(next: OnboardingStep) {
    setSkipError(null);
    setCompletionError(null);
    // 새 단계의 제목이 DOM에 붙은 뒤에 포커스를 옮겨야 해서 동기로 반영한다.
    flushSync(() => setStep(next));
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  // ‹는 설문 이전 단계가 아니라 로그인 화면으로 돌아간다.
  function backToLogin() {
    router.replace("/login");
  }

  async function skip() {
    if (isSkipping || isCompleting) {
      return;
    }

    setIsSkipping(true);
    setSkipError(null);
    setCompletionError(null);

    try {
      await skipOnboarding();
      router.replace("/");
    } catch {
      setSkipError("온보딩을 건너뛰지 못했어요. 다시 시도해 주세요.");
      setIsSkipping(false);
    }
  }

  async function complete() {
    if (isCompleting || isSkipping) {
      return;
    }

    setIsCompleting(true);
    setCompletionError(null);
    setSkipError(null);

    try {
      await completeOnboarding({
        topicCodes: topics.selectedCodes,
        entityIds: entities.selectedIds,
        ageGroup: ageGroups.selectedCode,
        regionCodes: regions.selectedCodes,
      });
      // 완료한 온보딩이 방문 기록에 남지 않도록 현재 기록을 교체한다.
      router.replace("/");
    } catch {
      setCompletionError(
        "관심 설정을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      setIsCompleting(false);
    }
  }

  return {
    ageGroupOptions: ageGroups.ageGroups,
    ageGroupRequestStatus: ageGroups.requestStatus,
    ageGroupCode: ageGroups.selectedCode,
    backToLogin,
    categories: topics.categories,
    categoryStatus: topics.requestStatus,
    entities: entities.entities,
    entityQuery: entities.query,
    entityRequestStatus: entities.requestStatus,
    entityTypeFilter: entities.typeFilter,
    complete,
    completionError,
    goTo,
    headingRef,
    isSkipping,
    isCompleting,
    nationwideOnly: regions.nationwideOnly,
    regionOptions: regions.regions,
    regionRequestStatus: regions.requestStatus,
    regionCodes: regions.selectedCodes,
    retryCategories: topics.retry,
    retryEntities: entities.retry,
    retryRegions: regions.retry,
    retryAgeGroups: ageGroups.retry,
    selectedEntityIds: entities.selectedIds,
    setEntityQuery: entities.changeQuery,
    setEntityTypeFilter: entities.changeTypeFilter,
    skip,
    skipError,
    step,
    toggleEntity: entities.toggle,
    toggleAgeGroup: ageGroups.toggle,
    toggleNationwideOnly: regions.toggleNationwideOnly,
    toggleRegion: regions.toggleRegion,
    toggleTopic: topics.toggle,
    topicCodes: topics.selectedCodes,
  };
}
