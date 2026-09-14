"use client";

import { SectorComparison } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { Factory, Landmark, Sparkles } from "lucide-react";

interface SektorHeatmapProps {
  sectorData: SectorComparison;
}

export default function SektorHeatmap({ sectorData }: SektorHeatmapProps) {
  const topBkpm = sectorData.bkpm_sectors.slice(0, 8).map((s) => ({
    name: s.nama_sektor || "",
    pma: s.pma_milyar || 0,
    pmdn: s.pmdn_milyar || 0,
    total: s.total_investasi_milyar || 0,
    kategori: s.sektor_utama || "Primer",
  }));

  const topBps = sectorData.bps_sectors.slice(0, 8).map((s) => ({
    name: s.sektor || "",
    pdrb: s.total_pdrb_adhb_milyar || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`s-${index}`} className="flex justify-between gap-4">
              <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
              <span className="font-bold text-slate-900">{formatRupiah(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hilirisasi Highlights */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Temuan Hilirisasi Sektor Strategis
        </div>
        <h4 className="text-xl font-black text-white mb-2">
          Industri Logam Dasar &amp; Pertambangan Mendominasi Aliran Investasi PMA
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl font-normal">
          Data BKPM menunjukkan sektor <strong>Industri Logam Dasar, Barang Logam, Bukan Mesin dan Peralatannya</strong> serta 
          <strong> Pertambangan</strong> mencatat realisasi kumulatif terbesar (melebihi Rp 1.000 Triliun) dengan porsi PMA 
          mencapai lebih dari 75%. Hal ini selaras dengan data BPS di mana <strong>PDRB Industri Pengolahan</strong> menjadi 
          lokomotif pertumbuhan tertinggi di provinsi sentra hilirisasi nikel dan temaga seperti Sulawesi Tengah dan Maluku Utara.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: BKPM Sektor */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-base text-[#0f172a] flex items-center gap-2">
                <Factory className="w-5 h-5 text-blue-800" />
                Top Sektor Realisasi Investasi (BKPM)
              </h4>
              <p className="text-xs text-slate-500 font-medium">PMA vs PMDN Kumulatif 2015-2026</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBkpm} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => formatRupiah(v)} />
                <YAxis dataKey="name" type="category" stroke="#334155" fontSize={10} width={80} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pma" name="PMA" fill="#1e3a8a" stackId="a" />
                <Bar dataKey="pmdn" name="PMDN" fill="#d97706" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: BPS Lapangan Usaha */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-base text-[#0f172a] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-700" />
                Top Lapangan Usaha PDRB (BPS)
              </h4>
              <p className="text-xs text-slate-500 font-medium">Total Nominal PDRB ADHB Kumulatif Nasional</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBps} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => formatRupiah(v)} />
                <YAxis dataKey="name" type="category" stroke="#334155" fontSize={10} width={80} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pdrb" name="PDRB (Harga Berlaku)" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
