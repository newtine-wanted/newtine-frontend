import type { MetadataRoute } from "next";

const description = "카드로 넘기는 정치 뉴스, 내 관심사대로 가볍게 시작해요.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "newtine",
    short_name: "newtine",
    description,
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["news"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
