"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOnboardingCategories } from "./api";
import type { AsyncRequestStatus, OnboardingCategory } from "./types";

export function useOnboardingTopics() {
  const requestRef = useRef<AbortController>(null);
  const [categories, setCategories] = useState<OnboardingCategory[]>([]);
  const [requestStatus, setRequestStatus] =
    useState<AsyncRequestStatus>("loading");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const requestCategories = useCallback(async () => {
    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      return await getOnboardingCategories(controller.signal);
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

  const receiveCategories = useCallback(
    (nextCategories: OnboardingCategory[] | null) => {
      if (!nextCategories) {
        return;
      }

      const availableCodes = new Set(
        nextCategories.map((category) => category.code),
      );

      setCategories(nextCategories);
      setSelectedCodes((current) =>
        current.filter((code) => availableCodes.has(code)),
      );
      setRequestStatus("success");
    },
    [],
  );

  const rejectCategories = useCallback(() => {
    setRequestStatus("error");
  }, []);

  useEffect(() => {
    void requestCategories().then(receiveCategories, rejectCategories);

    return () => requestRef.current?.abort();
  }, [receiveCategories, rejectCategories, requestCategories]);

  function retry() {
    setRequestStatus("loading");
    void requestCategories().then(receiveCategories, rejectCategories);
  }

  function toggle(code: string) {
    setSelectedCodes((current) =>
      current.includes(code)
        ? current.filter((selectedCode) => selectedCode !== code)
        : [...current, code],
    );
  }

  return {
    categories,
    requestStatus,
    retry,
    selectedCodes,
    toggle,
  };
}
