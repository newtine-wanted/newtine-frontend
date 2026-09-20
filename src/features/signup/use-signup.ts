"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  getProblemDetails,
  setAuthSession,
  signupWithEmail,
} from "@/domain/auth";
import {
  validateSignupCredentials,
  type SignupFieldErrors,
} from "./signup-validation";

function getSignupErrorMessage(error: unknown) {
  const problem = getProblemDetails(error);

  switch (problem?.status) {
    case 400:
      return "입력 내용을 다시 확인해 주세요.";
    case 409:
      return "이미 가입된 이메일입니다.";
    case 429:
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export function useSignup() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldErrors(...fields: Array<keyof SignupFieldErrors>) {
    setFormError(null);
    setFieldErrors((current) => {
      if (!fields.some((field) => current[field])) {
        return current;
      }

      const next = { ...current };

      for (const field of fields) {
        next[field] = undefined;
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") ?? "",
    );
    const errors = validateSignupCredentials(
      email,
      password,
      passwordConfirmation,
    );

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await signupWithEmail({ email, password });
      setAuthSession(session);
      router.replace("/onboarding");
    } catch (error) {
      setFormError(getSignupErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    clearFieldErrors,
    fieldErrors,
    formError,
    handleSubmit,
    isSubmitting,
  };
}
