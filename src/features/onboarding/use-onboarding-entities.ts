"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPoliticalActors } from "./api";
import type {
  AsyncRequestStatus,
  OnboardingEntity,
  PoliticalActorSearchResponse,
  PoliticalActorType,
  PoliticalActorTypeFilter,
} from "./types";

const SEARCH_DEBOUNCE_MS = 300;

export function useOnboardingEntities(enabled: boolean) {
  const requestRef = useRef<AbortController>(null);
  const [entities, setEntities] = useState<OnboardingEntity[]>([]);
  const [requestStatus, setRequestStatus] =
    useState<AsyncRequestStatus>("loading");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PoliticalActorTypeFilter>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const requestEntities = useCallback(
    async (nextQuery: string, nextType: PoliticalActorType | null) => {
      requestRef.current?.abort();

      const controller = new AbortController();
      requestRef.current = controller;

      try {
        return await getPoliticalActors({
          query: nextQuery,
          type: nextType,
          signal: controller.signal,
        });
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
    },
    [],
  );

  const receiveEntities = useCallback(
    (response: PoliticalActorSearchResponse | null) => {
      if (!response) {
        return;
      }

      setEntities(response.items);
      setRequestStatus("success");
    },
    [],
  );

  const rejectEntities = useCallback(() => {
    setRequestStatus("error");
  }, []);

  useEffect(() => {
    if (!enabled) {
      requestRef.current?.abort();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const actorType = typeFilter === "ALL" ? null : typeFilter;
      void requestEntities(query.trim(), actorType).then(
        receiveEntities,
        rejectEntities,
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      requestRef.current?.abort();
    };
  }, [
    enabled,
    query,
    receiveEntities,
    rejectEntities,
    requestEntities,
    typeFilter,
  ]);

  function changeQuery(value: string) {
    setQuery(value);
    setRequestStatus("loading");
  }

  function changeTypeFilter(value: PoliticalActorTypeFilter) {
    setTypeFilter(value);
    setRequestStatus("loading");
  }

  function retry() {
    const actorType = typeFilter === "ALL" ? null : typeFilter;
    setRequestStatus("loading");
    void requestEntities(query.trim(), actorType).then(
      receiveEntities,
      rejectEntities,
    );
  }

  function toggle(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  return {
    changeQuery,
    changeTypeFilter,
    entities,
    query,
    requestStatus,
    retry,
    selectedIds,
    toggle,
    typeFilter,
  };
}
