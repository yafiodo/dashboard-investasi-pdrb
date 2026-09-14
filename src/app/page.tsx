"use client";

import riruDataRaw from "@/data/riru_readiness_data.json";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import provinceProfilesRaw from "@/data/province_profiles.json";
import newsDataRaw from "@/data/news_data.json";
import { MergedRecord, ProvinceProfile, NewsItem } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import MetricCard from "@/components/MetricCard";
import DualAxisChart from "@/components/DualAxisChart";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  ArrowRight, 
  Sparkles,
  Award,
  Globe2,
  Calendar,
  Filter
} from "lucide-react";

export default function HomePage() {
  const mergedData = mergedDataRaw as MergedRecord[];
  const provinces = provinceProfilesRaw as ProvinceProfile[];
  const news = newsDataRaw as NewsItem[];

  // Year Range Filter (Dari kapan s.d. kapan)
  const [startYear, setStartYear] = useState<number>(2015);
  const [endYear, setEndYear] = useState<number>(2026);
  const [selectedRegion, setSelectedRegion] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"triwulanan" | "tahunan">("triwulanan");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Semua");

  const yearsList = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const regionsList = ["Semua", "Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali & Nusa Tenggara", "Maluku & Papua"];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return mergedData.filter((item) => {
      if (item.tahun < startYear || item.tahun > endYear) return false;
      if (selectedRegion !== "Semua" && item.region !== selectedRegion) return false;
      if (selectedQuarter !== "Semua" && `Q${item.triwulan}` !== selectedQuarter) return false;
      return true;
    });
  }, [startYear, endYear, selectedRegion, selectedQuarter, mergedData]);

  // Macro Totals
  const totalInvestasiMilyar = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + cur.investasi_total_milyar, 0);
  }, [filteredData]);

  const totalPmaMilyar = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + cur.investasi_pma_milyar, 0);
  }, [filteredData]);

  const totalPmdnMilyar = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + cur.investasi_pmdn_milyar, 0);
  }, [filteredData]);

  const totalPdrbAdhbMilyar = useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + cur.pdrb_adhb_milyar, 0);
  }, [filteredData]);

  const avgRasio = useMemo(() => {
    if (totalPdrbAdhbMilyar <= 0) return 0;
    return Number(((totalInvestasiMilyar / totalPdrbAdhbMilyar) * 100).toFixed(2));
  }, [totalInvestasiMilyar, totalPdrbAdhbMilyar]);

  // Aggregate time series: either Quarterly or Annual Sum
  const timeSeriesData = useMemo(() => {
    if (viewMode === "tahunan") {
      const yearMap: { [key: number]: any } = {};
      filteredData.forEach((item) => {
        const y = item.tahun;
        if (!yearMap[y]) {
          yearMap[y] = {
            periode: `Tahun ${y}`,
            tahun: y,
            investasi_total_milyar: 0,
            pdrb_adhb_milyar: 0,
            pdrb_adhk_milyar: 0,
          };
        }
        yearMap[y].investasi_total_milyar += item.investasi_total_milyar;
        yearMap[y].pdrb_adhb_milyar += item.pdrb_adhb_milyar;
        yearMap[y].pdrb_adhk_milyar += item.pdrb_adhk_milyar;
      });
      return Object.values(yearMap).sort((a, b) => a.tahun - b.tahun);
    } else {
      // Triwulanan aggregation
      const qMap: { [key: string]: any } = {};
      filteredData.forEach((item) => {
        const p = item.periode;
        if (!qMap[p]) {
          qMap[p] = {
            periode: p,
            tahun: item.tahun,
            triwulan: item.triwulan,
            investasi_total_milyar: 0,
            pdrb_adhb_milyar: 0,
            pdrb_adhk_milyar: 0,
          };
        }
        qMap[p].investasi_total_milyar += item.investasi_total_milyar;
        qMap[p].pdrb_adhb_milyar += item.pdrb_adhb_milyar;
        qMap[p].pdrb_adhk_milyar += item.pdrb_adhk_milyar;
      });
      return Object.values(qMap).sort((a, b) => a.tahun - b.tahun || a.triwulan - b.triwulan);
    }
  }, [filteredData, viewMode]);

  // Top 5 Provinces
  const topProvinces = useMemo(() => {
    return provinces.slice(0, 5);
  }, [provinces]);

  return (
    <div className="space-y-8">
      {/* Hero Banner: Navy with Gold Accents */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b192e] via-[#0f2444] to-[#1e3a8a] border border-slate-700 p-6 sm:p-10 shadow-lg text-white">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Intelligence Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Monitoring Komparasi Realisasi Investasi &amp; PDRB Provinsi
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Menyelaraskan data realisasi investasi Kementerian Investasi/BKPM (PMA &amp; PMDN) dengan indikator capaian PDRB Badan Pusat Statistik (BPS) di 38 provinsi Indonesia (2015&ndash;2026).
          </p>
        </div>

        {/* Global Filter Bar with Range (Dari s.d.) and Quarter */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Range Tahun */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Dari Tahun:</span>
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="bg-slate-800 text-white rounded-lg px-2.5 py-1.5 border border-slate-600 focus:outline-none focus:border-amber-400 text-xs font-bold"
              >
                {yearsList.map((y) => (
                  <option key={`start-${y}`} value={y} disabled={y > endYear}>
                    {y}
                  </option>
                ))}
              </select>
              <span>s.d.</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="bg-slate-800 text-white rounded-lg px-2.5 py-1.5 border border-slate-600 focus:outline-none focus:border-amber-400 text-xs font-bold"
              >
                {yearsList.map((y) => (
                  <option key={`end-${y}`} value={y} disabled={y < startYear}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Wilayah:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:border-amber-400 text-xs font-bold"
              >
                {regionsList.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ai-analyst"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Tanya AI Analyst
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Realisasi Investasi"
          value={formatRupiah(totalInvestasiMilyar)}
          subValue={`PMA: ${formatRupiah(totalPmaMilyar)} | PMDN: ${formatRupiah(totalPmdnMilyar)}`}
          icon={<DollarSign className="w-5 h-5 text-blue-900" />}
          badgeText={`BKPM ${startYear}-${endYear}`}
        />

        <MetricCard
          title="Total Nilai PDRB (ADHB)"
          value={formatRupiah(totalPdrbAdhbMilyar)}
          subValue="Agregat PDRB Harga Berlaku"
          icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
          badgeText="BPS Seri 2010"
        />

        <MetricCard
          title="Rasio Rata-rata Inv/PDRB"
          value={`${avgRasio}%`}
          subValue="Efisiensi Pembentukan Modal"
          icon={<PieChart className="w-5 h-5 text-amber-700" />}
          badgeText="ICOR Proxy"
        />

        <MetricCard
          title="Komposisi Modal Asing (PMA)"
          value={`${totalInvestasiMilyar > 0 ? ((totalPmaMilyar / totalInvestasiMilyar) * 100).toFixed(1) : 0}%`}
          subValue={`PMDN: ${totalInvestasiMilyar > 0 ? ((totalPmdnMilyar / totalInvestasiMilyar) * 100).toFixed(1) : 0}%`}
          icon={<Globe2 className="w-5 h-5 text-indigo-900" />}
          badgeText="PMA vs PMDN"
        />
      </div>

      {/* Main Chart with Quarterly & Annual Toggle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Tampilan Dinamika:</span>
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("triwulanan")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "triwulanan"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Triwulanan (Q1 - Q4)
              </button>
              <button
                onClick={() => setViewMode("tahunan")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "tahunan"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tahunan (Kumulatif 1 Tahun)
              </button>
            </div>
          </div>

          {viewMode === "triwulanan" && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Filter Kuartal:</span>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-slate-50 text-slate-800 rounded-lg px-2.5 py-1 border border-slate-300 text-xs font-bold"
              >
                <option value="Semua">Semua Kuartal</option>
                <option value="Q1">Hanya Q1</option>
                <option value="Q2">Hanya Q2</option>
                <option value="Q3">Hanya Q3</option>
                <option value="Q4">Hanya Q4</option>
              </select>
            </div>
          )}
        </div>

        <DualAxisChart
          data={timeSeriesData}
          title={`Dinamika Realisasi Investasi vs PDRB (${viewMode === "tahunan" ? "Tahunan" : "Triwulanan"} Periode ${startYear} - ${endYear})`}
        />
      </div>

      {/* Top 5 Provinces Table & AI Insight Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Provinces Card: Fixed Link to Data Explorer! */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0f172a] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top 5 Provinsi dengan Realisasi Investasi Terbesar
              </h3>
              <p className="text-xs text-slate-500 font-medium">Peringkat kumulatif nasional 2015&ndash;2026</p>
            </div>
            {/* POINT 1 FIXED: Points directly to /data-explorer */}
            <Link
              href="/data-explorer"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
            >
              <span>Lihat Semua 38 Provinsi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Rank Inv</th>
                  <th className="py-3 px-3">Provinsi</th>
                  <th className="py-3 px-3">Wilayah</th>
                  <th className="py-3 px-3">Total Investasi</th>
                  <th className="py-3 px-3">PDRB Terkini</th>
                  <th className="py-3 px-3">Rasio Inv/PDRB</th>
                  <th className="py-3 px-3">Skor RIRU</th>
                  <th className="py-3 px-3">Rank RIRU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProvinces.map((prov) => {
                  const riruMatch = riruDataRaw.provinces.find((r) => r.provinsi === prov.provinsi);
                  return (
                    <tr key={prov.provinsi} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-extrabold text-amber-600">#{prov.rank_investasi}</td>
                      <td className="py-3 px-3 font-bold text-[#0f172a]">{prov.provinsi}</td>
                      <td className="py-3 px-3 text-slate-500">{prov.region}</td>
                      <td className="py-3 px-3 font-extrabold text-blue-800">{formatRupiah(prov.total_investasi_kumulatif_milyar)}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{formatRupiah(prov.latest_pdrb_adhb_milyar)}</td>
                      <td className="py-3 px-3 font-black text-amber-700">{prov.avg_rasio_investasi_pdrb}%</td>
                      <td className="py-3 px-3 font-extrabold text-blue-900">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                          {riruMatch?.riru_score || "-"}/100
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">#{riruMatch?.rank || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Box (Light Navy & Gold Card) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0b192e] to-[#0f2444] border border-slate-700 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              AI Insight Makroekonomi
            </div>
            <h4 className="font-extrabold text-white text-base mb-2">
              Pergeseran Kutub Investasi ke Luar Jawa
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              Analisis korelasi data BKPM dan BPS membuktikan bahwa provinsi dengan rasio investasi terhadap PDRB tertinggi berada di luar Pulau Jawa: Sulawesi Tengah dan Maluku Utara.
              <br /><br />
              Hilirisasi industri mineral logam dasar memicu akselerasi PDRB riil sektor industri pengolahan hingga di atas 15&ndash;20% YoY, jauh melampaui rata-rata pertumbuhan nasional.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <Link
              href="/ai-analyst"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Mulai Analisis Mendalam dengan AI &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Investment News Section with Clickable Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-[#0f172a]">Berita &amp; Kebijakan Investasi Terkini</h3>
            <p className="text-xs text-slate-500 font-medium">Informasi strategis dari portal resmi pemerintah dan media ekonomi terpercaya</p>
          </div>
          <Link href="/berita" className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
            Lihat Semua Berita <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.slice(0, 3).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
