import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafariBackground from "@/components/SafariBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafariStay — Kenyan Airbnbs: beach villas, bush homes & hosted camps",
  description:
    "Book beachfront villas, bush homes, cottages and hosted camps run by Kenyan locals — Airbnbs beside Kenya's wildlife reserves, from the Maasai Mara to Diani and the coast.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-sand-50 text-ink antialiased">
        <SafariBackground />
        <div className="relative z-10">
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
