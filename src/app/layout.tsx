import type { Metadata } from "next";
import { Nunito, Sora, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/page-transition";
import { RouteProgress } from "@/components/route-progress";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Ejercicios de Masticación y Deglución | Dra. Sandra Ardila",
  description:
    "Registro y seguimiento del ejercicio de masticación y deglución prescrito por la Dra. Sandra Ardila, fonoaudióloga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${sora.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RouteProgress />
        <PageTransition>{children}</PageTransition>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
