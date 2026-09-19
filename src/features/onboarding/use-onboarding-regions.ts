"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOnboardingRegions } from "./api";
import type { AsyncRequestStatus, OnboardingRegion } from "./types";

export function useOnboardingRegions(enabled: boolean) {
  const requestRef = useRef<AbortController>(null);
  const [regions, setRegions] = useState<OnboardingRegion[]>([]);
  const [requestStatus, setRequestStatus] =
    useState<AsyncRequestStatus>("loading");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [nationwideOnly, setNationwideOnly] = useState(false);

  const requestRegions = useCallback(async () => {
    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      return await getOnboardingRegions(controller.signal);
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

  const receiveRegions = useCallback(
    (nextRegions: OnboardingRegion[] | null) => {
      if (!nextRegions) {
        return;
      }

      const availableCodes = new Set(nextRegions.map((region) => region.code));

      setRegions(nextRegions);
      setSelectedCodes((current) =>
        current.filter((code) => availableCodes.has(code)),
      );
      setRequestStatus("success");
    },
    [],
  );

  const rejectRegions = useCallback(() => {
    setRequestStatus("error");
  }, []);

  useEffect(() => {
    if (!enabled) {
      requestRef.current?.abort();
      return;
    }

    void requestRegions().then(receiveRegions, rejectRegions);

    return () => requestRef.current?.abort();
  }, [enabled, receiveRegions, rejectRegions, requestRegions]);

  function retry() {
    setRequestStatus("loading");
    void requestRegions().then(receiveRegions, rejectRegions);
  }

  function toggleRegion(code: string) {
    setSelectedCodes((current) =>
      current.includes(code)
        ? current.filter((selectedCode) => selectedCode !== code)
        : [...current, code],
    );
  }

  function toggleNationwideOnly() {
    setNationwideOnly((current) => !current);
    setSelectedCodes([]);
  }

  return {
    nationwideOnly,
    regions,
    requestStatus,
    retry,
    selectedCodes,
    toggleNationwideOnly,
    toggleRegion,
  };
}
