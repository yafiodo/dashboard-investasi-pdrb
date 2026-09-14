"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/dataProcessor";
import { ProvinceProfile } from "@/types";
import { Info, MapPin } from "lucide-react";

interface IndonesiaMapProps {
  provinces: ProvinceProfile[];
  onSelectProvince?: (prov: string) => void;
}

export default function IndonesiaMap({ provinces, onSelectProvince }: IndonesiaMapProps) {
  const [selectedMetric, setSelectedMetric] = useState<"investasi" | "pdrb" | "rasio">("investasi");
  const [hoveredProv, setHoveredProv] = useState<ProvinceProfile | null>(null);

  // Find max values for color scaling
  const maxInv = Math.max(...provinces.map((p) => p.total_investasi_kumulatif_milyar), 1);
  const maxPdrb = Math.max(...provinces.map((p) => p.latest_pdrb_adhb_milyar), 1);
  const maxRasio = Math.max(...provinces.map((p) => p.avg_rasio_investasi_pdrb), 1);

  const getColor = (prov: ProvinceProfile) => {
    let ratio = 0;
    if (selectedMetric === "investasi") {
      ratio = prov.total_investasi_kumulatif_milyar / maxInv;
      return `rgba(59, 130, 246, ${Math.max(0.15, ratio)})`; // Blue
    } else if (selectedMetric === "pdrb") {
      ratio = prov.latest_pdrb_adhb_milyar / maxPdrb;
      return `rgba(16, 185, 129, ${Math.max(0.15, ratio)})`; // Emerald
    } else {
      ratio = prov.avg_rasio_investasi_pdrb / maxRasio;
      return `rgba(245, 158, 11, ${Math.max(0.15, ratio)})`; // Amber
    }
  };

  // Convert lat/lng to SVG viewBox (Indonesia roughly lng 95..141, lat -11..6)
  const toSvgCoords = (lat: number, lng: number) => {
    const minLng = 94.5;
    const maxLng = 141.5;
    const minLat = -11.5;
    const maxLat = 6.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 30;
    return { x, y };
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Peta Spasial Sebaran 38 Provinsi Indonesia
          </h3>
          <p className="text-xs text-slate-400">
            Klik atau arahkan kursor ke titik provinsi untuk melihat rincian realisasi & capaian ekonomi.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => setSelectedMetric("investasi")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedMetric === "investasi"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Investasi (BKPM)
          </button>
          <button
            onClick={() => setSelectedMetric("pdrb")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedMetric === "pdrb"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            PDRB (BPS)
          </button>
          <button
            onClick={() => setSelectedMetric("rasio")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedMetric === "rasio"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Rasio Inv/PDRB (%)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[380px] bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        <svg viewBox="0 0 940 420" className="w-full h-full">
          {/* Island outline guides (stylized) */}
          <path
            d="M 50 120 Q 150 200 240 280 Q 200 300 150 220 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <path
            d="M 240 300 L 480 320 L 460 340 L 220 320 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <path
            d="M 330 180 Q 420 150 450 220 Q 360 260 330 180 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Interactive Province Nodes */}
          {provinces.map((prov) => {
            const { x, y } = toSvgCoords(prov.lat, prov.lng);
            const isHovered = hoveredProv?.provinsi === prov.provinsi;
            const radius = isHovered ? 16 : 10;

            return (
              <g
                key={prov.provinsi}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredProv(prov)}
                onClick={() => onSelectProvince && onSelectProvince(prov.provinsi)}
              >
                {/* Glow ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 6}
                  fill={getColor(prov)}
                  opacity={isHovered ? "0.6" : "0.25"}
                  className="animate-pulse"
                />
                {/* Main point */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getColor(prov)}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />
                {/* Province label */}
                <text
                  x={x}
                  y={y - radius - 4}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="9"
                  fontWeight="bold"
                  className={`pointer-events-none drop-shadow-md select-none ${
                    isHovered ? "fill-white text-[11px]" : "fill-slate-300"
                  }`}
                >
                  {prov.provinsi}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Tooltip Card */}
        {hoveredProv && (
          <div className="absolute top-4 right-4 p-4 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs w-64 pointer-events-none z-30 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
              <h4 className="font-bold text-white text-sm">{hoveredProv.provinsi}</h4>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                Rank #{hoveredProv.rank_investasi}
              </span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Investasi:</span>
                <span className="font-bold text-blue-400">{formatRupiah(hoveredProv.total_investasi_kumulatif_milyar)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PDRB Terbaru:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(hoveredProv.latest_pdrb_adhb_milyar)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rasio Inv/PDRB:</span>
                <span className="font-bold text-amber-400">{hoveredProv.avg_rasio_investasi_pdrb}%</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Porsi PMA / PMDN:</span>
                <span className="font-medium text-slate-200">{hoveredProv.pma_share_percent}% / {hoveredProv.pmdn_share_percent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Intensitas warna lingkaran menunjukkan besaran metrik yang dipilih (semakin pekat = nilai semakin tinggi).</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-500" />
            <span>Rendah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
            <span>Tinggi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
