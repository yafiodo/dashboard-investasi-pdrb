"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, 
  Layers, 
  Map, 
  Bot, 
  Newspaper, 
  Table, 
  BarChart3,
  Activity,
  RefreshCw,
  CheckCircle2,
  Database,
  Camera
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const navItems = [
    { name: "Overview", href: "/", icon: BarChart3 },
    { name: "Regional", href: "/komparasi", icon: TrendingUp },
    { name: "Sektoral", href: "/sektoral", icon: Layers },
    { name: "Peta Spasial", href: "/peta", icon: Map },
    { name: "AI Analyst", href: "/ai-analyst", icon: Bot },
    { name: "Berita", href: "/berita", icon: Newspaper },
    { name: "Data Explorer", href: "/data-explorer", icon: Table },
  ];

  const [isCapturing, setIsCapturing] = useState(false);

  const handleCaptureScreen = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setSyncStatus("Mengambil tangkapan layar (Screen Capture)...");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const targetElement = (document.querySelector("main") || document.body) as HTMLElement;
      
      const canvas = await html2canvas(targetElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: "#f8fafc",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.download = `SI-RIRU-Capture-${timestamp}.png`;
      link.href = image;
      link.click();

      setSyncStatus("Tangkapan layar berhasil diunduh!");
      setTimeout(() => setSyncStatus(null), 3500);
    } catch (error) {
      console.error("Gagal melakukan capture layar:", error);
      setSyncStatus("Gagal mengambil tangkapan layar.");
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/sync-data", { method: "POST" });
      const data = await res.json();
      setSyncStatus(data.message || "Data berhasil disinkronkan!");
    } catch (err) {
      setSyncStatus("Gagal menyinkronkan data.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b192e] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-shrink-0">
            <Link href="/" className="font-black text-lg sm:text-xl tracking-wide text-white flex items-center gap-1 leading-none">
              <span>SI-RIRU</span>
            </Link>
            <p className="text-[10px] text-slate-300 font-medium whitespace-nowrap hidden sm:block tracking-tight mt-0.5">
              Sistem Informasi Regional Investment Relations Unit
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                    : "text-slate-200 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sync Data Button & Screen Capture */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Klik untuk memperbarui & sinkronkan data BKPM dan BPS"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-300" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Menyinkronkan..." : "Update Data"}</span>
          </button>

          {/* Screen Capture button replacing 38 Provinsi */}
          <button
            onClick={handleCaptureScreen}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 text-[10px] font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Ambil tangkapan layar (Screen Capture) halaman dashboard"
          >
            <Camera className={`w-3.5 h-3.5 ${isCapturing ? "animate-pulse text-amber-400" : "text-amber-400/90"}`} />
            <span className="tracking-tight">{isCapturing ? "Menyimpan..." : "Screen Capture"}</span>
          </button>
        </div>
      </div>

      {/* Sync notification banner */}
      {syncStatus && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Mobile nav */}
      <div className="lg:hidden flex items-center justify-start overflow-x-auto px-4 py-2 gap-1 border-t border-slate-800 bg-[#081324]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
