import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AuthSessionProvider } from "@/features/auth-session";
import { PwaInstallPrompt } from "@/features/pwa-install";
import "./globals.css";

const neoHyundai = localFont({
  src: [
    {
      path: "../assets/fonts/NeoHyundai L.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeoHyundai R.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeoHyundai B.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeoHyundai EB.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeoHyundai EBK.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  applicationName: "newtine",
  title: {
    default: "newtine",
    template: "newtine | %s",
  },
  description: "카드로 넘기는 정치 뉴스, 내 관심사대로 가볍게 시작해요.",
  appleWebApp: {
    capable: true,
    title: "newtine",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 54px = sticky 앱 바 52px + 괘선 2px. 포커스 이동 스크롤이 바에 가리지 않게 한다.
    <html
      lang="ko"
      className="scroll-pt-[calc(env(safe-area-inset-top)_+_54px)]"
    >
      <body
        className={`${neoHyundai.className} bg-background text-foreground antialiased`}
      >
        <div className="relative isolate flex min-h-dvh w-full flex-col bg-background pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
          <main
            id="main-content"
            className="mx-auto w-full max-w-[480px] min-w-0 flex-1"
          >
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </main>
          <PwaInstallPrompt />
        </div>
      </body>
    </html>
  );
}
