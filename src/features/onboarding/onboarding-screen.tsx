"use client";

import { EntityStep } from "./entity-step";
import { RegionStep } from "./region-step";
import { TopicStep } from "./topic-step";
import { useOnboarding } from "./use-onboarding";

export function OnboardingScreen() {
  const {
    backToLogin,
    categories,
    categoryStatus,
    entityIds,
    finish,
    goTo,
    headingRef,
    nationwideOnly,
    regions,
    retryCategories,
    step,
    toggleEntity,
    toggleNationwideOnly,
    toggleRegion,
    toggleTopic,
    topicCodes,
  } = useOnboarding();

  switch (step) {
    case "topics":
      return (
        <TopicStep
          ref={headingRef}
          categories={categories}
          requestStatus={categoryStatus}
          selectedCodes={topicCodes}
          onToggle={toggleTopic}
          onBack={backToLogin}
          onSkip={finish}
          onNext={() => goTo("entities")}
          onRetry={retryCategories}
        />
      );
    case "entities":
      return (
        <EntityStep
          ref={headingRef}
          selectedIds={entityIds}
          onToggle={toggleEntity}
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
          onToggleRegion={toggleRegion}
          onToggleNationwideOnly={toggleNationwideOnly}
          onBack={() => goTo("entities")}
          onSkip={finish}
          onComplete={finish}
        />
      );
  }
}
