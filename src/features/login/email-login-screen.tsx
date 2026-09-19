import { AuthScreenLayout } from "@/domain/auth";
import { EmailLoginForm } from "./email-login-form";

export function EmailLoginScreen() {
  return (
    <AuthScreenLayout
      title="다시 만나서 반가워요"
      description="가입한 이메일과 비밀번호를 입력해 주세요."
    >
      <EmailLoginForm />
    </AuthScreenLayout>
  );
}
