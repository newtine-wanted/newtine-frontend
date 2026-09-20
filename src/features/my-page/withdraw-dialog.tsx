import { useRef } from "react";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface WithdrawDialogProps {
  /** 다른 계정 작업이 진행 중이라 탈퇴를 시작할 수 없는 상태 */
  disabled: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onOpen: () => void;
}

export function WithdrawDialog({
  disabled,
  errorMessage,
  isSubmitting,
  onConfirm,
  onOpen,
}: WithdrawDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    onOpen();
    dialogRef.current?.showModal();
    // 초기 포커스를 버튼 순서와 무관하게 취소에 둔다.
    cancelRef.current?.focus();
  }

  function closeDialog() {
    if (isSubmitting) return;
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={openDialog}
        className={`mt-3.5 flex h-[54px] min-w-11 items-center justify-center self-center px-4 text-label text-muted underline underline-offset-2 disabled:opacity-40 ${focusClasses}`}
      >
        회원탈퇴
      </button>

      <dialog
        ref={dialogRef}
        aria-busy={isSubmitting}
        aria-labelledby="withdraw-dialog-title"
        onCancel={(event) => {
          // 요청 중에는 Esc로 닫지 못하게 막는다.
          if (isSubmitting) event.preventDefault();
        }}
        onClick={(event) => {
          // 패딩을 안쪽 div에 둬 상자 안에서 누르고 뗀 클릭이 스크림 클릭으로 잡히지 않게 한다.
          if (event.target === dialogRef.current) closeDialog();
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
            탈퇴하면 관심 표시한 카드와 스와이프 기록이 즉시 삭제되며 복구할 수
            없습니다.
          </p>
          {errorMessage && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-label text-danger"
            >
              {errorMessage}
            </p>
          )}
          <div className="flex gap-2.5">
            <button
              ref={cancelRef}
              type="button"
              disabled={isSubmitting}
              onClick={closeDialog}
              className={`h-[54px] flex-1 bg-surface-muted text-body text-foreground disabled:opacity-40 ${focusClasses}`}
            >
              취소
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className={`h-[54px] flex-1 bg-primary text-body text-primary-foreground disabled:opacity-40 ${focusClasses}`}
            >
              {isSubmitting ? "탈퇴 중" : "탈퇴"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
