"use client";

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
  Activity
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/", icon: BarChart3 },
    { name: "Komparasi", href: "/komparasi", icon: TrendingUp },
    { name: "Sektoral", href: "/sektoral", icon: Layers },
    { name: "Peta Spasial", href: "/peta", icon: Map },
    { name: "AI Analyst", href: "/ai-analyst", icon: Bot },
    { name: "Berita Investasi", href: "/berita", icon: Newspaper },
    { name: "Data Explorer", href: "/data-explorer", icon: Table },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <Link href="/" className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300">
              INVESTASI &times; PDRB
            </Link>
            <p className="text-xs text-slate-400 font-medium">Monitoring BKPM vs BPS 2015-2026</p>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            38 Provinsi &bull; 2015-2026
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden flex items-center justify-start overflow-x-auto px-4 py-2 gap-1 border-t border-slate-800/80 bg-slate-900/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
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
