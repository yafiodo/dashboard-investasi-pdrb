"use client";

import sectorDataRaw from "@/data/sector_comparison.json";
import { SectorComparison } from "@/types";
import SektorHeatmap from "@/components/SektorHeatmap";
import { Layers } from "lucide-react";

export default function SektoralPage() {
  const sectorData = sectorDataRaw as SectorComparison;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Layers className="w-7 h-7 text-indigo-400" />
          Analisis Sektoral: BKPM vs Lapangan Usaha BPS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Penyelarasan sektor investasi modal BKPM (PMA vs PMDN) dengan 17 Lapangan Usaha PDRB BPS dan fenomena hilirisasi.
        </p>
      </div>

      <SektorHeatmap sectorData={sectorData} />
    </div>
  );
}
