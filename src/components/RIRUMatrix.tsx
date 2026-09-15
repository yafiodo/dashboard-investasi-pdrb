"use client";

import { useState } from "react";
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
import { Compass, Calculator, Info, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import riruDataRaw from "@/data/riru_readiness_data.json";

export default function RIRUMatrix() {
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("all");
  const [selectedProv, setSelectedProv] = useState<any>(null);

  const provinces = riruDataRaw.provinces;

  const quadrantColors: { [key: string]: string } = {
    "Kuadran I": "#1e3a8a", // Navy Blue
    "Kuadran II": "#059669", // Emerald Green
    "Kuadran III": "#d97706", // Amber Gold
    "Kuadran IV": "#64748b", // Slate
  };

  const filteredProvinces = provinces.filter((p) => {
    if (selectedQuadrant === "all") return true;
    return p.kuadran_label === selectedQuadrant;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl text-xs space-y-1.5 z-50 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-black text-[#0f172a] text-sm">{data.provinsi}</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: quadrantColors[data.kuadran_label] || "#1e3a8a" }}
            >
              {data.kuadran_label}
            </span>
          </div>
          <p className="text-slate-600 font-semibold">
            Skor Kesiapan RIRU: <span className="font-extrabold text-blue-900">{data.riru_score}/100</span> (Peringkat #{data.rank})
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500">
            <div>Investasi: <strong className="text-slate-800">{formatRupiah(data.avg_investasi_tahunan_miliar)}/th</strong></div>
            <div>PDRB: <strong className="text-slate-800">{formatRupiah(data.avg_pdrb_tahunan_miliar)}/th</strong></div>
            <div>Ekspor: <strong className="text-slate-800">${data.avg_ekspor_tahunan_usd_juta} Jt/th</strong></div>
            <div>TKK: <strong className="text-slate-800">{data.tkk_pct}%</strong></div>
            <div>ICOR: <strong className="text-slate-800">{data.avg_icor}</strong></div>
            <div className="col-span-2">Sektor Dominan: <strong className="text-slate-900 block text-xs leading-snug">{data.sektor_dominan}</strong></div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 italic">
            Klik titik untuk melihat analisis rekomendasi RIRU.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            Matriks Strategis Kesiapan Daerah Menjadi RIRU (Regional Investor Relations Unit)
          </div>
          <h3 className="text-xl font-black text-[#0f172a]">
            Matriks 4 Kuadran Kesiapan RIRU (Kombinasi 6 Indikator Makroekonomi)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Memadukan 6 indikator utama: <strong>Realisasi Investasi, Capaian PDRB, Kinerja Ekspor, Penyerapan Tenaga Kerja (TKK), Dominasi Sektor, dan Efisiensi Modal (ICOR)</strong> periode 2015 s.d. 2026.
          </p>
        </div>

        {/* Toggle Formula Button */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all self-start border border-slate-200"
        >
          <Calculator className="w-4 h-4 text-blue-900" />
          <span>{showFormula ? "Sembunyikan Formula Matematis" : "Lihat Formula Matematis"}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Mathematical Formula Box */}
      {showFormula && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 text-slate-800 text-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
            <Info className="w-4 h-4 text-blue-700" />
            Metodologi &amp; Formulasi Indeks Kesiapan RIRU (Regional Investor Relations Unit)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-[#0f172a]">1. Normalisasi Min-Max Tiap Indikator (Skala 0 - 100):</h5>
              <p className="text-slate-600 font-mono text-[11px]">
                Z_k = [(X_k - min(X_k)) / (max(X_k) - min(X_k))] &times; 100
              </p>
              <p className="text-slate-500 text-[11px]">
                *Khusus untuk ICOR di mana nilai lebih kecil menunjukkan efisiensi modal yang lebih tinggi, digunakan formula terbalik:
                <br />
                <code className="text-amber-700 font-mono">Z_icor = [(max(ICOR) - ICOR) / (max(ICOR) - min(ICOR))] &times; 100</code>
              </p>
            </div>

            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-[#0f172a]">2. Formula Skor Komposit RIRU (RIRU Readiness Score):</h5>
              <p className="text-slate-800 font-mono text-[11px] font-bold">
                RRS = (0.20 &times; Z_inv) + (0.20 &times; Z_pdrb) + (0.15 &times; Z_exp) + (0.15 &times; Z_lab) + (0.15 &times; Z_sec) + (0.15 &times; Z_icor)
              </p>
              <ul className="text-slate-500 text-[11px] space-y-0.5 list-disc list-inside">
                <li>Investasi BKPM: Bobot 20%</li>
                <li>PDRB BPS: Bobot 20%</li>
                <li>Ekspor BPS: Bobot 15%</li>
                <li>Tenaga Kerja (TKK): Bobot 15%</li>
                <li>Dominasi Sektor: Bobot 15%</li>
                <li>Efisiensi ICOR: Bobot 15%</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            <strong>Penentuan Sumbu Matriks 4 Kuadran:</strong>
            <br />
            &bull; <strong>Sumbu X (Skala Pasar &amp; Modal):</strong> 40% Z_inv + 40% Z_pdrb + 20% Z_exp (Ambang Batas = 25.0).
            <br />
            &bull; <strong>Sumbu Y (Efisiensi Struktur &amp; Daya Serap):</strong> 40% Z_icor + 35% Z_lab + 25% Z_sec (Ambang Batas = 50.0).
          </div>
        </div>
      )}

      {/* Filter by Quadrant Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-500 mr-1">Filter Kuadran:</span>
          {[
            { id: "all", label: "Semua Kuadran (38 Provinsi)", color: "#0f172a" },
            { id: "Kuadran I", label: "Kuadran I: Mature & Prime", color: "#1e3a8a" },
            { id: "Kuadran II", label: "Kuadran II: High-Efficiency", color: "#059669" },
            { id: "Kuadran III", label: "Kuadran III: Capital-Intensive", color: "#d97706" },
            { id: "Kuadran IV", label: "Kuadran IV: Nascent", color: "#64748b" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedQuadrant(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                selectedQuadrant === tab.id
                  ? "text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              style={{ backgroundColor: selectedQuadrant === tab.id ? tab.color : undefined }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Menampilkan: <strong className="text-slate-900">{filteredProvinces.length}</strong> provinsi
        </div>
      </div>

      {/* 4 Quadrants Interactive Scatter Chart */}
      <div className="relative w-full h-[460px] bg-slate-50/60 border border-slate-200 rounded-2xl p-4 overflow-hidden">
        {/* Quadrant Visual Watermark Backgrounds */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-40">
          <div className="border-r border-b border-slate-200/80 p-3 bg-emerald-50/20">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
              Kuadran II: High-Efficiency Emerging (Skala Kecil, Efisiensi Tinggi)
            </span>
          </div>
          <div className="border-b border-slate-200/80 p-3 bg-blue-50/30">
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">
              Kuadran I: Mature &amp; Prime Destination (Skala Besar, Efisiensi Tinggi)
            </span>
          </div>
          <div className="border-r border-slate-200/80 p-3 bg-slate-100/30">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              Kuadran IV: Nascent / Basic Readiness (Skala Terbatas, Butuh Infrastruktur)
            </span>
          </div>
          <div className="p-3 bg-amber-50/20">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
              Kuadran III: Resource &amp; Capital-Intensive (Smelter/Tambang, Butuh Hilirisasi Lanjut)
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="matrix_x"
              name="Skala Pasar & Modal"
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              label={{ value: "Sumbu X: Skala Pasar & Modal (Investasi, PDRB, Ekspor) →", position: "insideBottom", offset: -15, fill: "#334155", fontSize: 11, fontWeight: "bold" }}
            />
            <YAxis
              type="number"
              dataKey="matrix_y"
              name="Efisiensi Struktur & Daya Serap"
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              label={{ value: "↑ Sumbu Y: Efisiensi Struktur & Daya Serap (ICOR, TKK, Sektor)", angle: -90, position: "insideLeft", offset: 15, fill: "#334155", fontSize: 11, fontWeight: "bold" }}
            />
            <ZAxis type="number" dataKey="riru_score" range={[100, 500]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={25} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" />
            <Scatter
              name="Provinsi"
              data={filteredProvinces}
              onClick={(entry) => setSelectedProv(entry.payload)}
              cursor="pointer"
            >
              {filteredProvinces.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={quadrantColors[entry.kuadran_label] || "#1e3a8a"}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Province Detailed Inspection Card */}
      {selectedProv && (
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg space-y-3 transition-all animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                Provinsi Terpilih dalam Matriks RIRU
              </span>
              <h4 className="text-2xl font-black text-white flex items-center gap-2">
                {selectedProv.provinsi}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                  Peringkat #{selectedProv.rank}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 font-extrabold">
                  Skor RIRU: {selectedProv.riru_score}/100
                </span>
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold">Klasifikasi Kuadran:</span>
              <p className="text-sm font-extrabold text-amber-300">{selectedProv.kuadran}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">Realisasi Investasi:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{formatRupiah(selectedProv.avg_investasi_tahunan_miliar)}/th</p>
              <span className="text-[10px] text-blue-400">Sub-skor: {selectedProv.scores.z_inv}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">PDRB Nominal:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{formatRupiah(selectedProv.avg_pdrb_tahunan_miliar)}/th</p>
              <span className="text-[10px] text-emerald-400">Sub-skor: {selectedProv.scores.z_pdrb}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">Ekspor Daerah:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">${selectedProv.avg_ekspor_tahunan_usd_juta} Jt/th</p>
              <span className="text-[10px] text-amber-400">Sub-skor: {selectedProv.scores.z_exp}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">Tingkat Kesempatan Kerja:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{selectedProv.tkk_pct}%</p>
              <span className="text-[10px] text-purple-400">Sub-skor: {selectedProv.scores.z_lab}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">Efisiensi ICOR:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{selectedProv.avg_icor}</p>
              <span className="text-[10px] text-cyan-400">Sub-skor: {selectedProv.scores.z_icor}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 relative group cursor-pointer">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Sektor Dominan:</span>
                <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300">Detail &rarr;</span>
              </div>
              <p 
                className="font-extrabold text-white text-sm mt-0.5 truncate group-hover:text-amber-300 transition-colors"
                title={selectedProv.sektor_dominan}
              >
                {selectedProv.sektor_dominan}
              </p>
              <span className="text-[10px] text-rose-400">Sub-skor: {selectedProv.scores.z_sec}</span>
              {/* Hover popover */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 p-2.5 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 max-w-xs pointer-events-none animate-in fade-in">
                <div className="text-amber-400 text-[10px] font-bold uppercase">Sektor Dominan:</div>
                <div className="text-white text-xs font-bold leading-snug">{selectedProv.sektor_dominan}</div>
                <div className="text-slate-400 text-[10px] mt-1">Porsi PDRB: {selectedProv.porsi_sektor_dominan_pct}%</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-amber-300">Rekomendasi Kebijakan RIRU untuk {selectedProv.provinsi}:</strong>{" "}
              <span className="text-slate-200">{selectedProv.rekomendasi_riru}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Quadrants Strategic Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
          <div className="flex items-center gap-2 font-black text-blue-900 mb-1">
            <span className="w-3 h-3 rounded-full bg-blue-900" />
            Kuadran I: Mature &amp; Prime Destination
          </div>
          <p className="text-slate-600 font-medium">
            Skala investasi &amp; pasar sangat tinggi, ekspor kuat, efisiensi ICOR baik, serapan tenaga kerja solid.
          </p>
          <div className="mt-2 text-[11px] font-bold text-blue-950">
            Strategi: Ekspansi green investment, high-tech, semi-konduktor &amp; R&amp;D.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center gap-2 font-black text-emerald-800 mb-1">
            <span className="w-3 h-3 rounded-full bg-emerald-700" />
            Kuadran II: High-Efficiency Emerging
          </div>
          <p className="text-slate-600 font-medium">
            Skala pasar belum raksasa, namun efisiensi modal (ICOR rendah) dan serapan tenaga kerja sangat unggul.
          </p>
          <div className="mt-2 text-[11px] font-bold text-emerald-950">
            Strategi: Promosi investasi agresif, fasilitasi klaster industri baru &amp; pariwisata.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
          <div className="flex items-center gap-2 font-black text-amber-800 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-600" />
            Kuadran III: Capital-Intensive
          </div>
          <p className="text-slate-600 font-medium">
            Arus modal smelter/tambang sangat besar dan ekspor tinggi, namun ICOR tinggi (padat modal panjang).
          </p>
          <div className="mt-2 text-[11px] font-bold text-amber-950">
            Strategi: Dorong industri hilirisasi turunan, vokasi tenaga kerja lokal, dan efisiensi logistik.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-100/60">
          <div className="flex items-center gap-2 font-black text-slate-800 mb-1">
            <span className="w-3 h-3 rounded-full bg-slate-600" />
            Kuadran IV: Nascent / Basic Readiness
          </div>
          <p className="text-slate-600 font-medium">
            Skala ekonomi dan investasi masih berkembang, ketergantungan pada sektor primer tradisional.
          </p>
          <div className="mt-2 text-[11px] font-bold text-slate-900">
            Strategi: Pembangunan konektivitas dasar, deregulasi perizinan lahan, dan insentif fiskal daerah.
          </div>
        </div>
      </div>
    </div>
  );
}
