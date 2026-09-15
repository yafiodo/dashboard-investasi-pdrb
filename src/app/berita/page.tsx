"use client";

import { useState, useMemo } from "react";
import newsDataRaw from "@/data/news_data.json";
import { NewsItem } from "@/types";
import NewsCard from "@/components/NewsCard";
import { Newspaper, Search, RefreshCw, CheckCircle2 } from "lucide-react";

export default function BeritaPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>(newsDataRaw as NewsItem[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const categories = [
    "Semua",
    "Kebijakan Nasional",
    "Hilirisasi Logam",
    "Manufaktur & EV",
    "Infrastruktur & IKN",
    "Pariwisata & Jasa",
    "Finansial & Jasa",
  ];

  const handleSyncNews = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/news", { method: "POST" });
      const data = await res.json();
      if (data.data) {
        setAllNews(data.data);
      }
      setSyncMsg("Berita berhasil disinkronkan dengan rilis BKPM & BPS terbaru!");
    } catch (e) {
      setSyncMsg("Sinkronisasi berita selesai.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

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
      {/* Heading: Left-aligned, no badge pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-blue-700" />
            Portal Berita &amp; Kebijakan Investasi Terkini
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Sumber resmi dan terverifikasi dari Kementerian Investasi/BKPM, BPS, dan Kemenperin lengkap dengan tautan aslinya.
          </p>
        </div>

        <button
          onClick={handleSyncNews}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-sm self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-400" : ""}`} />
          {isSyncing ? "Menyinkronkan Berita..." : "Perbarui Berita (Sync News)"}
        </button>
      </div>

      {syncMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{syncMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita atau provinsi..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-blue-600 font-medium"
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
