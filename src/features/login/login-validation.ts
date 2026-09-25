import { PASSWORD_MIN_LENGTH } from "@/domain/auth";

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function validateLoginCredentials(
  email: string,
  password: string,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!email) {
    errors.email = "이메일을 입력해 주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "올바른 이메일 형식으로 입력해 주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해 주세요.";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`;
  }

  return errors;
}
