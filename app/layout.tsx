import type { Metadata, Viewport } from "next";
import { Karla } from "next/font/google";
import "./globals.css";

const karla = Karla({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-karla",
});

export const metadata: Metadata = {
  title: "Adăposturi București",
  description: "Harta adăposturilor de urgență din București",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className="bg-(--background)">
      <body className={`${karla.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
