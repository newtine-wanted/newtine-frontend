"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProblemDetails, logout, withdraw } from "@/domain/auth";

function getWithdrawErrorMessage(error: unknown) {
  const problem = getProblemDetails(error);

  switch (problem?.status) {
    case 429:
      return "탈퇴 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case 503:
      return "지금은 탈퇴를 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export function useAccountActions() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      router.replace("/login");
    } catch {
      setLogoutError(
        "로그아웃 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleWithdraw() {
    if (isWithdrawing) {
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError(null);

    try {
      await withdraw();
      router.replace("/login?reason=withdrawn");
    } catch (error) {
      setWithdrawError(getWithdrawErrorMessage(error));
    } finally {
      setIsWithdrawing(false);
    }
  }

  function clearWithdrawError() {
    setWithdrawError(null);
  }

  return {
    clearWithdrawError,
    handleLogout,
    handleWithdraw,
    isLoggingOut,
    isWithdrawing,
    logoutError,
    withdrawError,
  };
}
