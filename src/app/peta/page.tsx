"use client";

import { useState } from "react";
import IndonesiaMap from "@/components/IndonesiaMap";
import { Map } from "lucide-react";

export default function PetaPage() {
  const [selectedProvName, setSelectedProvName] = useState<string>("Sulawesi Tengah");

  return (
    <div className="space-y-8">
      {/* Heading: Left-aligned, no badge pill */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] flex items-center gap-3">
          <Map className="w-7 h-7 text-blue-900" />
          Peta Geospasial Satelit Sebaran Ekonomi &amp; Kesiapan RIRU
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Visualisasi geospasial fotorealistik 38 provinsi di Indonesia berbasis citra satelit dengan 6 indikator makroekonomi dan kesiapan RIRU periode 2015&ndash;2026.
        </p>
      </div>

      <IndonesiaMap
        onSelectProvince={(prov) => setSelectedProvName(prov)}
      />
    </div>
  );
}
