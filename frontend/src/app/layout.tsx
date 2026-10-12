import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonaure.com"),
  title: {
    default: "Maison·Aure — Seasonal Fine Dining",
    template: "%s — Maison·Aure",
  },
  description:
    "A seasonal kitchen rooted in craft and warmth. Reserve a table at Maison·Aure in New York, California, and Miami.",
  authors: [{ name: "Maison·Aure" }],
  openGraph: {
    title: "Maison·Aure — Seasonal Fine Dining",
    description: "Modern editorial dining — seasonal menus, warm rooms, quiet luxury.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${jakarta.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}
