"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { PolicyArea } from "@/domain/policy-area";
import { EntityStep } from "./entity-step";
import { RegionStep } from "./region-step";
import type { Region } from "./regions";
import { TopicStep } from "./topic-step";
import type { OnboardingStep } from "./types";

function toggle<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function OnboardingScreen() {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<OnboardingStep>("topics");
  const [topics, setTopics] = useState<PolicyArea[]>([]);
  const [entityIds, setEntityIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [nationwideOnly, setNationwideOnly] = useState(false);

  function goTo(next: OnboardingStep) {
    // 새 단계의 제목이 DOM에 붙은 뒤에 포커스를 옮겨야 해서 동기로 반영한다.
    flushSync(() => setStep(next));
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  // 온보딩이 방문 기록에 남지 않도록 현재 기록을 교체한다.
  function finish() {
    router.replace("/feed");
  }

  // 02의 ‹는 설문 이전 단계가 아니라 로그인 화면으로 돌아간다.
  function backToLogin() {
    router.replace("/login");
  }

  function toggleNationwideOnly() {
    setNationwideOnly((current) => !current);
    setRegions([]);
  }

  switch (step) {
    case "topics":
      return (
        <TopicStep
          ref={headingRef}
          selected={topics}
          onToggle={(area) => setTopics((current) => toggle(current, area))}
          onBack={backToLogin}
          onSkip={finish}
          onNext={() => goTo("entities")}
        />
      );
    case "entities":
      return (
        <EntityStep
          ref={headingRef}
          selectedIds={entityIds}
          onToggle={(id) => setEntityIds((current) => toggle(current, id))}
          onBack={() => goTo("topics")}
          onSkip={finish}
          onNext={() => goTo("regions")}
        />
      );
    case "regions":
      return (
        <RegionStep
          ref={headingRef}
          selected={regions}
          nationwideOnly={nationwideOnly}
          onToggleRegion={(region) =>
            setRegions((current) => toggle(current, region))
          }
          onToggleNationwideOnly={toggleNationwideOnly}
          onBack={() => goTo("entities")}
          onSkip={finish}
          onComplete={finish}
        />
      );
  }
}
