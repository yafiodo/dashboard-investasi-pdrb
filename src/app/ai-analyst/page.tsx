"use client";

import provinceProfilesRaw from "@/data/province_profiles.json";
import mergedDataRaw from "@/data/merged_investasi_pdrb.json";
import { ProvinceProfile, MergedRecord } from "@/types";
import AIChatBox from "@/components/AIChatBox";
import { Bot, Sparkles, Lightbulb } from "lucide-react";

export default function AIAnalystPage() {
  const provinces = provinceProfilesRaw as ProvinceProfile[];
  const mergedData = mergedDataRaw as MergedRecord[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Bot className="w-7 h-7 text-cyan-400" />
          AI Economic Intelligence &amp; Analytical Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Ditenagai model analitis makroekonomi untuk menggali korelasi investasi dan PDRB, mendeteksi anomali pertumbuhan, serta menyusun ringkasan eksekutif instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIChatBox provinces={provinces} mergedData={mergedData} />
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Topik Populer untuk Dianalisis
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-blue-400">1. Akselerasi Hilirisasi Mineral</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Dampak investasi smelter nikel terhadap PDRB industri di Morowali &amp; Halmahera.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-emerald-400">2. Multiplier Effect IKN Nusantara</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Pengaruh aliran PMDN sektor konstruksi terhadap PDRB Kalimantan Timur.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-purple-400">3. Efisiensi Investasi Jawa vs Luar Jawa</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Perbandingan rasio investasi/PDRB dan ICOR antara koridor barat dan timur.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900/60 border border-blue-500/20 shadow-xl text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-blue-400 text-xs mb-2">
              <Sparkles className="w-4 h-4" />
              Tentang Mesin Analitis
            </div>
            <p className="leading-relaxed">
              Sistem ini memproses lebih dari 57.000 titik data BPS dan 630.000+ catatan mikro BKPM untuk menghitung korelasi Pearson, elastisitas modal, serta kontribusi sektoral secara deterministik dan objektif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
