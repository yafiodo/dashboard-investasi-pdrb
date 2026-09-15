"use client";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import riruDataRaw from "@/data/riru_readiness_data.json";
import { MergedRecord } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import { Table, Download, Search, ChevronLeft, ChevronRight, Calendar, Filter } from "lucide-react";

export default function DataExplorerPage() {
  const mergedData = mergedDataRaw as MergedRecord[];
  const riruProvinces = riruDataRaw.provinces;

  const [selectedProvince, setSelectedProvince] = useState<string>("Semua");
  const [startYear, setStartYear] = useState<number>(2015);
  const [endYear, setEndYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeView, setTimeView] = useState<"triwulanan" | "tahunan">("triwulanan");
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const provincesList = useMemo(() => {
    const set = new Set(mergedData.map((d) => d.provinsi.trim()));
    return ["Semua", ...Array.from(set).sort((a, b) => a.localeCompare(b, "id"))];
  }, [mergedData]);

  const yearsList = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  // Map of province -> RIRU data
  const riruMap = useMemo(() => {
    const map: { [key: string]: any } = {};
    for (const p of riruProvinces) {
      map[p.provinsi] = p;
    }
    return map;
  }, [riruProvinces]);

  // Aggregate data if timeView === "tahunan"
  const aggregatedData = useMemo(() => {
    if (timeView === "triwulanan") {
      return mergedData;
    }

    // Group by provinsi and tahun
    const grouped: { [key: string]: any } = {};
    for (const d of mergedData) {
      const key = `${d.provinsi}_${d.tahun}`;
      if (!grouped[key]) {
        grouped[key] = {
          provinsi: d.provinsi,
          region: d.region,
          tahun: d.tahun,
          triwulan: "-",
          periode: `${d.tahun} (Tahunan)`,
          investasi_total_milyar: 0,
          investasi_pma_milyar: 0,
          investasi_pmdn_milyar: 0,
          pdrb_adhk_milyar: 0,
          pdrb_adhb_milyar: 0,
          count: 0,
        };
      }
      grouped[key].investasi_total_milyar += d.investasi_total_milyar;
      grouped[key].investasi_pma_milyar += d.investasi_pma_milyar;
      grouped[key].investasi_pmdn_milyar += d.investasi_pmdn_milyar;
      grouped[key].pdrb_adhk_milyar += d.pdrb_adhk_milyar;
      grouped[key].pdrb_adhb_milyar += d.pdrb_adhb_milyar;
      grouped[key].count += 1;
    }

    return Object.values(grouped).map((item) => ({
      ...item,
      investasi_total_milyar: Math.round(item.investasi_total_milyar * 100) / 100,
      investasi_pma_milyar: Math.round(item.investasi_pma_milyar * 100) / 100,
      investasi_pmdn_milyar: Math.round(item.investasi_pmdn_milyar * 100) / 100,
      pdrb_adhk_milyar: Math.round((item.pdrb_adhk_milyar / (item.count || 1)) * 100) / 100,
      pdrb_adhb_milyar: Math.round((item.pdrb_adhb_milyar / (item.count || 1)) * 100) / 100,
      rasio_investasi_pdrb_persen:
        item.pdrb_adhb_milyar > 0
          ? Math.round((item.investasi_total_milyar / item.pdrb_adhb_milyar) * 1000) / 10
          : 0,
    }));
  }, [mergedData, timeView]);

  const filteredData = useMemo(() => {
    return aggregatedData.filter((item) => {
      if (selectedProvince !== "Semua" && item.provinsi !== selectedProvince) return false;
      if (item.tahun < startYear || item.tahun > endYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.provinsi.toLowerCase().includes(q) || item.periode.toLowerCase().includes(q);
      }
      return true;
    });
  }, [aggregatedData, selectedProvince, startYear, endYear, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      "Provinsi", "Region", "Tahun", "Triwulan", "Periode",
      "Investasi_Total_Milyar", "Investasi_PMA_Milyar", "Investasi_PMDN_Milyar",
      "PDRB_ADHK_Milyar", "PDRB_ADHB_Milyar", "Rasio_Inv_PDRB_Persen",
      "Skor_RIRU", "Peringkat_RIRU", "Kuadran_RIRU"
    ];

    const rows = filteredData.map((d) => {
      const r = riruMap[d.provinsi];
      return [
        `"${d.provinsi}"`, `"${d.region}"`, d.tahun, d.triwulan, `"${d.periode}"`,
        d.investasi_total_milyar, d.investasi_pma_milyar, d.investasi_pmdn_milyar,
        d.pdrb_adhk_milyar, d.pdrb_adhb_milyar, d.rasio_investasi_pdrb_persen,
        r ? r.riru_score : "", r ? r.rank : "", r ? `"${r.kuadran_label}"` : ""
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Investasi_PDRB_RIRU_${timeView}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Export Button on Right (Matching Image 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
            <Table className="w-7 h-7 text-emerald-700" />
            Data Explorer &amp; Export (Terintegrasi Skor RIRU)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Jelajahi, filter, dan unduh dataset komprehensif Realisasi Investasi (BKPM), PDRB (BPS), serta Skor Kesiapan RIRU 2015&ndash;2026.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV ({filteredData.length} baris)
        </button>
      </div>

      {/* Filter Controls Bar with Quarterly/Annual Toggle */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Province Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
            <span>Provinsi:</span>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 text-slate-900 rounded-lg px-3 py-1.5 border border-slate-300 text-xs font-bold outline-none"
            >
              {provincesList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Time Aggregation Toggle (Triwulanan vs Tahunan) */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 border-l border-slate-200 pl-4">
            <Filter className="w-4 h-4 text-blue-900" />
            <span>Tampilan Waktu:</span>
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setTimeView("triwulanan");
                  setPage(1);
                }}
                className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                  timeView === "triwulanan"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Triwulanan (Q1 - Q4)
              </button>
              <button
                onClick={() => {
                  setTimeView("tahunan");
                  setPage(1);
                }}
                className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                  timeView === "tahunan"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tahunan (Agregat)
              </button>
            </div>
          </div>

          {/* Year Range Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 border-l border-slate-200 pl-4">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Periode:</span>
            <select
              value={startYear}
              onChange={(e) => {
                setStartYear(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-50 text-slate-900 rounded-lg px-2 py-1 border border-slate-300 text-xs font-bold"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span>s.d.</span>
            <select
              value={endYear}
              onChange={(e) => {
                setEndYear(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-50 text-slate-900 rounded-lg px-2 py-1 border border-slate-300 text-xs font-bold"
            >
              {yearsList.filter((y) => y >= startYear).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari provinsi / periode..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
          />
        </div>
      </div>

      {/* Table with RIRU score & rank */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-3">Provinsi</th>
                <th className="py-3 px-3">Periode</th>
                <th className="py-3 px-3 text-right">Investasi Total (Miliar Rp)</th>
                <th className="py-3 px-3 text-right">PMA (Miliar Rp)</th>
                <th className="py-3 px-3 text-right">PMDN (Miliar Rp)</th>
                <th className="py-3 px-3 text-right">PDRB ADHB (Miliar Rp)</th>
                <th className="py-3 px-3 text-right">Rasio Inv/PDRB</th>
                <th className="py-3 px-3 text-center">Skor RIRU</th>
                <th className="py-3 px-3 text-center">Rank RIRU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((d: any, idx: number) => {
                const r = riruMap[d.provinsi];
                return (
                  <tr key={`${d.provinsi}-${d.periode}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#0f172a]">{d.provinsi}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{d.periode}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-blue-900">
                      {d.investasi_total_milyar.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 font-medium">
                      {d.investasi_pma_milyar.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 font-medium">
                      {d.investasi_pmdn_milyar.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-800">
                      {d.pdrb_adhb_milyar.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-700">{d.rasio_investasi_pdrb_persen}%</td>
                    <td className="py-2.5 px-3 text-center font-black text-blue-900">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                        {r ? `${r.riru_score}/100` : "-"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {r ? `#${r.rank}` : "-"}
                    </td>
                  </tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    Tidak ada data yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-800">{Math.min(filteredData.length, (page - 1) * pageSize + 1)}</strong> s.d.{" "}
            <strong className="text-slate-800">{Math.min(filteredData.length, page * pageSize)}</strong> dari{" "}
            <strong className="text-slate-800">{filteredData.length}</strong> baris data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
