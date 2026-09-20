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
  // 로그아웃과 탈퇴는 동시에 진행할 수 없다.
  const isBusy = isLoggingOut || isWithdrawing;

  async function handleLogout() {
    if (isBusy) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
    } catch {
      setLogoutError(
        "로그아웃 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setIsLoggingOut(false);
      return;
    }

    // router.replace는 이동 완료를 기다리지 않는다. 가드를 유지해 재실행을 막는다.
    router.replace("/login");
  }

  async function handleWithdraw() {
    if (isBusy) {
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError(null);

    try {
      await withdraw();
    } catch (error) {
      setWithdrawError(getWithdrawErrorMessage(error));
      setIsWithdrawing(false);
      return;
    }

    // 가드를 유지한 채 이동한다. 모달은 라우트와 함께 언마운트된다.
    router.replace("/login?reason=withdrawn");
  }

  function clearWithdrawError() {
    setWithdrawError(null);
  }

  return {
    clearWithdrawError,
    handleLogout,
    handleWithdraw,
    isBusy,
    isLoggingOut,
    isWithdrawing,
    logoutError,
    withdrawError,
  };
}
