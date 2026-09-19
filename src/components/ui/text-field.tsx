"use client";

import { useId, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

export interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size"
> {
  label: string;
  error?: string;
}

export function TextField({
  id,
  label,
  error,
  type = "text",
  className,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isPassword = type === "password";

  const inputClasses = [
    "h-[52px] w-full border border-border bg-background px-4 text-button leading-6 text-foreground placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    isPassword && "pr-12",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-caption leading-5 font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={isPassword && isPasswordVisible ? "text" : type}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={error ? errorId : props["aria-describedby"]}
          className={inputClasses}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={
              isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 표시하기"
            }
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center text-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
            >
              <path
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
