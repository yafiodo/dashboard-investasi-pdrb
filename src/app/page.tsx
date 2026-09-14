"use client";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import provinceProfilesRaw from "@/data/province_profiles.json";
import newsDataRaw from "@/data/news_data.json";
import { MergedRecord, ProvinceProfile, NewsItem } from "@/types";
import { formatRupiah, aggregateByPeriod } from "@/lib/dataProcessor";
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
  } from "lucide-react";

export default function HomePage() {
  const mergedData = mergedDataRaw as MergedRecord[];
  const provinces = provinceProfilesRaw as ProvinceProfile[];
  const news = newsDataRaw as NewsItem[];

  const [selectedYear, setSelectedYear] = useState<string>("Semua");
  const [selectedRegion, setSelectedRegion] = useState<string>("Semua");

  const yearsList = ["Semua", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
  const regionsList = ["Semua", "Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali & Nusa Tenggara", "Maluku & Papua"];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return mergedData.filter((item) => {
      if (selectedYear !== "Semua" && item.tahun.toString() !== selectedYear) return false;
      if (selectedRegion !== "Semua" && item.region !== selectedRegion) return false;
      return true;
    });
  }, [selectedYear, selectedRegion, mergedData]);

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

  // Aggregate time series for chart
  const timeSeriesData = useMemo(() => {
    return aggregateByPeriod(filteredData);
  }, [filteredData]);

  // Top 5 Provinces by Cumulative Investment
  const topProvinces = useMemo(() => {
    return provinces.slice(0, 5);
  }, [provinces]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Intelligence Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Monitoring Komparasi Realisasi Investasi &amp; PDRB Provinsi
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menyelaraskan data realisasi investasi Kementerian Investasi / BKPM (PMA &amp; PMDN) dengan indikator pertumbuhan PDRB Badan Pusat Statistik (BPS) 38 provinsi di Indonesia (2015&ndash;2026).
          </p>
        </div>

        {/* Global Filters */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Filter Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500 text-xs"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Wilayah Pulau:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500 text-xs"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
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
          icon={<DollarSign className="w-5 h-5 text-blue-400" />}
          badgeText="BKPM 2015-2026"
          color="blue"
        />

        <MetricCard
          title="Total Nilai PDRB (ADHB)"
          value={formatRupiah(totalPdrbAdhbMilyar)}
          subValue="Agregat PDRB Harga Berlaku"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          badgeText="BPS Seri 2010"
          color="emerald"
        />

        <MetricCard
          title="Rasio Rata-rata Inv/PDRB"
          value={`${avgRasio}%`}
          subValue="Efisiensi Pembentukan Modal"
          icon={<PieChart className="w-5 h-5 text-amber-400" />}
          badgeText="ICOR Proxy"
          color="amber"
        />

        <MetricCard
          title="Komposisi Modal Asing (PMA)"
          value={`${totalInvestasiMilyar > 0 ? ((totalPmaMilyar / totalInvestasiMilyar) * 100).toFixed(1) : 0}%`}
          subValue={`PMDN: ${totalInvestasiMilyar > 0 ? ((totalPmdnMilyar / totalInvestasiMilyar) * 100).toFixed(1) : 0}%`}
          icon={<Globe2 className="w-5 h-5 text-purple-400" />}
          badgeText="PMA vs PMDN"
          color="purple"
        />
      </div>

      {/* Main Chart: Time Series Investasi vs PDRB */}
      <div className="grid grid-cols-1 gap-6">
        <DualAxisChart
          data={timeSeriesData}
          title={`Dinamika Realisasi Investasi vs PDRB Nasional (${selectedYear === "Semua" ? "2015 - 2026" : selectedYear})`}
        />
      </div>

      {/* Top 5 Provinces & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Provinces */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Top 5 Provinsi dengan Realisasi Investasi Terbesar
              </h3>
              <p className="text-xs text-slate-400">Peringkat kumulatif 2015&ndash;2026</p>
            </div>
            <Link href="/komparasi" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Provinsi</th>
                  <th className="py-3 px-3">Wilayah</th>
                  <th className="py-3 px-3">Total Investasi</th>
                  <th className="py-3 px-3">PDRB Terkini</th>
                  <th className="py-3 px-3">Rasio Inv/PDRB</th>
                  <th className="py-3 px-3">PMA Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topProvinces.map((prov) => (
                  <tr key={prov.provinsi} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-400">#{prov.rank_investasi}</td>
                    <td className="py-3 px-3 font-semibold text-white">{prov.provinsi}</td>
                    <td className="py-3 px-3 text-slate-400">{prov.region}</td>
                    <td className="py-3 px-3 font-medium text-blue-400">{formatRupiah(prov.total_investasi_kumulatif_milyar)}</td>
                    <td className="py-3 px-3 text-emerald-400 font-medium">{formatRupiah(prov.latest_pdrb_adhb_milyar)}</td>
                    <td className="py-3 px-3 font-bold text-amber-400">{prov.avg_rasio_investasi_pdrb}%</td>
                    <td className="py-3 px-3">{prov.pma_share_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              AI Insight Makroekonomi
            </div>
            <h4 className="font-bold text-white text-base mb-2">
              Pergeseran Kutub Investasi ke Luar Jawa
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              Analisis korelasi data BKPM dan BPS membuktikan bahwa provinsi dengan rasio investasi terhadap PDRB tertinggi berada di luar Pulau Jawa: 
              <strong> Sulawesi Tengah</strong> dan <strong>Maluku Utara</strong>.
              <br /><br />
              Hilirisasi industri mineral logam dasar telah memicu percepatan pertumbuhan PDRB riil sektor industri pengolahan hingga di atas 15&ndash;20% YoY, jauh melampaui rata-rata pertumbuhan PDRB nasional.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              href="/ai-analyst"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              Mulai Analisis Mendalam dengan AI &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Investment News Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">Berita &amp; Kebijakan Investasi Terkini</h3>
            <p className="text-xs text-slate-400">Informasi strategis yang memengaruhi kinerja realisasi dan PDRB</p>
          </div>
          <Link href="/berita" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
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
