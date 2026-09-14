"use client";

import { NewsItem } from "@/types";
import { Calendar, TrendingUp, Tag, ExternalLink } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
  onSelectProvince?: (prov: string) => void;
}

export default function NewsCard({ news, onSelectProvince }: NewsCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold">
            {news.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {news.date}
          </span>
        </div>

        <a
          href={news.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-extrabold text-[#0f172a] group-hover:text-blue-700 transition-colors line-clamp-2 mb-2 flex items-start justify-between gap-2"
        >
          <span>{news.title}</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-blue-600 mt-1" />
        </a>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal">
          {news.summary}
        </p>

        {/* Economic Impact Card */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            Dampak terhadap PDRB &amp; Investasi:
          </div>
          <p className="text-[11px] text-emerald-950 leading-normal">{news.impact}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {news.provinces.map((prov) => (
            <button
              key={prov}
              onClick={() => onSelectProvince && onSelectProvince(prov)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] border border-slate-200 transition-colors"
            >
              {prov}
            </button>
          ))}
        </div>

        <a
          href={news.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1"
        >
          {news.source} <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
