"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOnboardingAgeGroups } from "./api";
import type { AsyncRequestStatus, OnboardingAgeGroup } from "./types";

export function useOnboardingAgeGroups(enabled: boolean) {
  const requestRef = useRef<AbortController>(null);
  const [ageGroups, setAgeGroups] = useState<OnboardingAgeGroup[]>([]);
  const [requestStatus, setRequestStatus] =
    useState<AsyncRequestStatus>("loading");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const requestAgeGroups = useCallback(async () => {
    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      return await getOnboardingAgeGroups(controller.signal);
    } catch (error) {
      if (controller.signal.aborted) {
        return null;
      }

      throw error;
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
      }
    }
  }, []);

  const receiveAgeGroups = useCallback(
    (nextAgeGroups: OnboardingAgeGroup[] | null) => {
      if (!nextAgeGroups) {
        return;
      }

      const availableCodes = new Set(
        nextAgeGroups.map((ageGroup) => ageGroup.code),
      );

      setAgeGroups(nextAgeGroups);
      setSelectedCode((current) =>
        current && availableCodes.has(current) ? current : null,
      );
      setRequestStatus("success");
    },
    [],
  );

  const rejectAgeGroups = useCallback(() => {
    setRequestStatus("error");
  }, []);

  useEffect(() => {
    if (!enabled) {
      requestRef.current?.abort();
      return;
    }

    void requestAgeGroups().then(receiveAgeGroups, rejectAgeGroups);

    return () => requestRef.current?.abort();
  }, [enabled, receiveAgeGroups, rejectAgeGroups, requestAgeGroups]);

  function retry() {
    setRequestStatus("loading");
    void requestAgeGroups().then(receiveAgeGroups, rejectAgeGroups);
  }

  function toggle(code: string) {
    setSelectedCode((current) => (current === code ? null : code));
  }

  return {
    ageGroups,
    requestStatus,
    retry,
    selectedCode,
    toggle,
  };
}
