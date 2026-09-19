"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  getMyOnboarding,
  getProblemDetails,
  loginWithEmail,
  setAuthSession,
} from "@/domain/auth";
import {
  validateLoginCredentials,
  type LoginFieldErrors,
} from "./login-validation";

function getLoginErrorMessage(error: unknown) {
  const problem = getProblemDetails(error);

  switch (problem?.status) {
    case 400:
      return "입력 내용을 다시 확인해 주세요.";
    case 401:
      return "이메일 또는 비밀번호를 확인해 주세요.";
    case 429:
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

function getOnboardingErrorMessage(error: unknown) {
  const problem = getProblemDetails(error);

  if (problem?.status === 401) {
    return "로그인 세션을 확인할 수 없습니다. 다시 로그인해 주세요.";
  }

  return "로그인은 완료됐지만 사용자 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function useEmailLogin() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: keyof LoginFieldErrors) {
    setFormError(null);
    setFieldErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors = validateLoginCredentials(email, password);

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    let isAuthenticated = false;

    try {
      const session = await loginWithEmail({ email, password });
      setAuthSession(session);
      isAuthenticated = true;

      const onboarding = await getMyOnboarding();
      router.replace(onboarding.status === "PENDING" ? "/onboarding" : "/");
    } catch (error) {
      setFormError(
        isAuthenticated
          ? getOnboardingErrorMessage(error)
          : getLoginErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    clearFieldError,
    fieldErrors,
    formError,
    handleSubmit,
    isSubmitting,
  };
}
