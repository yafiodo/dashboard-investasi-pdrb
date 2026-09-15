"use client";

import { useState, useMemo } from "react";
import sectorBreakdownRaw from "@/data/sector_breakdown_full.json";
import { formatRupiah } from "@/lib/dataProcessor";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Layers, Factory, Filter, CheckCircle2, Sparkles, TrendingUp, DollarSign, Table } from "lucide-react";

export default function SektoralPage() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [investmentStatus, setInvestmentStatus] = useState<"all" | "pma" | "pmdn">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const nationalSectors = sectorBreakdownRaw.national_sectors;
  const allSectorsList = useMemo(() => {
    return [...sectorBreakdownRaw.all_sectors_list].sort((a: string, b: string) => a.localeCompare(b, "id"));
  }, []);

  // Filtered sectors list
  const filteredSectors = useMemo(() => {
    return nationalSectors.filter((s: any) => {
      if (categoryFilter !== "all" && s.sektor_utama !== categoryFilter) {
        return false;
      }
      if (selectedSector !== "all" && s.sektor !== selectedSector) {
        return false;
      }
      return true;
    });
  }, [nationalSectors, selectedSector, categoryFilter]);

  // Chart data
  const chartData = useMemo(() => {
    const list = selectedSector === "all" ? nationalSectors.slice(0, 10) : filteredSectors;
    return list.map((s: any) => ({
      name: s.sektor.length > 28 ? s.sektor.slice(0, 26) + "..." : s.sektor,
      fullName: s.sektor,
      pma: s.pma_triliun,
      pmdn: s.pmdn_triliun,
      total: s.total_triliun,
      kategori: s.sektor_utama,
    }));
  }, [nationalSectors, filteredSectors, selectedSector]);

  // Highlight stats
  const totalFilteredInv = useMemo(() => {
    return filteredSectors.reduce((acc: number, curr: any) => {
      if (investmentStatus === "pma") return acc + curr.pma_miliar;
      if (investmentStatus === "pmdn") return acc + curr.pmdn_miliar;
      return acc + curr.total_miliar;
    }, 0);
  }, [filteredSectors, investmentStatus]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      const fullName = item?.fullName || label;
      return (
        <div className="bg-slate-950 text-white border border-slate-700 p-4 rounded-xl shadow-2xl text-xs space-y-2 z-50 max-w-md animate-in fade-in">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {item?.kategori || "Sektor Investasi BKPM"}
            </span>
            <p className="font-black text-sm text-white leading-snug mt-0.5">
              {fullName}
            </p>
          </div>
          <div className="space-y-1.5 pt-0.5">
            {payload.map((entry: any, index: number) => (
              <div key={`s-${index}`} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-300 font-medium">{entry.name}:</span>
                </div>
                <strong className="text-white font-black">Rp {entry.value} Triliun</strong>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 text-xs pt-1.5 border-t border-slate-800 text-amber-400 font-black">
              <span>Total Kumulatif:</span>
              <span>Rp {item?.total} Triliun</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Heading: Left-aligned, no badge pill */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
          <Layers className="w-7 h-7 text-blue-900" />
          Analisis Sektoral: Realisasi Investasi &amp; PDRB
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Eksplorasi mendalam 23 sektor investasi BKPM dengan filter tipe PMA/PMDN, integrasi hilirisasi, dan perbandingan lapangan usaha PDRB BPS periode 2015&ndash;2026.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Sector Dropdown Filter */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 shrink-0 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-900" /> Pilih Sektor:
            </span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full sm:max-w-md bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2 border border-slate-300 text-xs font-bold focus:border-blue-700 outline-none"
            >
              <option value="all">Semua Sektor (23 Sektor Investasi BKPM)</option>
              {allSectorsList.map((sec: string) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* PMA vs PMDN vs ALL Segmented Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start md:self-auto">
            <button
              onClick={() => setInvestmentStatus("all")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                investmentStatus === "all"
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua (Total)
            </button>
            <button
              onClick={() => setInvestmentStatus("pma")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                investmentStatus === "pma"
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              PMA (Asing)
            </button>
            <button
              onClick={() => setInvestmentStatus("pmdn")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                investmentStatus === "pmdn"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              PMDN (Domestik)
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Kelompok Sektor:</span>
          {["all", "Sektor Primer", "Sektor Sekunder", "Sektor Tersier"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all ${
                categoryFilter === cat
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "Semua Kelompok" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards for Selected Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Investasi Sektor Terpilih</span>
          <p className="text-2xl font-black text-blue-900 mt-1">
            {formatRupiah(totalFilteredInv)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {investmentStatus === "all" ? "Total PMA + PMDN" : investmentStatus === "pma" ? "Khusus Modal Asing (PMA)" : "Khusus Modal Domestik (PMDN)"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Porsi Terhadap Nasional</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {selectedSector === "all" ? "100%" : `${filteredSectors[0]?.share_national_pct || 0}%`}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Dari total modal investasi kumulatif</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Porsi PMA vs PMDN</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {selectedSector === "all" ? "52% / 48%" : `${filteredSectors[0]?.share_pma_pct || 0}% / ${filteredSectors[0]?.share_pmdn_pct || 0}%`}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Dominasi modal asing vs domestik</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sektor Lapangan Usaha BPS Terkait</span>
          <p className="text-base font-extrabold text-[#0f172a] mt-1 truncate">
            {selectedSector === "all" ? "17 Lapangan Usaha" : "Industri Pengolahan & Pertambangan"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Korelasi langsung dengan PDRB daerah</p>
        </div>
      </div>

      {/* Hilirisasi Key Insights Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Temuan Hilirisasi Sektor Strategis 2015&ndash;2026
        </div>
        <h4 className="text-lg sm:text-xl font-black text-white mb-2">
          Industri Logam Dasar &amp; Pertambangan Mendominasi Aliran Investasi PMA
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-5xl font-normal">
          Data BKPM menunjukkan sektor <strong>Industri Logam Dasar, Barang Logam, Bukan Mesin dan Peralatannya</strong> serta 
          <strong> Pertambangan</strong> mencatat realisasi kumulatif terbesar (melebihi Rp 1.000 Triliun) dengan porsi PMA 
          mencapai lebih dari 75%. Hal ini selaras dengan data BPS di mana <strong>PDRB Industri Pengolahan</strong> menjadi 
          lokomotif pertumbuhan tertinggi di provinsi sentra hilirisasi nikel dan temaga seperti Sulawesi Tengah dan Maluku Utara.
        </p>
      </div>

      {/* Bar Chart Visualization */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-base text-[#0f172a] flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-900" />
              Grafik Komparasi Realisasi Investasi per Sektor (Rp Triliun)
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Menampilkan {chartData.length} sektor teratas berdasarkan filter terpilih
            </p>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 140, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `Rp ${v} T`} />
              <YAxis dataKey="name" type="category" stroke="#334155" fontSize={10} width={130} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {investmentStatus !== "pmdn" && (
                <Bar dataKey="pma" name="PMA (Modal Asing)" fill="#1e3a8a" stackId="a" />
              )}
              {investmentStatus !== "pma" && (
                <Bar dataKey="pmdn" name="PMDN (Modal Domestik)" fill="#d97706" stackId="a" radius={[0, 4, 4, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full 23 Sectors Data Table: Polished layout with search and sticky headers */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-black text-base text-[#0f172a] flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-900" />
              Tabel Lengkap 23 Sektor Investasi BKPM (Kumulatif 2015&ndash;2026)
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Rincian komparasi aliran modal asing (PMA), modal domestik (PMDN), dan prioritas hilirisasi
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 self-start sm:self-auto">
            Total {filteredSectors.length} Sektor Ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-800">
                <th className="py-3.5 px-4 font-extrabold w-12 text-center">#</th>
                <th className="py-3.5 px-4 font-extrabold min-w-[260px]">Nama Sektor</th>
                <th className="py-3.5 px-4 font-extrabold min-w-[140px]">Kelompok Usaha</th>
                <th className="py-3.5 px-4 font-extrabold text-right min-w-[120px]">PMA (Triliun Rp)</th>
                <th className="py-3.5 px-4 font-extrabold text-right min-w-[120px]">PMDN (Triliun Rp)</th>
                <th className="py-3.5 px-4 font-extrabold text-right min-w-[140px]">Total Investasi (Triliun Rp)</th>
                <th className="py-3.5 px-4 font-extrabold text-right min-w-[100px]">Pangsa</th>
                <th className="py-3.5 px-4 font-extrabold text-center min-w-[140px]">Status Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSectors.map((s: any, idx: number) => {
                const isHilirisasi =
                  s.sektor.includes("Logam") ||
                  s.sektor.includes("Pertambangan") ||
                  s.sektor.includes("Kimia") ||
                  s.sektor.includes("Karet") ||
                  s.sektor.includes("Kendaraan");

                return (
                  <tr key={s.sektor} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400 text-center">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-xs leading-snug">{s.sektor}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700 border border-slate-200">
                        {s.sektor_utama}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-blue-900">
                      {s.pma_triliun.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                      {s.pmdn_triliun.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                      {s.total_triliun.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                      {s.share_national_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isHilirisasi ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hilirisasi Prioritas
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                          Sektor Reguler
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
