"use client";

import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "@/lib/dataProcessor";
import { MapPin, Compass, ExternalLink, X, Layers, Sparkles, Filter } from "lucide-react";
import riruDataRaw from "@/data/riru_readiness_data.json";
import Link from "next/link";

interface IndonesiaMapProps {
  provinces?: any;
  onSelectProvince?: (prov: string) => void;
}

export default function IndonesiaMap({ onSelectProvince }: IndonesiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("all");
  const [selectedIsland, setSelectedIsland] = useState<string>("all");
  const [activeProv, setActiveProv] = useState<any | null>(null);

  const provinces = riruDataRaw.provinces;

  // QUADRANT COLORS strictly matched to RIRU Matrix
  const QUADRANT_COLORS: { [key: string]: { hex: string; border: string; bg: string; text: string; ring: string } } = {
    "Kuadran I": {
      hex: "#1e3a8a", // Navy Blue
      border: "#172554",
      bg: "bg-blue-900",
      text: "text-blue-900",
      ring: "ring-blue-400",
    },
    "Kuadran II": {
      hex: "#059669", // Emerald Green
      border: "#064e3b",
      bg: "bg-emerald-600",
      text: "text-emerald-700",
      ring: "ring-emerald-400",
    },
    "Kuadran III": {
      hex: "#d97706", // Amber Gold
      border: "#78350f",
      bg: "bg-amber-600",
      text: "text-amber-800",
      ring: "ring-amber-400",
    },
    "Kuadran IV": {
      hex: "#64748b", // Slate Gray
      border: "#334155",
      bg: "bg-slate-600",
      text: "text-slate-700",
      ring: "ring-slate-400",
    },
  };

  const filteredProvinces = provinces.filter((p: any) => {
    if (selectedQuadrant !== "all" && p.kuadran_label !== selectedQuadrant) return false;
    if (selectedIsland !== "all" && p.pulau !== selectedIsland) return false;
    return true;
  });

  // Initialize and update Leaflet live map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted) return;

      // Create map instance once
      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [-2.5, 118.0], // Center of Indonesian Archipelago
          zoom: 5,
          minZoom: 4,
          maxZoom: 14,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        // Add custom top-right zoom control
        L.control.zoom({ position: "topright" }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      // Handle Tile Layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Live Photorealistic World Imagery Satellite
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
          maxZoom: 18,
        }
      );
      // Boundaries & Place Labels
      const labelLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          opacity: 0.85,
        }
      );
      satLayer.addTo(map);
      labelLayer.addTo(map);

      // Clear existing markers
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      // Add Quadrant-Colored Markers for filtered provinces
      filteredProvinces.forEach((p: any) => {
        if (p.lat && p.lng) {
          const qColor = QUADRANT_COLORS[p.kuadran_label] || QUADRANT_COLORS["Kuadran I"];

          // Custom pulsing SVG HTML DivIcon with quadrant color
          const customIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: ${qColor.hex}; opacity: 0.45; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: ${qColor.hex}; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 10px;">
                  ${p.rank}
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(map);

          // Popup content with Quadrant Color & scorecard
          const popupHtml = `
            <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0f172a; min-width: 220px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
                <strong style="font-size: 14px; color: #0f172a;">${p.provinsi}</strong>
                <span style="background-color: ${qColor.hex}; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold;">
                  ${p.kuadran_label}
                </span>
              </div>
              <div style="margin-bottom: 4px; color: #334155;">
                Skor Kesiapan RIRU: <strong style="color: ${qColor.hex};">${p.riru_score}/100</strong> (Peringkat #${p.rank})
              </div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">
                &bull; Rata-rata Investasi: <strong>${formatRupiah(p.avg_investasi_tahunan_miliar)}/th</strong><br/>
                &bull; Rata-rata PDRB: <strong>${formatRupiah(p.avg_pdrb_tahunan_miliar)}/th</strong><br/>
                &bull; Efisiensi ICOR: <strong>${p.avg_icor}</strong> | TKK: <strong>${p.tkk_pct}%</strong><br/>
                &bull; Sektor Utama: <strong>${p.sektor_dominan}</strong>
              </div>
              <button id="btn-select-${p.rank}" style="width: 100%; margin-top: 8px; background-color: #0f172a; color: white; border: none; border-radius: 8px; padding: 6px 10px; font-size: 11px; font-weight: bold; cursor: pointer;">
                Buka Profil Lengkap &rarr;
              </button>
            </div>
          `;

          marker.bindPopup(popupHtml);

          marker.on("popupopen", () => {
            const btn = document.getElementById(`btn-select-${p.rank}`);
            if (btn) {
              btn.onclick = () => {
                setActiveProv(p);
                if (onSelectProvince) onSelectProvince(p.provinsi);
              };
            }
          });

          marker.on("click", () => {
            setActiveProv(p);
            if (onSelectProvince) onSelectProvince(p.provinsi);
          });

          markersRef.current.push(marker);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [selectedQuadrant, selectedIsland, filteredProvinces]);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header & Map Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
            <Compass className="w-4 h-4" />
            Live Geospatial Interactive Maps (38 Provinsi Indonesia)
          </div>
          <h3 className="font-extrabold text-xl text-[#0f172a] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-900" />
            Peta Geospasial Live Satelit &amp; Matriks Kuadran RIRU
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Peta langsung interaktif (dapat digeser, di-zoom, dan diklik) dengan warna titik yang sepenuhnya diselaraskan dengan warna 4 Kuadran RIRU.
          </p>
        </div>

        {/* Live Satellite Badge (Citra Satelit Live Only) */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold border border-slate-800 shadow-sm self-start lg:self-auto">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Citra Satelit Live</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* PROMINENT QUADRANT COLOR LEGEND (Point 2 strictly addressed) */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Legenda Titik Sesuai 4 Kuadran RIRU:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === "Kuadran I" ? "all" : "Kuadran I")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              selectedQuadrant === "Kuadran I"
                ? "bg-blue-900 text-white border-blue-950 shadow-sm"
                : "bg-white text-blue-950 border-blue-200 hover:bg-blue-50"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-blue-900 border border-white" />
            <strong>Kuadran I:</strong> Mature &amp; Prime
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === "Kuadran II" ? "all" : "Kuadran II")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              selectedQuadrant === "Kuadran II"
                ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                : "bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white" />
            <strong>Kuadran II:</strong> High-Efficiency
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === "Kuadran III" ? "all" : "Kuadran III")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              selectedQuadrant === "Kuadran III"
                ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                : "bg-white text-amber-950 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-amber-600 border border-white" />
            <strong>Kuadran III:</strong> Capital-Intensive
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === "Kuadran IV" ? "all" : "Kuadran IV")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              selectedQuadrant === "Kuadran IV"
                ? "bg-slate-700 text-white border-slate-800 shadow-sm"
                : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-slate-600 border border-white" />
            <strong>Kuadran IV:</strong> Nascent / Basic
          </button>
        </div>
      </div>

      {/* Filter Pulau Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Pulau:
        </span>
        {[
          { id: "all", label: "Semua Pulau (38)" },
          { id: "Sumatera", label: "Sumatera" },
          { id: "Jawa", label: "Jawa" },
          { id: "Bali & Nusa Tenggara", label: "Bali & Nusra" },
          { id: "Kalimantan", label: "Kalimantan" },
          { id: "Sulawesi", label: "Sulawesi" },
          { id: "Maluku", label: "Maluku" },
          { id: "Papua", label: "Papua" },
        ].map((island) => (
          <button
            key={island.id}
            onClick={() => setSelectedIsland(island.id)}
            className={`px-2.5 py-0.5 rounded-full font-semibold transition-all text-[11px] ${
              selectedIsland === island.id
                ? "bg-blue-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {island.label}
          </button>
        ))}
      </div>

      {/* LIVE MAP LEAFLET CONTAINER */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Instruction Banner */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs border border-slate-700/80 shadow-lg flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">Live Map Aktif:</span>
            <strong className="text-white font-bold">{filteredProvinces.length} Titik Provinsi</strong>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">Gunakan scroll untuk zoom dan drag untuk menggeser peta</span>
        </div>
      </div>

      {/* Selected Province Detailed Drawer */}
      {activeProv && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b192e] via-blue-950 to-slate-900 text-white shadow-xl space-y-4 border border-blue-900/60 relative animate-in fade-in-50">
          <button
            onClick={() => setActiveProv(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Profil Geospasial Kesiapan RIRU Daerah
              </span>
              <h4 className="text-2xl font-black text-white flex items-center gap-2.5">
                {activeProv.provinsi}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 font-bold">
                  Peringkat #{activeProv.rank} Nasional
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 font-black">
                  Skor RIRU: {activeProv.riru_score}/100
                </span>
              </h4>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Wilayah Pulau: {activeProv.pulau} &bull; Klasifikasi: <strong className="text-amber-300">{activeProv.kuadran}</strong>
              </p>
            </div>

            <Link
              href={`/komparasi`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all self-start shadow-md"
            >
              Lihat di Menu Regional <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Macroeconomic Indicators Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">1. Investasi Tahunan:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{formatRupiah(activeProv.avg_investasi_tahunan_miliar)}/th</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_inv}%` }} />
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">2. PDRB Tahunan:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{formatRupiah(activeProv.avg_pdrb_tahunan_miliar)}/th</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_pdrb}%` }} />
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">3. Ekspor Daerah:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">${activeProv.avg_ekspor_tahunan_usd_juta} Jt/th</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_exp}%` }} />
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">4. Kesempatan Kerja:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{activeProv.tkk_pct}% (TKK)</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_lab}%` }} />
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400">5. Efisiensi ICOR:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{activeProv.avg_icor}</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_icor}%` }} />
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 relative group cursor-pointer">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>6. Sektor Dominan:</span>
                <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300">Detail &rarr;</span>
              </div>
              <p 
                className="font-extrabold text-white text-sm mt-0.5 truncate group-hover:text-amber-300 transition-colors"
                title={activeProv.sektor_dominan}
              >
                {activeProv.sektor_dominan}
              </p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeProv.scores.z_sec}%` }} />
              </div>
              {/* Hover popover */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 p-2.5 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 max-w-xs pointer-events-none animate-in fade-in">
                <div className="text-amber-400 text-[10px] font-bold uppercase">Sektor Dominan:</div>
                <div className="text-white text-xs font-bold leading-snug">{activeProv.sektor_dominan}</div>
                <div className="text-slate-400 text-[10px] mt-1">Porsi PDRB: {activeProv.porsi_sektor_dominan_pct}%</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-950/80 rounded-xl border border-blue-800/60 text-xs flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Rekomendasi Kebijakan RIRU Daerah:</strong>{" "}
              <span className="text-slate-200">{activeProv.rekomendasi_riru}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
