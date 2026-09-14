"use client";

import { useState, useMemo } from "react";
import newsDataRaw from "@/data/news_data.json";
import { NewsItem } from "@/types";
import NewsCard from "@/components/NewsCard";
import { Newspaper, Search } from "lucide-react";

export default function BeritaPage() {
  const allNews = newsDataRaw as NewsItem[];
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["Semua", "Kebijakan Nasional", "Hilirisasi Logam", "Manufaktur & EV", "Infrastruktur & IKN", "Pariwisata & Jasa", "Finansial & Jasa"];

  const filteredNews = useMemo(() => {
    return allNews.filter((item) => {
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.provinces.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allNews, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Newspaper className="w-7 h-7 text-blue-400" />
          Portal Berita &amp; Kebijakan Investasi Terkini
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kabar dan rilis kebijakan strategis terkait penanaman modal, hilirisasi industri, serta capaian PDRB daerah.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita atau provinsi..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
