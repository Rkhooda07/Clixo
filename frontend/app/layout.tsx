import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="p-4">
          <h1 className="text-x1 font-bold">Clixo</h1>
          {children}
          <Navbar />
        </div>
      </body>
    </html>
  )
}