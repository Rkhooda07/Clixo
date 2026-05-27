import { Providers } from "@/components/wallet/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata = {
  title: "Clixo — Decentralized Thumbnail Testing Platform",
  description: "Upload thumbnail options, stake ETH as a reward, and let the crowd pick your best-performing thumbnail on the blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#0a0a0f] text-zinc-100">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans bg-[#0a0a0f] antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <Providers>
          <div className="relative min-h-screen flex flex-col justify-between">
            <Navbar />
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            
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