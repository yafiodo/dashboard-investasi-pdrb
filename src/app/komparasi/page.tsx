"use client";

import { useState, useMemo } from "react";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import provinceProfilesRaw from "@/data/province_profiles.json";
import { MergedRecord, ProvinceProfile } from "@/types";
import { formatRupiah, calculateCorrelation } from "@/lib/dataProcessor";
import DualAxisChart from "@/components/DualAxisChart";
import ScatterQuadrant from "@/components/ScatterQuadrant";
import { 
  GitCompare
} from "lucide-react";

export default function KomparasiPage() {
  const mergedData = mergedDataRaw as MergedRecord[];
  const provinces = provinceProfilesRaw as ProvinceProfile[];

  const [provinceA, setProvinceA] = useState<string>("Sulawesi Tengah");
  const [provinceB, setProvinceB] = useState<string>("Jawa Barat");
  const [pdrbBasis, setPdrbBasis] = useState<"adhb" | "adhk">("adhb");

  const provList = useMemo(() => provinces.map((p) => p.provinsi), [provinces]);

  const dataA = useMemo(() => {
    return mergedData.filter((d) => d.provinsi === provinceA);
  }, [mergedData, provinceA]);

  const dataB = useMemo(() => {
    return mergedData.filter((d) => d.provinsi === provinceB);
  }, [mergedData, provinceB]);

  const profileA = provinces.find((p) => p.provinsi === provinceA);
  const profileB = provinces.find((p) => p.provinsi === provinceB);

  // Correlation Investasi vs PDRB
  const corrA = useMemo(() => {
    const inv = dataA.map((d) => d.investasi_total_milyar);
    const pdrb = dataA.map((d) => (pdrbBasis === "adhb" ? d.pdrb_adhb_milyar : d.pdrb_adhk_milyar));
    return calculateCorrelation(inv, pdrb);
  }, [dataA, pdrbBasis]);

  const corrB = useMemo(() => {
    const inv = dataB.map((d) => d.investasi_total_milyar);
    const pdrb = dataB.map((d) => (pdrbBasis === "adhb" ? d.pdrb_adhb_milyar : d.pdrb_adhk_milyar));
    return calculateCorrelation(inv, pdrb);
  }, [dataB, pdrbBasis]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <GitCompare className="w-7 h-7 text-blue-400" />
          Komparasi Mendalam: Realisasi Investasi vs Capaian PDRB
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Bandingkan trajektori pembentukan modal, korelasi pertumbuhan, serta efisiensi rasio investasi/PDRB antar provinsi.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span>Provinsi A:</span>
            <select
              value={provinceA}
              onChange={(e) => setProvinceA(e.target.value)}
              className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 text-xs font-medium focus:border-blue-500"
            >
              {provList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <span className="text-slate-600 font-bold text-xs">&times; vs &times;</span>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span>Provinsi B:</span>
            <select
              value={provinceB}
              onChange={(e) => setProvinceB(e.target.value)}
              className="bg-slate-800 text-white rounded-lg px-3 py-1.5 border border-slate-700 text-xs font-medium focus:border-emerald-500"
            >
              {provList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Basis Harga PDRB:</span>
          <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => setPdrbBasis("adhb")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                pdrbBasis === "adhb" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Harga Berlaku (ADHB)
            </button>
            <button
              onClick={() => setPdrbBasis("adhk")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                pdrbBasis === "adhk" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Harga Konstan 2010 (ADHK)
            </button>
          </div>
        </div>
      </div>

      {/* Comparative Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Province A Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-900/20 to-slate-900/80 border border-blue-500/30 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-white text-blue-300">{provinceA}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">
              Rank #{profileA?.rank_investasi}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Total Investasi Kumulatif:</span>
              <p className="text-base font-bold text-blue-400 mt-1">{formatRupiah(profileA?.total_investasi_kumulatif_milyar || 0)}</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">PDRB Nominal Terkini:</span>
              <p className="text-base font-bold text-emerald-400 mt-1">{formatRupiah(profileA?.latest_pdrb_adhb_milyar || 0)}</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Rata-rata Rasio Inv/PDRB:</span>
              <p className="text-base font-bold text-amber-400 mt-1">{profileA?.avg_rasio_investasi_pdrb}%</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Korelasi Investasi &times; PDRB:</span>
              <p className="text-base font-bold text-purple-400 mt-1">r = {corrA}</p>
            </div>
          </div>
        </div>

        {/* Province B Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-900/20 to-slate-900/80 border border-emerald-500/30 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-white text-emerald-300">{provinceB}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Rank #{profileB?.rank_investasi}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Total Investasi Kumulatif:</span>
              <p className="text-base font-bold text-blue-400 mt-1">{formatRupiah(profileB?.total_investasi_kumulatif_milyar || 0)}</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">PDRB Nominal Terkini:</span>
              <p className="text-base font-bold text-emerald-400 mt-1">{formatRupiah(profileB?.latest_pdrb_adhb_milyar || 0)}</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Rata-rata Rasio Inv/PDRB:</span>
              <p className="text-base font-bold text-amber-400 mt-1">{profileB?.avg_rasio_investasi_pdrb}%</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl">
              <span className="text-slate-400">Korelasi Investasi &times; PDRB:</span>
              <p className="text-base font-bold text-purple-400 mt-1">r = {corrB}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DualAxisChart
          data={dataA}
          title={`Tren ${provinceA} (Investasi vs PDRB)`}
          pdrbType={pdrbBasis}
        />
        <DualAxisChart
          data={dataB}
          title={`Tren ${provinceB} (Investasi vs PDRB)`}
          pdrbType={pdrbBasis}
        />
      </div>

      {/* Scatter Quadrant Component */}
      <ScatterQuadrant provinces={provinces} />
    </div>
  );
}
