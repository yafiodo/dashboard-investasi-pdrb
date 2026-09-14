"use client";

import { NewsItem } from "@/types";
import { Calendar, TrendingUp, Tag } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
  onSelectProvince?: (prov: string) => void;
}

export default function NewsCard({ news, onSelectProvince }: NewsCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 backdrop-blur-sm shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold">
            {news.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {news.date}
          </span>
        </div>

        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
          {news.title}
        </h4>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {news.summary}
        </p>

        {/* Economic Impact Badge */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-4">
          <div className="flex items-center gap-1.5 font-semibold text-[11px] text-emerald-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Dampak terhadap PDRB & Investasi:
          </div>
          <p className="text-[11px] text-slate-300">{news.impact}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          {news.provinces.map((prov) => (
            <button
              key={prov}
              onClick={() => onSelectProvince && onSelectProvince(prov)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[10px] border border-slate-700 transition-colors"
            >
              {prov}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-500 italic">
          Sumber: {news.source}
        </span>
      </div>
    </div>
  );
}
