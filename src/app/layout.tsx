import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SafariStay — Kenyan Airbnbs: beach villas, bush homes & hosted camps",
  description:
    "Book beachfront villas, bush homes, cottages and hosted camps run by Kenyan locals — Airbnbs beside Kenya's wildlife reserves, from the Maasai Mara to Diani and the coast.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
