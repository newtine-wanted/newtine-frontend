import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-semi-condensed/latin-600.css";
import "@fontsource/barlow-semi-condensed/latin-700.css";
import "@fontsource/barlow-semi-condensed/latin-800.css";
import "@fontsource/barlow-semi-condensed/latin-900.css";
import "@fontsource/gothic-a1/korean-800.css";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

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
      <body className="bg-background font-['Noto_Sans_KR_Variable','Noto_Sans_KR',system-ui,sans-serif] text-foreground antialiased">
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
