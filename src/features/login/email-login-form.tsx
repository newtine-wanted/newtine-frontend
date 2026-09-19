import Link from "next/link";
import { Button, TextField } from "@/components/ui";
import { GuestBrowseLink } from "@/domain/auth";

export function EmailLoginForm() {
  return (
    <form aria-label="이메일 로그인" className="flex flex-col gap-[22px]">
      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">로그인 정보</legend>
        <TextField
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
        />
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="12자 이상 입력해 주세요"
        />
      </fieldset>

      <div className="flex flex-col gap-3">
        <Button className="h-[54px] w-full">로그인</Button>
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
