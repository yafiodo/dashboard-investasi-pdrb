"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import { formatRupiah } from "@/lib/dataProcessor";

interface ScatterQuadrantProps {
  provinces: {
    provinsi: string;
    region: string;
    avg_rasio_investasi_pdrb: number;
    total_investasi_kumulatif_milyar: number;
    latest_pdrb_adhb_milyar: number;
    rank_investasi: number;
  }[];
}

export default function ScatterQuadrant({ provinces }: ScatterQuadrantProps) {
  // Region colors
  const regionColors: { [key: string]: string } = {
    Jawa: "#3b82f6",
    Sumatera: "#10b981",
    Kalimantan: "#f59e0b",
    Sulawesi: "#ec4899",
    "Bali & Nusa Tenggara": "#8b5cf6",
    "Maluku & Papua": "#06b6d4",
    Lainnya: "#94a3b8",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-white">{data.provinsi}</p>
          <p className="text-slate-400">Wilayah: <span className="text-slate-200">{data.region}</span></p>
          <p className="text-slate-400">Rasio Investasi/PDRB: <span className="font-semibold text-emerald-400">{data.avg_rasio_investasi_pdrb}%</span></p>
          <p className="text-slate-400">Total Investasi: <span className="font-semibold text-blue-400">{formatRupiah(data.total_investasi_kumulatif_milyar)}</span></p>
          <p className="text-slate-400">PDRB Terbaru: <span className="font-semibold text-purple-400">{formatRupiah(data.latest_pdrb_adhb_milyar)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-bold text-base text-white">Matriks Kuadran 38 Provinsi</h3>
          <p className="text-xs text-slate-400">
            Sumbu X: Rata-rata Rasio Investasi/PDRB (%) &bull; Sumbu Y: Total Investasi Kumulatif
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(regionColors).slice(0, 6).map(([reg, col]) => (
            <div key={reg} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
              <span className="text-slate-300">{reg}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              type="number"
              dataKey="avg_rasio_investasi_pdrb"
              name="Rasio Investasi/PDRB"
              unit="%"
              stroke="#94a3b8"
              fontSize={11}
            />
            <YAxis
              type="number"
              dataKey="total_investasi_kumulatif_milyar"
              name="Total Investasi"
              stroke="#94a3b8"
              fontSize={11}
              tickFormatter={(v) => formatRupiah(v)}
            />
            <ZAxis type="number" dataKey="latest_pdrb_adhb_milyar" range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={15} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Benchmark Rasio 15%", fill: "#94a3b8", fontSize: 10 }} />
            <ReferenceLine y={200000} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Rp 200 T", fill: "#94a3b8", fontSize: 10 }} />
            <Scatter name="Provinsi" data={provinces} fill="#3b82f6">
              {provinces.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={regionColors[entry.region] || "#3b82f6"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <span className="font-semibold text-blue-400">Kuadran I (High Inv - High Ratio)</span>
          <p className="text-slate-400 mt-0.5">Episentrum Hilirisasi & Proyek Padat Modal (Sulteng, Malut, Jabar).</p>
        </div>
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <span className="font-semibold text-purple-400">Kuadran II (High Inv - Giant PDRB)</span>
          <p className="text-slate-400 mt-0.5">Perekonomian Raksasa & Pusat Finansial (DKI Jakarta, Jatim).</p>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="font-semibold text-emerald-400">Kuadran III (High Ratio - Emerging)</span>
          <p className="text-slate-400 mt-0.5">Kawasan Pertumbuhan Cepat Luar Jawa (Kaltara, Sultra).</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="font-semibold text-amber-400">Kuadran IV (Stimulus Needed)</span>
          <p className="text-slate-400 mt-0.5">Perlu Dorongan Insentif & Infrastruktur Pendukung.</p>
        </div>
      </div>
    </div>
  );
}
