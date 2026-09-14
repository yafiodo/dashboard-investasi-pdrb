"use client";

import provinceProfilesRaw from "@/data/province_profiles.json";
import { ProvinceProfile } from "@/types";
import AIChatBox from "@/components/AIChatBox";
import { Bot, Sparkles, Lightbulb } from "lucide-react";

export default function AIAnalystPage() {
  const provinces = provinceProfilesRaw as ProvinceProfile[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
          <Bot className="w-7 h-7 text-amber-600" />
          AI Economic Intelligence &amp; Analytical Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Ditenagai model analitis makroekonomi untuk menggali korelasi investasi dan PDRB, mendeteksi anomali pertumbuhan, serta menyusun ringkasan eksekutif instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIChatBox provinces={provinces} />
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="font-extrabold text-sm text-[#0f172a] flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Topik Populer untuk Dianalisis
            </h4>
            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-900">1. Akselerasi Hilirisasi Mineral</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Dampak investasi smelter nikel terhadap PDRB industri di Morowali &amp; Halmahera.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-800">2. Multiplier Effect IKN Nusantara</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Pengaruh aliran PMDN sektor konstruksi terhadap PDRB Kalimantan Timur.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-amber-800">3. Efisiensi Investasi Jawa vs Luar Jawa</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Perbandingan rasio investasi/PDRB dan ICOR antara koridor barat dan timur.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950 to-slate-900 border border-slate-800 text-white shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-xs">
              <Sparkles className="w-4 h-4" />
              Tentang Mesin Analitis
            </div>
            <p className="text-slate-300 leading-relaxed font-normal">
              Sistem ini memproses lebih dari 57.000 titik data BPS dan 639.000+ catatan mikro BKPM untuk menghitung korelasi Pearson, elastisitas modal, serta kontribusi sektoral secara deterministik dan objektif tanpa rekaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
