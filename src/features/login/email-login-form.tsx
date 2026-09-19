"use client";

import Link from "next/link";
import { Button, TextField } from "@/components/ui";
import { GuestBrowseLink } from "@/domain/auth";
import { useEmailLogin } from "./use-email-login";

export function EmailLoginForm() {
  const {
    clearFieldError,
    fieldErrors,
    formError,
    handleSubmit,
    isSubmitting,
  } = useEmailLogin();

  return (
    <form
      aria-label="이메일 로그인"
      aria-busy={isSubmitting}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[22px]"
    >
      <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
        <legend className="sr-only">로그인 정보</legend>
        <TextField
          error={fieldErrors.email}
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="name@example.com"
          onChange={() => clearFieldError("email")}
        />
        <TextField
          error={fieldErrors.password}
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={12}
          maxLength={128}
          placeholder="12자 이상 입력해 주세요"
          onChange={() => clearFieldError("password")}
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
          className="h-[54px] w-full"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
        <p className="flex min-h-5 items-center justify-center gap-2 text-caption leading-5">
          <span className="text-muted">아직 계정이 없나요?</span>
          <Link
            href="/signup"
            className="font-bold text-foreground underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            회원가입
          </Link>
        </p>
        <GuestBrowseLink />
      </div>
    </form>
  );
}
