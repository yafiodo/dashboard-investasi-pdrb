"use client";

import { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  CheckCircle2,
  Camera,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import RIRULogo from "@/components/RIRULogo";

export default function Navbar() {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Overview", href: "/", icon: BarChart3, desc: "Dashboard Utama & Tren Makro" },
    { name: "Regional", href: "/komparasi", icon: TrendingUp, desc: "Profil 38 Provinsi & Kesiapan RIRU" },
    { name: "Sektoral", href: "/sektoral", icon: Layers, desc: "Komposisi 23 Sektor BKPM & Hilirisasi" },
    { name: "Peta Spasial", href: "/peta", icon: Map, desc: "Peta Satelit Sebaran Ekonomi Daerah" },
    { name: "AI Analyst", href: "/ai-analyst", icon: Bot, desc: "Asisten Cerdas Analisis Makroekonomi" },
    { name: "Berita", href: "/berita", icon: Newspaper, desc: "Rilis Resmi BKPM, BPS, & Kebijakan" },
    { name: "Data Explorer", href: "/data-explorer", icon: Table, desc: "Eksplorasi Granular & Ekspor CSV" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <RIRULogo className="w-10 h-10" />
          </Link>
          <div className="flex-shrink-0">
            <Link href="/" className="font-black text-lg sm:text-xl tracking-wide text-white flex items-center gap-1 leading-none hover:text-amber-300 transition-colors">
              <span>SI-RIRU</span>
            </Link>
            <p className="text-[10px] text-slate-300 font-medium whitespace-nowrap hidden sm:block tracking-tight mt-0.5">
              Sistem Informasi Regional Investor Relations Unit
            </p>
          </div>
        </div>

        {/* Right side: Action buttons & Hamburger Menu (Garis 3) */}
        <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
          {/* Sync Data Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Klik untuk memperbarui & sinkronkan data BKPM dan BPS"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-300" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Menyinkronkan..." : "Update Data"}</span>
          </button>

          {/* Screen Capture button */}
          <button
            onClick={handleCaptureScreen}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 text-[11px] font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Ambil tangkapan layar (Screen Capture) halaman dashboard"
          >
            <Camera className={`w-3.5 h-3.5 ${isCapturing ? "animate-pulse text-amber-400" : "text-amber-400/90"}`} />
            <span className="tracking-tight hidden sm:inline">{isCapturing ? "Menyimpan..." : "Screen Capture"}</span>
          </button>

          {/* Garis 3 (Hamburger Menu Button) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
              isMenuOpen
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white border-slate-700"
            }`}
            title="Buka Navigasi Halaman (Garis 3)"
            aria-label="Menu Navigasi"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-amber-400" />}
            <span className="font-bold">Menu</span>
          </button>

          {/* Dropdown Menu Panel from Garis 3 */}
          {isMenuOpen && (
            <div 
              style={{ backgroundColor: "rgba(11, 25, 46, 0.88)" }}
              className="absolute right-4 sm:right-6 top-16 z-50 w-72 sm:w-80 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 ring-1 ring-black/30"
            >
              <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Navigasi SI-RIRU
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Tutup Menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all group ${
                        isActive
                          ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25 border border-amber-400"
                          : "hover:bg-slate-800/70 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? "bg-slate-950/20 text-slate-950" : "bg-[#081324] text-amber-400 border border-slate-700/50 group-hover:bg-slate-700"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs ${isActive ? "text-slate-950 font-black" : "text-slate-300 font-bold group-hover:text-amber-300 transition-colors"}`}>
                            {item.name}
                          </div>
                          <div className={`text-[10px] leading-tight mt-0.5 ${isActive ? "text-slate-900 font-semibold" : "text-slate-400 group-hover:text-slate-300"}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync notification banner */}
      {syncStatus && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncStatus}</span>
        </div>
      )}
    </header>
  );
}
