import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/page-transition";
import { RouteProgress } from "@/components/route-progress";
import { DepthFieldRoot } from "@/components/three/depth-field-root";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DepthFieldRoot />
        <RouteProgress />
        <PageTransition>{children}</PageTransition>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
