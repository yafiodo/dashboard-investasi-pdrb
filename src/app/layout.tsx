import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SI-RIRU | Sistem Informasi Regional Investment Relations Unit",
  description: "Platform Analisis dan Pemantauan Kesiapan Regional Investment Relations Unit (RIRU) 38 Provinsi di Indonesia (BKPM & BPS 2015-2026).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium text-slate-700">
              SI-RIRU &ndash; Sistem Informasi Regional Investment Relations Unit (BKPM &amp; BPS 2015&ndash;2026)
            </p>
            <p className="text-slate-400">
              Data Resmi Kementerian Investasi/BKPM &amp; Badan Pusat Statistik RI
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
