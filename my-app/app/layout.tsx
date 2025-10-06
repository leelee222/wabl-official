import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "WABL - West African Basketball League | Where Legends Rise",
  description: "The premier basketball league in West Africa. Follow your favorite teams, players, and matches in the most exciting basketball league across 8 West African cities.",
  keywords: "basketball, West Africa, WABL, sports, league, teams, players, matches, Nigeria, Ghana, Senegal",
  authors: [{ name: "WABL Organization" }],
  creator: "WABL",
  metadataBase: new URL("https://wabl-official.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wabl-official.vercel.app/",
    title: "WABL - West African Basketball League",
    description: "Where Legends Rise - The premier basketball league in West Africa",
    siteName: "WABL",
  },
  twitter: {
    card: "summary_large_image",
    title: "WABL - West African Basketball League",
    description: "Where Legends Rise - The premier basketball league in West Africa",
    creator: "@wabl_official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
