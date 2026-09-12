"use client";

import { AppBar, Button } from "@/components/ui";

export default function Home() {
  return (
    <div>
      <AppBar showBack title="홈" action={<button>액션</button>} />
      <Button variant="primary" onClick={() => alert("버튼")}>
        버튼
      </Button>
    </div>
  );
}
