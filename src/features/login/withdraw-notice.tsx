"use client";

import { useEffect } from "react";

export function WithdrawNotice() {
  // 새로고침이나 공유로 안내가 다시 뜨지 않도록 쿼리를 지운다.
  useEffect(() => {
    window.history.replaceState(null, "", "/login");
  }, []);

  return (
    <p role="status" className="text-center text-label text-muted">
      탈퇴가 완료되었습니다
    </p>
  );
}
