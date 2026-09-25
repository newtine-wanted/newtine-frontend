import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/domain/auth";

export interface SignupFieldErrors {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export function validateSignupCredentials(
  email: string,
  password: string,
  passwordConfirmation: string,
): SignupFieldErrors {
  const errors: SignupFieldErrors = {};

  if (!email) {
    errors.email = "이메일을 입력해 주세요.";
  } else if (email.length > 254) {
    errors.email = "이메일은 254자 이하로 입력해 주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "올바른 이메일 형식으로 입력해 주세요.";
  }

  if (!password) {
    errors.password = "비밀번호를 입력해 주세요.";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`;
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `비밀번호는 ${PASSWORD_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = "비밀번호를 다시 입력해 주세요.";
  } else if (password !== passwordConfirmation) {
    errors.passwordConfirmation = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
}
