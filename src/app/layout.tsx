import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Newtine",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body className="bg-zinc-100 font-sans text-zinc-950 antialiased">
        <div className="relative isolate mx-auto flex min-h-dvh w-full max-w-app flex-col bg-white pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
          <main id="main-content" className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
