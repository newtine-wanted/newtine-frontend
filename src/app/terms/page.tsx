import { redirect } from "next/navigation";

export default function TermsPage() {
  const url = process.env.NOTION_TERMS_EMBED_URL;

  if (!url) {
    throw new Error("NOTION_TERMS_EMBED_URL 환경 변수를 설정해 주세요.");
  }

  redirect(url);
}
