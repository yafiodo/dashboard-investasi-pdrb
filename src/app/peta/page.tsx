"use client";

import { useState } from "react";
import provinceProfilesRaw from "@/data/province_profiles.json";
import { ProvinceProfile } from "@/types";
import IndonesiaMap from "@/components/IndonesiaMap";
import { Map, ExternalLink } from "lucide-react";
import { formatRupiah } from "@/lib/dataProcessor";
import Link from "next/link";

export default function PetaPage() {
  const provinces = provinceProfilesRaw as ProvinceProfile[];
  const [selectedProvName, setSelectedProvName] = useState<string>("Sulawesi Tengah");

  const selectedProv = provinces.find((p) => p.provinsi === selectedProvName) || provinces[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Map className="w-7 h-7 text-cyan-400" />
          Peta Spasial Sebaran Ekonomi Indonesia
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Visualisasi spasial 38 provinsi di Indonesia berdasarkan Realisasi Investasi BKPM, Nilai PDRB BPS, dan Rasio Efisiensi Modal.
        </p>
      </div>

      <IndonesiaMap
        provinces={provinces}
        onSelectProvince={(prov) => setSelectedProvName(prov)}
      />

      {/* Selected Province Detailed Drawer / Card */}
      {selectedProv && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Profil Wilayah Terpilih</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">{selectedProv.provinsi}</h3>
              <p className="text-xs text-slate-400">Wilayah: {selectedProv.region} &bull; Peringkat Investasi Nasional: #{selectedProv.rank_investasi}</p>
            </div>
            <Link
              href={`/komparasi`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all self-start"
            >
              Bandingkan di Halaman Komparasi <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Total Investasi (2015-2026):</span>
              <p className="text-lg font-bold text-blue-400 mt-1">{formatRupiah(selectedProv.total_investasi_kumulatif_milyar)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">PDRB Nominal Terkini:</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">{formatRupiah(selectedProv.latest_pdrb_adhb_milyar)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Rata-rata Rasio Inv/PDRB:</span>
              <p className="text-lg font-bold text-amber-400 mt-1">{selectedProv.avg_rasio_investasi_pdrb}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Proporsi PMA vs PMDN:</span>
              <p className="text-lg font-bold text-purple-400 mt-1">{selectedProv.pma_share_percent}% / {selectedProv.pmdn_share_percent}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
