import { AuthScreenLayout } from "@/domain/auth";
import { SignupForm } from "./signup-form";

export function SignupScreen() {
  return (
    <AuthScreenLayout
      title="처음 만나서 반가워요"
      description="이메일과 비밀번호로 계정을 만들어 주세요."
    >
      <SignupForm />
    </AuthScreenLayout>
  );
}
