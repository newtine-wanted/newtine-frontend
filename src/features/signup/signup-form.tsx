import Link from "next/link";
import { Button, TextField } from "@/components/ui";
import { GuestBrowseLink } from "@/domain/auth";

export function SignupForm() {
  return (
    <form aria-label="회원가입" className="flex flex-col gap-[22px]">
      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">회원가입 정보</legend>
        <TextField
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="name@example.com"
        />
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          placeholder="12자 이상 입력해 주세요"
        />
        <TextField
          label="비밀번호 확인"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          placeholder="비밀번호를 다시 입력해 주세요"
        />
      </fieldset>

      <div className="flex flex-col gap-3">
        <Button type="button" className="h-[54px] w-full font-bold">
          회원가입
        </Button>
        <p className="flex min-h-5 items-center justify-center gap-2 text-caption leading-5">
          <span className="text-muted">이미 계정이 있나요?</span>
          <Link
            href="/login/email"
            className="font-bold text-foreground underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            로그인
          </Link>
        </p>
        <GuestBrowseLink />
      </div>
    </form>
  );
}
