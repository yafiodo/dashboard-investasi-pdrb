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
  // Top 10 BKPM Sectors
  const topBkpm = sectorData.bkpm_sectors.slice(0, 8).map((s) => ({
    name: s.nama_sektor || "",
    pma: s.pma_milyar || 0,
    pmdn: s.pmdn_milyar || 0,
    total: s.total_investasi_milyar || 0,
    kategori: s.sektor_utama || "Primer",
  }));

  // Top 8 BPS Sectors
  const topBps = sectorData.bps_sectors.slice(0, 8).map((s) => ({
    name: s.sektor || "",
    pdrb: s.total_pdrb_adhb_milyar || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-white border-b border-slate-700 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`s-${index}`} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-white">{formatRupiah(entry.value)}</span>
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Temuan Hilirisasi Sektor Strategis
        </div>
        <h4 className="text-lg font-bold text-white mb-2">
          Industri Logam Dasar & Pertambangan Mendominasi Aliran PMA
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Data BKPM menunjukkan bahwa sektor <strong>Industri Logam Dasar, Barang Logam, Bukan Mesin dan Peralatannya</strong> serta 
          <strong> Pertambangan</strong> mencatat realisasi investasi kumulatif terbesar (melebihi Rp 1.000 Triliun) dengan porsi PMA 
          mencapai lebih dari 75%. Hal ini berkorelasi langsung dengan lonjakan <strong>PDRB Industri Pengolahan</strong> pada data BPS di 
          provinsi-provinsi sentra hilirisasi nikel dan temaga seperti Sulawesi Tengah, Maluku Utara, dan Jawa Timur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: BKPM Sektor */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Factory className="w-4 h-4 text-blue-400" />
                Top Sektor Realisasi Investasi (BKPM)
              </h4>
              <p className="text-xs text-slate-400">PMA vs PMDN Kumulatif 2015-2026</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBkpm} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => formatRupiah(v)} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pma" name="PMA" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pmdn" name="PMDN" fill="#10b981" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: BPS Lapangan Usaha */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                Top Lapangan Usaha PDRB (BPS)
              </h4>
              <p className="text-xs text-slate-400">Total Nominal PDRB ADHB Kumulatif Nasional</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBps} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => formatRupiah(v)} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pdrb" name="PDRB (Harga Berlaku)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
