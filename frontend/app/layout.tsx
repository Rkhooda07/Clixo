import { Providers } from "@/components/wallet/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata = {
  title: "Clixo — Decentralised Opinion Market",
  description: "Post anything that needs real human judgment. Stake ETH. Get answers from real people who get paid to give a damn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
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
