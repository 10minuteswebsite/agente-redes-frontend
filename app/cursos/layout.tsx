import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const serif = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Biblioteca de cursos · Yoly Ripepi",
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${serif.variable} yr-theme min-h-screen bg-[var(--yr-cream)] font-[family-name:var(--font-serif)] text-[var(--yr-brown)]`}
    >
      {children}
    </div>
  );
}
