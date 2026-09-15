"use client";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import provinceProfilesRaw from "@/data/province_profiles.json";
import riruDataRaw from "@/data/riru_readiness_data.json";
import { MergedRecord, ProvinceProfile } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import DualAxisChart from "@/components/DualAxisChart";
import RIRUMatrix from "@/components/RIRUMatrix";
import RIRURadarChart from "@/components/RIRURadarChart";
import { MapPin, Calendar, Award, CheckCircle2, TrendingUp, DollarSign, Activity, Factory, Globe2 } from "lucide-react";

export default function RegionalPage() {
  const mergedData = mergedDataRaw as MergedRecord[];
  const provinces = provinceProfilesRaw as ProvinceProfile[];
  const riruProvinces = riruDataRaw.provinces;

  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Timur");
  const pdrbBasis = "adhb";
  const [startYear, setStartYear] = useState<number>(2015);
  const [endYear, setEndYear] = useState<number>(2026);

  const yearsList = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const provList = useMemo(() => {
    return [...riruProvinces.map((p) => p.provinsi.trim())].sort((a, b) => a.localeCompare(b, "id"));
  }, [riruProvinces]);

  const provData = useMemo(() => {
    return mergedData.filter((d) => d.provinsi === selectedProvince && d.tahun >= startYear && d.tahun <= endYear);
  }, [mergedData, selectedProvince, startYear, endYear]);

  const profile = provinces.find((p) => p.provinsi === selectedProvince);
  const riru = riruProvinces.find((p) => p.provinsi === selectedProvince);

  // Aggregates for selected range
  const totalInv = useMemo(() => provData.reduce((acc, d) => acc + d.investasi_total_milyar, 0), [provData]);
  const totalPma = useMemo(() => provData.reduce((acc, d) => acc + d.investasi_pma_milyar, 0), [provData]);
  const totalPmdn = useMemo(() => provData.reduce((acc, d) => acc + d.investasi_pmdn_milyar, 0), [provData]);
  const avgPdrbAdhb = useMemo(() => {
    if (!provData.length) return 0;
    return provData.reduce((acc, d) => acc + d.pdrb_adhb_milyar, 0) / provData.length;
  }, [provData]);

  return (
    <div className="space-y-8">
      {/* Page Title: Left-aligned, no badge pill */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
          <MapPin className="w-7 h-7 text-blue-900" />
          Profil Makroekonomi &amp; Kesiapan RIRU Daerah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Eksplorasi mendalam kinerja investasi modal, PDRB, ekspor, efisiensi ICOR, serta kesiapan Regional Investor Relations Unit (RIRU) per provinsi periode 2015&ndash;2026.
        </p>
      </div>

      {/* Single Province Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
            <span>Pilih Provinsi:</span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2 border border-slate-300 text-xs font-bold focus:border-blue-700 outline-none"
            >
              {provList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Range Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 border-l border-slate-200 pl-4">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Periode:</span>
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="bg-slate-50 text-slate-900 rounded-lg px-2 py-1 border border-slate-300 text-xs font-bold"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span>s.d.</span>
            <select
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="bg-slate-50 text-slate-900 rounded-lg px-2 py-1 border border-slate-300 text-xs font-bold"
            >
              {yearsList.filter((y) => y >= startYear).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>


      </div>

      {/* Hero Province Banner */}
      {riru && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0b192e] via-blue-950 to-slate-900 text-white shadow-lg space-y-4 border border-blue-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Profil Daerah &bull; Wilayah Pulau {riru.pulau}
              </span>
              <h2 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
                {selectedProvince}
                <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white font-bold">
                  Peringkat #{riru.rank} Kesiapan RIRU
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black">
                  Skor RIRU: {riru.riru_score}/100
                </span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold">Klasifikasi Matriks Kesiapan:</span>
              <p className="text-base font-extrabold text-amber-300">{riru.kuadran}</p>
            </div>
          </div>

          {/* 6 Key Macro Indicators Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">1. Investasi Terpilih:</span>
              <p className="font-extrabold text-white text-base mt-1">{formatRupiah(totalInv)}</p>
              <span className="text-[10px] text-blue-400">PMA: {totalInv > 0 ? Math.round((totalPma/totalInv)*100) : 0}% | PMDN: {totalInv > 0 ? Math.round((totalPmdn/totalInv)*100) : 0}%</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">2. Rata-rata PDRB:</span>
              <p className="font-extrabold text-white text-base mt-1">{formatRupiah(avgPdrbAdhb * 4)}/th</p>
              <span className="text-[10px] text-emerald-400">Harga Berlaku (ADHB)</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">3. Nilai Ekspor:</span>
              <p className="font-extrabold text-white text-base mt-1">${riru.avg_ekspor_tahunan_usd_juta} Jt/th</p>
              <span className="text-[10px] text-amber-400">Daya saing pasar global</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">4. Kesempatan Kerja:</span>
              <p className="font-extrabold text-white text-base mt-1">{riru.tkk_pct}% (TKK)</p>
              <span className="text-[10px] text-purple-400">TPT: {riru.tpt_pct}%</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">5. Efisiensi ICOR:</span>
              <p className="font-extrabold text-white text-base mt-1">{riru.avg_icor}</p>
              <span className="text-[10px] text-cyan-400">{riru.avg_icor <= 6.0 ? "Sangat Efisien" : "Capital-Intensive"}</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 relative group cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">6. Sektor Dominan:</span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-400 transition-colors">Arahkan kursor &rarr;</span>
              </div>
              <p 
                className="font-extrabold text-white text-sm mt-1 truncate group-hover:text-amber-300 transition-colors"
                title={riru.sektor_dominan}
              >
                {riru.sektor_dominan}
              </p>
              <span className="text-[10px] text-rose-400 font-semibold">Pangsa PDRB: {riru.porsi_sektor_dominan_pct}%</span>

              {/* Hovering Popover Card */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 p-3 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 max-w-xs pointer-events-none animate-in fade-in">
                <div className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">Nama Sektor Lengkap:</div>
                <div className="text-white text-xs font-bold leading-snug">{riru.sektor_dominan}</div>
                <div className="text-slate-300 text-[10px] mt-1.5 pt-1.5 border-t border-slate-800 flex justify-between">
                  <span>Kontribusi PDRB:</span>
                  <span className="text-amber-400 font-bold">{riru.porsi_sektor_dominan_pct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic RIRU Policy Recommendation */}
          <div className="p-3.5 bg-blue-950/80 rounded-xl border border-blue-800/60 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Rekomendasi Kebijakan RIRU untuk {selectedProvince}:</strong>{" "}
              <span className="text-slate-200">{riru.rekomendasi_riru}</span>
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart & Time Series Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RIRURadarChart province={selectedProvince} />
        <DualAxisChart
          data={provData}
          title={`Dinamika Investasi vs PDRB: ${selectedProvince}`}
          pdrbType={pdrbBasis}
        />
      </div>

      {/* National 4 Quadrants Strategic RIRU Matrix */}
      <RIRUMatrix />
    </div>
  );
}
