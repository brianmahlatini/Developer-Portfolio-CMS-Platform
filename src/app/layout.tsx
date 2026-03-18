import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Developer Portfolio CMS Platform",
  description:
    "Content-driven portfolio platform with a blog CMS, projects, analytics, and role-based editing.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Developer Portfolio CMS Platform",
    description:
      "Content-driven portfolio platform with a blog CMS, projects, analytics, and role-based editing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <AnalyticsTracker />
        <Navbar />
        <main className="min-h-screen pb-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
