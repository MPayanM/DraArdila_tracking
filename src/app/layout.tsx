import type { Metadata } from "next";
import { Nunito, Poppins, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
  icons: {
    icon: "/fono.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${poppins.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
