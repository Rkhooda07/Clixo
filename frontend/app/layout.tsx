import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/wallet/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clixo.app"),
  title: {
    default: "Clixo — Decentralised Opinion Market",
    template: "%s — Clixo",
  },
  description:
    "Post anything that needs real human judgment. Stake ETH. Get answers from real people who get paid to give a damn.",
  openGraph: {
    title: "Clixo — Decentralised Opinion Market",
    description:
      "Post anything that needs real human judgment. Stake ETH. Get answers from real people who get paid to give a damn.",
    siteName: "Clixo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Clixo — Decentralised Opinion Market",
    description:
      "Post anything that needs real human judgment. Stake ETH. Get answers from real people who get paid to give a damn.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Breadcrumb />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
