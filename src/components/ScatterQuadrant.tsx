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
  const regionColors: { [key: string]: string } = {
    Jawa: "#1e3a8a",
    Sumatera: "#059669",
    Kalimantan: "#d97706",
    Sulawesi: "#db2777",
    "Bali & Nusa Tenggara": "#7c3aed",
    "Maluku & Papua": "#0284c7",
    Lainnya: "#64748b",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-extrabold text-[#0f172a]">{data.provinsi}</p>
          <p className="text-slate-500">Wilayah: <span className="font-semibold text-slate-800">{data.region}</span></p>
          <p className="text-slate-500">Rasio Investasi/PDRB: <span className="font-bold text-amber-700">{data.avg_rasio_investasi_pdrb}%</span></p>
          <p className="text-slate-500">Total Investasi: <span className="font-bold text-blue-800">{formatRupiah(data.total_investasi_kumulatif_milyar)}</span></p>
          <p className="text-slate-500">PDRB Terkini: <span className="font-bold text-emerald-700">{formatRupiah(data.latest_pdrb_adhb_milyar)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-extrabold text-base text-[#0f172a]">Matriks Kuadran 38 Provinsi</h3>
          <p className="text-xs text-slate-500 font-medium">
            Sumbu X: Rata-rata Rasio Investasi/PDRB (%) &bull; Sumbu Y: Total Investasi Kumulatif
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(regionColors).slice(0, 6).map(([reg, col]) => (
            <div key={reg} className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
              <span className="text-slate-700">{reg}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="avg_rasio_investasi_pdrb"
              name="Rasio Investasi/PDRB"
              unit="%"
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="number"
              dataKey="total_investasi_kumulatif_milyar"
              name="Total Investasi"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => formatRupiah(v)}
            />
            <ZAxis type="number" dataKey="latest_pdrb_adhb_milyar" range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={15} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Benchmark Rasio 15%", fill: "#64748b", fontSize: 10 }} />
            <ReferenceLine y={200000} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Rp 200 T", fill: "#64748b", fontSize: 10 }} />
            <Scatter name="Provinsi" data={provinces} fill="#1e3a8a">
              {provinces.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={regionColors[entry.region] || "#1e3a8a"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <span className="font-bold text-blue-900">Kuadran I (High Inv - High Ratio)</span>
          <p className="text-slate-600 mt-0.5">Episentrum Hilirisasi &amp; Padat Modal (Sulteng, Malut, Jabar).</p>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <span className="font-bold text-purple-900">Kuadran II (High Inv - Giant PDRB)</span>
          <p className="text-slate-600 mt-0.5">Perekonomian Raksasa &amp; Pusat Jasa (DKI Jakarta, Jatim).</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="font-bold text-emerald-900">Kuadran III (High Ratio - Emerging)</span>
          <p className="text-slate-600 mt-0.5">Kawasan Pertumbuhan Cepat Luar Jawa (Kaltara, Sultra).</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="font-bold text-amber-900">Kuadran IV (Stimulus Needed)</span>
          <p className="text-slate-600 mt-0.5">Perlu Dorongan Insentif &amp; Infrastruktur Pendukung.</p>
        </div>
      </div>
    </div>
  );
}
