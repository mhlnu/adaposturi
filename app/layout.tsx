import type { Metadata, Viewport } from "next";
import { Karla, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const karla = Karla({
    subsets: ["latin", "latin-ext"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    variable: "--font-karla",
});

export const metadata: Metadata = {
    title: "Adăposturi protecție civilă",
    description: "Harta adăposturilor de urgență - București și județe",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ro" className={cn("bg-(--background)", "font-sans", inter.variable)}>
            <body className={`${karla.variable} font-sans antialiased`}>{children}</body>
        </html>
    );
}
