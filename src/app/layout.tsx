import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalLens — U.S. Legal Research Platform",
  description:
    "Free, open-source legal research platform. Search federal and state laws, scrape court cases from multiple sources, and build your personal research library.",
  keywords: [
    "legal research",
    "court cases",
    "U.S. law",
    "case law search",
    "federal law",
    "state law",
    "legal database",
    "free legal research",
  ],
  authors: [{ name: "Ocean82", url: "https://github.com/Ocean82" }],
  openGraph: {
    title: "LegalLens — U.S. Legal Research Made Simple",
    description:
      "Search federal and state laws, scrape court cases, and build your research library — all in one free platform.",
    type: "website",
    locale: "en_US",
    siteName: "LegalLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalLens — U.S. Legal Research Made Simple",
    description:
      "Free, open-source platform for searching U.S. federal and state legal databases.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
