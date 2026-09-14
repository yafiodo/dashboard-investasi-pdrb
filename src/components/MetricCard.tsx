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
}: MetricCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            {icon}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black tracking-tight text-[#0f172a]">{value}</h3>
          {subValue && <p className="text-xs font-medium text-slate-500 mt-0.5">{subValue}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        {changePercent !== undefined && changePercent !== null ? (
          <div className={`flex items-center gap-1 font-bold ${changePercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {changePercent >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(changePercent)}% YoY</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium">Periode Terpilih</span>
        )}

        {badgeText && (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
