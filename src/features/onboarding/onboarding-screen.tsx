"use client";

import { AgeStep } from "./age-step";
import { EntityStep } from "./entity-step";
import { RegionStep } from "./region-step";
import { TopicStep } from "./topic-step";
import { useOnboarding } from "./use-onboarding";

export function OnboardingScreen() {
  const {
    ageGroupCode,
    ageGroupOptions,
    ageGroupRequestStatus,
    backToLogin,
    categories,
    categoryStatus,
    entities,
    entityQuery,
    entityRequestStatus,
    entityTypeFilter,
    complete,
    completionError,
    goTo,
    headingRef,
    isCompleting,
    isSkipping,
    nationwideOnly,
    regionCodes,
    regionOptions,
    regionRequestStatus,
    retryAgeGroups,
    retryCategories,
    retryEntities,
    retryRegions,
    selectedEntityIds,
    setEntityQuery,
    setEntityTypeFilter,
    skip,
    skipError,
    step,
    toggleAgeGroup,
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
          isSkipping={isSkipping}
          skipError={skipError}
          onToggle={toggleTopic}
          onBack={backToLogin}
          onSkip={skip}
          onNext={() => goTo("entities")}
          onRetry={retryCategories}
        />
      );
    case "entities":
      return (
        <EntityStep
          ref={headingRef}
          entities={entities}
          query={entityQuery}
          requestStatus={entityRequestStatus}
          selectedIds={selectedEntityIds}
          typeFilter={entityTypeFilter}
          isSkipping={isSkipping}
          skipError={skipError}
          onQueryChange={setEntityQuery}
          onRetry={retryEntities}
          onTypeFilterChange={setEntityTypeFilter}
          onToggle={toggleEntity}
          onBack={() => goTo("topics")}
          onSkip={skip}
          onNext={() => goTo("regions")}
        />
      );
    case "regions":
      return (
        <RegionStep
          ref={headingRef}
          regions={regionOptions}
          requestStatus={regionRequestStatus}
          selectedCodes={regionCodes}
          nationwideOnly={nationwideOnly}
          isSkipping={isSkipping}
          skipError={skipError}
          onToggleRegion={toggleRegion}
          onToggleNationwideOnly={toggleNationwideOnly}
          onRetry={retryRegions}
          onBack={() => goTo("entities")}
          onSkip={skip}
          onNext={() => goTo("age")}
        />
      );
    case "age":
      return (
        <AgeStep
          ref={headingRef}
          ageGroups={ageGroupOptions}
          requestStatus={ageGroupRequestStatus}
          selectedCode={ageGroupCode}
          isCompleting={isCompleting}
          isSkipping={isSkipping}
          actionError={completionError ?? skipError}
          onToggle={toggleAgeGroup}
          onRetry={retryAgeGroups}
          onBack={() => goTo("regions")}
          onSkip={skip}
          onComplete={complete}
        />
      );
  }
}
