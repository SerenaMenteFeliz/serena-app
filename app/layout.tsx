import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tipografia do guarda-chuva: Fraunces (serif acolhedora) nos títulos e
// Manrope como base de UI do app inteiro — os produtos trocam a serif
// (Cormorant no Cálice, Lora no Lar) via `.theme-*`, a UI é uma só.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-app-ui",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Serena Mente Feliz",
    template: "%s · Serena Mente Feliz",
  },
  description:
    "Um lar pra sua mente — meditação com o Lar Interior e reprogramação mental com o Método Cálice, no seu tempo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Serena",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#eff8f6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
