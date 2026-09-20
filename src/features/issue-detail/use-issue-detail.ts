"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { getProblemDetails } from "@/domain/auth";
import { authSessionStore } from "@/domain/auth/store";
import { issueDetailApi } from "./api";
import type { IssueDetailApi, IssueDetailResponse } from "./types";

export type IssueDetailStatus = "error" | "loading" | "ready";

interface IssueDetailResult {
  requestKey: string | null;
  issue: IssueDetailResponse | null;
  errorMessage: string | null;
}

function getErrorMessage(error: unknown): string {
  return (
    getProblemDetails(error)?.detail ??
    "이슈 상세를 불러오는 중 문제가 발생했습니다."
  );
}

export function useIssueDetail(
  issueId: string,
  api: IssueDetailApi = issueDetailApi,
) {
  const authStatus = useStore(authSessionStore, (state) => state.status);
  const authRevision = useStore(authSessionStore, (state) => state.revision);
  const requestIdRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<IssueDetailResult>({
    requestKey: null,
    issue: null,
    errorMessage: null,
  });
  const requestKey = `${issueId}:${authRevision}:${retryCount}`;

  useEffect(() => {
    if (authStatus === "initializing") return;

    const requestId = ++requestIdRef.current;

    void api
      .getIssueDetail(issueId)
      .then((issue) => {
        if (requestId !== requestIdRef.current) return;
        setResult({ requestKey, issue, errorMessage: null });
      })
      .catch((error: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setResult({
          requestKey,
          issue: null,
          errorMessage: getErrorMessage(error),
        });
      });

    return () => {
      requestIdRef.current += 1;
    };
  }, [api, authStatus, issueId, requestKey]);

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  let status: IssueDetailStatus = "loading";
  if (result.requestKey === requestKey) {
    status = result.issue ? "ready" : "error";
  }

  return {
    issue: result.requestKey === requestKey ? result.issue : null,
    status,
    errorMessage: result.requestKey === requestKey ? result.errorMessage : null,
    retry,
  };
}
