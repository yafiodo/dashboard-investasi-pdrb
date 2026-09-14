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
import { Layers, Factory, Filter, CheckCircle2, Sparkles, TrendingUp, DollarSign } from "lucide-react";

export default function SektoralPage() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [investmentStatus, setInvestmentStatus] = useState<"all" | "pma" | "pmdn">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const nationalSectors = sectorBreakdownRaw.national_sectors;
  const allSectorsList = sectorBreakdownRaw.all_sectors_list;

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
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xl text-xs space-y-1 z-50 max-w-sm">
          <p className="font-extrabold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`s-${index}`} className="flex justify-between gap-4 text-[11px]">
              <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
              <strong className="text-slate-900">Rp {entry.value} Triliun</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
          <Layers className="w-7 h-7 text-blue-900" />
          Analisis Sektoral: Realisasi Investasi (BKPM) &amp; Lapangan Usaha (BPS)
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

      {/* Full 23 Sectors Data Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-base text-[#0f172a]">
            Tabel Lengkap 23 Sektor Investasi BKPM (Kumulatif 2015&ndash;2026)
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            Total {filteredSectors.length} sektor ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-3 font-bold">#</th>
                <th className="py-3 px-3 font-bold">Nama Sektor</th>
                <th className="py-3 px-3 font-bold">Kelompok</th>
                <th className="py-3 px-3 font-bold text-right">PMA (Triliun)</th>
                <th className="py-3 px-3 font-bold text-right">PMDN (Triliun)</th>
                <th className="py-3 px-3 font-bold text-right">Total Investasi</th>
                <th className="py-3 px-3 font-bold text-right">Pangsa Nasional</th>
                <th className="py-3 px-3 font-bold text-center">Status Hilirisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSectors.map((s: any, idx: number) => {
                const isHilirisasi =
                  s.sektor.includes("Logam") ||
                  s.sektor.includes("Pertambangan") ||
                  s.sektor.includes("Kimia") ||
                  s.sektor.includes("Karet") ||
                  s.sektor.includes("Kendaraan");

                return (
                  <tr key={s.sektor} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-[#0f172a]">{s.sektor}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold">
                        {s.sektor_utama}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-blue-900">Rp {s.pma_triliun} T</td>
                    <td className="py-3 px-3 text-right font-medium text-amber-700">Rp {s.pmdn_triliun} T</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">Rp {s.total_triliun} T</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">{s.share_national_pct}%</td>
                    <td className="py-3 px-3 text-center">
                      {isHilirisasi ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hilirisasi Prioritas
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          Reguler
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
