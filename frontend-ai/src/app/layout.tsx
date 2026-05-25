import type { Metadata } from "next";
import { Fraunces, Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/layout/FloatingNav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VortixPR — PR & distribution for AI startups & emerging tech",
  description:
    "Building is easy now. Distribution isn't. VortixPR helps AI founders, vibecoding studios, and frontier teams get seen across global and Asia media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${onest.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
