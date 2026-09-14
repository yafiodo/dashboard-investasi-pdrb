import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dashboard Monitoring Investasi BKPM vs PDRB BPS (2015-2026)",
  description: "Platform Analisis dan Komparasi Realisasi Investasi (PMA & PMDN) dengan Capaian PDRB 38 Provinsi Indonesia dilengkapi Asisten AI dan Berita Ekonomi Terkini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <p>
            Dashboard Monitoring Komparasi Realisasi Investasi (BKPM) &times; Capaian PDRB (BPS) 2015-2026.
          </p>
          <p className="mt-1 text-slate-600">
            Data Resmi Kementerian Investasi/BKPM &amp; Badan Pusat Statistik Indonesia.
          </p>
        </footer>
      </body>
    </html>
  );
}
