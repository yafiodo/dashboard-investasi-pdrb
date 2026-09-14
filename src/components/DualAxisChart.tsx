"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatRupiah } from "@/lib/dataProcessor";

interface DualAxisChartProps {
  data: {
    periode: string;
    investasi_total_milyar: number;
    pdrb_adhb_milyar?: number;
    pdrb_adhk_milyar?: number;
    rasio_investasi_pdrb?: number;
  }[];
  title?: string;
  pdrbType?: "adhb" | "adhk";
}

export default function DualAxisChart({
  data,
  title = "Tren Realisasi Investasi vs PDRB",
  pdrbType = "adhb",
}: DualAxisChartProps) {
  const pdrbKey = pdrbType === "adhb" ? "pdrb_adhb_milyar" : "pdrb_adhk_milyar";
  const pdrbLabel = pdrbType === "adhb" ? "PDRB (Harga Berlaku)" : "PDRB (Harga Konstan)";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl text-xs space-y-1.5 z-50">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {entry.name.includes("Rasio")
                  ? `${entry.value}%`
                  : formatRupiah(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-bold text-base text-white">{title}</h3>
          <p className="text-xs text-slate-400">
            Batang: Realisasi Investasi BKPM &bull; Garis: Capaian PDRB BPS
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
            <span className="text-slate-300">Investasi (Sumbu Kiri)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300">{pdrbLabel} (Sumbu Kanan)</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="periode"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={45}
            />
            {/* Left Y Axis for Investasi */}
            <YAxis
              yAxisId="left"
              stroke="#60a5fa"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => formatRupiah(val)}
            />
            {/* Right Y Axis for PDRB */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#34d399"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => formatRupiah(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Bar
              yAxisId="left"
              dataKey="investasi_total_milyar"
              name="Realisasi Investasi"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={pdrbKey}
              name={pdrbLabel}
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
