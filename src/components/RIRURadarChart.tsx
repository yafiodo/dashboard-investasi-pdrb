"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import riruDataRaw from "@/data/riru_readiness_data.json";

interface RIRURadarChartProps {
  province: string;
}

export default function RIRURadarChart({ province }: RIRURadarChartProps) {
  const provinces = riruDataRaw.provinces;

  const prof = useMemo(() => provinces.find((p) => p.provinsi === province), [provinces, province]);

  const radarData = useMemo(() => {
    if (!prof) return [];
    return [
      {
        subject: "Investasi Modal",
        nilai: prof.scores.z_inv,
        benchmark: 50,
        fullMark: 100,
      },
      {
        subject: "Skala PDRB",
        nilai: prof.scores.z_pdrb,
        benchmark: 50,
        fullMark: 100,
      },
      {
        subject: "Daya Saing Ekspor",
        nilai: prof.scores.z_exp,
        benchmark: 50,
        fullMark: 100,
      },
      {
        subject: "Penyerapan Naker (TKK)",
        nilai: prof.scores.z_lab,
        benchmark: 50,
        fullMark: 100,
      },
      {
        subject: "Kematangan Sektor",
        nilai: prof.scores.z_sec,
        benchmark: 50,
        fullMark: 100,
      },
      {
        subject: "Efisiensi Modal (ICOR)",
        nilai: prof.scores.z_icor,
        benchmark: 50,
        fullMark: 100,
      },
    ];
  }, [prof]);

  if (!prof) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-[#0f172a]">
            Radar 6 Dimensi Kesiapan RIRU: {province}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Skor dinormalisasi (0 - 100) dibandingkan terhadap Benchmark Rata-rata Nasional (50)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-blue-900">
            <span className="w-3 h-3 rounded-full bg-blue-900" />
            {province} (Skor RIRU: {prof.riru_score})
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            Benchmark Nasional (50)
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" stroke="#334155" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
            <Radar
              name={province}
              dataKey="nilai"
              stroke="#1e3a8a"
              fill="#1e3a8a"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Benchmark Nasional"
              dataKey="benchmark"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
              strokeDasharray="3 3"
            />
            <Tooltip
              formatter={(value: any, name: any) => [`${value} / 100`, name]}
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "11px" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
