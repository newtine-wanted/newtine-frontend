"use client";

import { useRef } from "react";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function WithdrawDialog({
  likedCount,
  swipeCount,
}: {
  likedCount: number;
  swipeCount: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={`mt-3.5 flex min-h-11 min-w-11 items-center justify-center self-center px-4 text-label text-muted underline underline-offset-2 ${focusClasses}`}
      >
        회원탈퇴
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="withdraw-dialog-title"
        onClick={(event) => {
          // 스크림(다이얼로그 자신의 영역) 클릭으로 닫는다. 내용 클릭은 걸러진다.
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[318px] bg-background p-6 text-left backdrop:bg-scrim"
      >
        <div className="flex flex-col gap-4">
          <h2
            id="withdraw-dialog-title"
            className="text-nav font-bold text-foreground"
          >
            회원탈퇴
          </h2>
          <p className="text-body-sm text-muted">
            탈퇴하면 관심 표시한 카드 {likedCount}건과 스와이프 기록{" "}
            {swipeCount}건이 즉시 삭제되며 복구할 수 없습니다.
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className={`h-12 flex-1 bg-surface-muted text-body text-foreground ${focusClasses}`}
            >
              취소
            </button>
            <button
              type="button"
              className={`h-12 flex-1 bg-primary text-body text-primary-foreground ${focusClasses}`}
            >
              탈퇴
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
