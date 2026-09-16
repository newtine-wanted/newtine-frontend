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
  const cancelRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
    // 초기 포커스를 버튼 순서와 무관하게 취소에 둔다.
    cancelRef.current?.focus();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`mt-3.5 flex min-h-11 min-w-11 items-center justify-center self-center px-4 text-label text-muted underline underline-offset-2 ${focusClasses}`}
      >
        회원탈퇴
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="withdraw-dialog-title"
        onClick={(event) => {
          // 패딩을 안쪽 div에 둬 상자 안에서 누르고 뗀 클릭이 스크림 클릭으로 잡히지 않게 한다.
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[318px] bg-background text-left backdrop:bg-scrim"
      >
        <div className="flex flex-col gap-4 p-6">
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
              ref={cancelRef}
              type="button"
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
