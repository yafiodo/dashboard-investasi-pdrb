"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  changePercent?: number | null;
  icon: ReactNode;
  badgeText?: string;
  color?: "blue" | "emerald" | "amber" | "purple" | "cyan";
}

export default function MetricCard({
  title,
  value,
  subValue,
  changePercent,
  icon,
  badgeText,
  color = "blue",
}: MetricCardProps) {
  const colorStyles = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-400",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-400",
    purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-400",
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400",
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-b ${colorStyles[color]} bg-slate-900/60 border backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all duration-300 shadow-lg`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-0.5">{subValue}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        {changePercent !== undefined && changePercent !== null ? (
          <div className={`flex items-center gap-1 font-semibold ${changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {changePercent >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(changePercent)}% YoY</span>
          </div>
        ) : (
          <span className="text-slate-500">Periode Terpilih</span>
        )}

        {badgeText && (
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
