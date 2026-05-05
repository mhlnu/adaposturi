import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="ro" className="bg-[var(--background)]">
      <body className="antialiased">{children}</body>
    </html>
  );
}
