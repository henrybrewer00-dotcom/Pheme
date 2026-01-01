import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/navigation/Header";
import DarkModeScript from "@/components/DarkModeScript";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "Pheme - AI-Powered News Aggregator",
  description: "Stay informed with AI-curated news from trusted sources. Personalized feeds, smart summaries, and author tracking.",
  keywords: ["news", "AI", "aggregator", "summaries", "personalized"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DarkModeScript />
      </head>
      <body
        className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
      >
        <Onboarding />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
