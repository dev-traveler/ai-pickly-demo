import type { Metadata } from "next";
import type { Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { Providers } from "./Providers";

const pretendard = localFont({
  src: "PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "AI Pickly",
  description: "당신의 문제를 해결할 AI 활용법 찾기",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "white" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.className} antialiased min-h-[calc(100vh+20px)] data-scroll-locked:overflow-visible!`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
