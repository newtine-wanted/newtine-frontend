import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
  title: "Newtine",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body
        className={`${neoHyundai.className} bg-background text-foreground antialiased`}
      >
        <div className="relative isolate flex min-h-dvh w-full flex-col bg-background pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
          <main
            id="main-content"
            className="mx-auto w-full max-w-[480px] min-w-0 flex-1"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
