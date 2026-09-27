import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const newsreaderSerif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "AMARTA Sanctuary & Private Villas - Sayan, Ubud, Bali",
  description: "An architectural slow-living sanctuary anchored along the sacred Ayung River valley in Sayan, Ubud. Private pool villas, volcanic stone architecture, and curated archipelagic gastronomy.",
  keywords: [
    "luxury villa ubud",
    "private pool villa sayan",
    "boutique resort ubud",
    "amarta villas bali",
    "ayung river sanctuary",
    "slow living resort bali",
    "architectural villa ubud",
    "private butler villa bali",
  ],
  authors: [{ name: "AMARTA Sanctuary & Private Villas" }],
  creator: "AMARTA Estate",
  publisher: "AMARTA Sanctuary Bali",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "AMARTA Sanctuary & Private Villas - Sayan, Ubud",
    description: "Archipelagic Tropical Modernism & Slow Living Sanctuary along the Ayung River valley.",
    url: "https://amartavillas.com",
    siteName: "AMARTA Sanctuary & Private Villas",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMARTA Sanctuary & Private Villas - Ubud",
    description: "Private pool villas and botanical sanctuary in Sayan, Ubud, Bali.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${jakartaSans.variable} ${newsreaderSerif.variable}`}>
      <body className="font-sans bg-[#F7F4EE] text-[#151412] antialiased selection:bg-[#A2583E] selection:text-white">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
