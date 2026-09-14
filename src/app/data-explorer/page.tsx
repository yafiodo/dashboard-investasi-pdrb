"use client";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import { MergedRecord } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import { Table, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataExplorerPage() {
  const mergedData = mergedDataRaw as MergedRecord[];

  const [selectedProvince, setSelectedProvince] = useState<string>("Semua");
  const [selectedYear, setSelectedYear] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const provincesList = useMemo(() => {
    const set = new Set(mergedData.map((d) => d.provinsi));
    return ["Semua", ...Array.from(set).sort()];
  }, [mergedData]);

  const yearsList = ["Semua", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

  const filteredData = useMemo(() => {
    return mergedData.filter((item) => {
      if (selectedProvince !== "Semua" && item.provinsi !== selectedProvince) return false;
      if (selectedYear !== "Semua" && item.tahun.toString() !== selectedYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.provinsi.toLowerCase().includes(q) || item.periode.toLowerCase().includes(q);
      }
      return true;
    });
  }, [mergedData, selectedProvince, selectedYear, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      "Provinsi", "Region", "Tahun", "Triwulan", "Periode",
      "Investasi_Total_Milyar", "Investasi_PMA_Milyar", "Investasi_PMDN_Milyar",
      "PDRB_ADHK_Milyar", "PDRB_ADHB_Milyar", "Rasio_Inv_PDRB_Persen"
    ];

    const rows = filteredData.map((d) => [
      `"${d.provinsi}"`, `"${d.region}"`, d.tahun, d.triwulan, `"${d.periode}"`,
      d.investasi_total_milyar, d.investasi_pma_milyar, d.investasi_pmdn_milyar,
      d.pdrb_adhk_milyar, d.pdrb_adhb_milyar, d.rasio_investasi_pdrb_persen
    ]);

    const csvContent = "﻿" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Investasi_PDRB_Filtered_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Table className="w-7 h-7 text-emerald-400" />
            Data Explorer &amp; Export
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Jelajahi, filter, dan unduh data tabulasi komparasi Investasi (BKPM) &times; PDRB (BPS) 2015-2026.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all self-start"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV ({filteredData.length} baris)
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <span>Provinsi:</span>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 text-xs"
            >
              {provincesList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <span>Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
              className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 text-xs"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari provinsi atau kuartal..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Provinsi</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Investasi Total</th>
                <th className="py-3 px-4">PMA</th>
                <th className="py-3 px-4">PMDN</th>
                <th className="py-3 px-4">PDRB ADHK</th>
                <th className="py-3 px-4">PDRB ADHB</th>
                <th className="py-3 px-4">Rasio Inv/PDRB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedData.map((row, idx) => (
                <tr key={`${row.provinsi}-${row.periode}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{row.provinsi}</td>
                  <td className="py-3 px-4 text-slate-400">{row.region}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-300">{row.periode}</td>
                  <td className="py-3 px-4 font-bold text-blue-400">{formatRupiah(row.investasi_total_milyar)}</td>
                  <td className="py-3 px-4 text-slate-300">{formatRupiah(row.investasi_pma_milyar)}</td>
                  <td className="py-3 px-4 text-slate-300">{formatRupiah(row.investasi_pmdn_milyar)}</td>
                  <td className="py-3 px-4 text-slate-300">{formatRupiah(row.pdrb_adhk_milyar)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{formatRupiah(row.pdrb_adhb_milyar)}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">{row.rasio_investasi_pdrb_persen}%</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Tidak ada data yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Menampilkan {Math.min((page - 1) * pageSize + 1, filteredData.length)} &ndash; {Math.min(page * pageSize, filteredData.length)} dari {filteredData.length} baris
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-200">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
