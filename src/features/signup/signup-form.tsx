"use client";

import Link from "next/link";
import { Button, TextField } from "@/components/ui";
import { GuestBrowseLink } from "@/domain/auth";
import { useSignup } from "./use-signup";

export function SignupForm() {
  const {
    clearFieldErrors,
    fieldErrors,
    formError,
    handleSubmit,
    isSubmitting,
  } = useSignup();

  return (
    <form
      aria-label="회원가입"
      aria-busy={isSubmitting}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[22px]"
    >
      <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
        <legend className="sr-only">회원가입 정보</legend>
        <TextField
          error={fieldErrors.email}
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="name@example.com"
          onChange={() => clearFieldErrors("email")}
        />
        <TextField
          error={fieldErrors.password}
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          placeholder="12자 이상 입력해 주세요"
          onChange={() => clearFieldErrors("password", "passwordConfirmation")}
        />
        <TextField
          error={fieldErrors.passwordConfirmation}
          label="비밀번호 확인"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          placeholder="비밀번호를 다시 입력해 주세요"
          onChange={() => clearFieldErrors("passwordConfirmation")}
        />
      </fieldset>

      <div className="flex flex-col gap-3">
        {formError && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-center text-label text-danger"
          >
            {formError}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold"
        >
          {isSubmitting ? "가입 중" : "회원가입"}
        </Button>
        <GuestBrowseLink />
        <p className="flex min-h-5 items-center justify-center gap-2 text-caption leading-5">
          <span className="text-muted">이미 계정이 있나요?</span>
          <Link
            href="/login/email"
            className="font-bold text-foreground underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
