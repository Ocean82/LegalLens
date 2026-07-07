import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalLens — U.S. Legal Research Platform",
  description: "Search, scrape, and analyze U.S. federal and state legal information including court cases, statutes, and regulations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-navy-50 text-navy-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
