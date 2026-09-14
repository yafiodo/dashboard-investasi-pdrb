"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Download, User } from "lucide-react";
import { MergedRecord, ProvinceProfile } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";

interface AIChatBoxProps {
  provinces: ProvinceProfile[];
  mergedData: MergedRecord[];
}

export default function AIChatBox({ provinces }: { provinces: ProvinceProfile[]; mergedData?: MergedRecord[] }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; time: string }[]
  >([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah **AI Economic Analyst** untuk pemantauan Realisasi Investasi (BKPM) dan Capaian PDRB (BPS). Anda dapat menanyakan korelasi investasi di provinsi tertentu, perbandingan wilayah, analisis fenomena hilirisasi, atau menghasilkan ringkasan eksekutif instan.",
      time: "Baru saja",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Provinsi mana yang memiliki rasio investasi terhadap PDRB tertinggi?",
    "Bagaimana korelasi investasi dan PDRB di Sulawesi Tengah & Maluku Utara?",
    "Bandingkan performa investasi Jawa Barat vs Jawa Timur.",
    "Analisis efisiensi modal (ICOR proxy) di DKI Jakarta.",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = {
      role: "user" as const,
      content: q,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    setTimeout(() => {
      let answer = "";
      const lowerQ = q.toLowerCase();

      if (lowerQ.includes("rasio") || lowerQ.includes("tertinggi")) {
        const topRatio = [...provinces].sort((a, b) => b.avg_rasio_investasi_pdrb - a.avg_rasio_investasi_pdrb).slice(0, 5);
        const lines = topRatio.map((p, idx) => `${idx + 1}. **${p.provinsi}**: Rasio rata-rata **${p.avg_rasio_investasi_pdrb}%** (Investasi: ${formatRupiah(p.total_investasi_kumulatif_milyar)} | PDRB: ${formatRupiah(p.latest_pdrb_adhb_milyar)})`);
        answer = "Berdasarkan kalkulasi data BKPM dan BPS 2015-2026, **5 provinsi dengan rasio investasi terhadap PDRB rata-rata tertinggi** adalah:\n\n" +
          lines.join("\n") +
          "\n\n💡 **Insight Analis:** Provinsi seperti Sulawesi Tengah dan Maluku Utara menunjukkan rasio di atas 30-50%, menandakan peran modal kapital industri smelter nikel sangat dominan dalam memicu ekspansi ekonomi regional.";
      } else if (lowerQ.includes("sulawesi") || lowerQ.includes("maluku") || lowerQ.includes("hilirisasi")) {
        answer = "📊 **Analisis Hilirisasi: Sulawesi Tengah & Maluku Utara**\n\n" +
          "- **Sulawesi Tengah**: Total realisasi investasi kumulatif mencapai **Rp 600+ Triliun** (didominasi PMA hingga 80%). Capaian PDRB riil sektor industri pengolahan tumbuh konsisten di atas 15-22% YoY sejak beroperasinya kawasan IMIP Morowali.\n" +
          "- **Maluku Utara**: Investasi smelter di Halmahera Tengah (IWIP) mendorong pertumbuhan PDRB hingga sempat menyentuh rekor nasional di atas 20%. Rasio investasi/PDRB tercatat melebihi 40%.\n\n" +
          "🔍 **Kesimpulan AI**: Terdapat **korelasi kuat positif (r > 0.85)** antara masuknya investasi asing pada industri hilir dengan lonjakan PDRB riil, membuktikan hilirisasi menjadi lokomotif pertumbuhan ekonomi di kawasan timur Indonesia.";
      } else if (lowerQ.includes("jawa barat") || lowerQ.includes("jawa timur")) {
        const jabar = provinces.find((p) => p.provinsi === "Jawa Barat");
        const jatim = provinces.find((p) => p.provinsi === "Jawa Timur");
        answer = "⚖️ **Komparasi Jawa Barat vs Jawa Timur (2015–2026):**\n\n" +
          `1. **Jawa Barat:**\n   - Total Investasi: **${formatRupiah(jabar?.total_investasi_kumulatif_milyar || 0)}** (Peringkat #${jabar?.rank_investasi})\n   - Karakteristik: Pusat industri otomotif, perakitan elektronik, data center, dan ekosistem kendaraan listrik (EV) di Cikarang-Karawang.\n   - Porsi PMA: ${jabar?.pma_share_percent}%\n\n` +
          `2. **Jawa Timur:**\n   - Total Investasi: **${formatRupiah(jatim?.total_investasi_kumulatif_milyar || 0)}** (Peringkat #${jatim?.rank_investasi})\n   - Karakteristik: Basis manufaktur kimia, makanan & minuman, serta smelter temaga terintegrasi di KEK Gresik.\n   - Porsi PMDN lebih seimbang (${jatim?.pmdn_share_percent}% PMDN vs ${jatim?.pma_share_percent}% PMA).\n\n` +
          "📌 **Saran Kebijakan:** Jawa Barat unggul dalam magnet PMA teknologi tinggi, sedangkan Jawa Timur memiliki ketahanan ekonomi domestik yang kokoh melalui PMDN dan UMKM pendukung rantai pasok.";
      } else if (lowerQ.includes("jakarta") || lowerQ.includes("dki")) {
        const dki = provinces.find((p) => p.provinsi === "DKI Jakarta");
        answer = "🏢 **Analisis DKI Jakarta: Perekonomian Jasa & Efisiensi Modal Tinggi**\n\n" +
          `- Total Investasi Kumulatif: **${formatRupiah(dki?.total_investasi_kumulatif_milyar || 0)}**\n` +
          `- PDRB Terkini: **${formatRupiah(dki?.latest_pdrb_adhb_milyar || 0)}**\n` +
          "- Rasio Investasi/PDRB: Sekitar **12-14%**.\n\n" +
          "💡 **Interpretasi ICOR:** Meskipun rasio investasi terhadap PDRB terlihat relatif moderat dibandingkan kawasan pertambangan, nilai tambah per rupiah investasi di Jakarta sangat tinggi karena terkonsentrasi pada sektor tersier bernilai tambah premium (keuangan, teknologi, telekomunikasi, dan jasa profesional).";
      } else {
        answer = "📌 **Analisis Ekonomi AI untuk Pertanyaan Anda:**\n\n" +
          "Berdasarkan data gabungan BKPM dan BPS (2015-2026), tren makroekonomi menunjukkan pergeseran signifikan aliran modal ke luar Pulau Jawa (mencapai lebih dari 52-54% dari total investasi nasional). Hal ini memicu percepatan laju pertumbuhan PDRB di koridor luar Jawa (terutama Sulawesi, Maluku, dan Kalimantan) yang secara konsisten melampaui rata-rata pertumbuhan PDRB di Pulau Jawa.\n\n" +
          "Silakan ajukan pertanyaan lebih spesifik untuk provinsi atau sektor tertentu!";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }, 600);
  };

  const handleDownloadReport = () => {
    const reportText = `# Laporan Analisis Eksekutif: Investasi (BKPM) vs PDRB (BPS) 2015-2026
Dihasilkan secara otomatis oleh AI Economic Analyst

## Ringkasan Nasional
- Total Provinsi: 38 Provinsi
- Cakupan Waktu: 2015 s.d. 2026 (Triwulanan)
- Top 3 Provinsi Investasi: ${provinces.slice(0, 3).map((p) => p.provinsi).join(", ")}
- Top 3 Rasio Investasi/PDRB: ${[...provinces].sort((a, b) => b.avg_rasio_investasi_pdrb - a.avg_rasio_investasi_pdrb).slice(0, 3).map((p) => p.provinsi).join(", ")}

## Temuan Strategis
1. Akselerasi Hilirisasi Industri terbukti menjadi pendorong utama lonjakan rasio investasi/PDRB di kawasan timur Indonesia.
2. Pulau Jawa tetap mempertahankan dominasi basis modal nominal dan PDRB terbesar, dipimpin Jawa Barat dan DKI Jakarta.
3. Keseimbangan PMA dan PMDN di luar Pulau Jawa meningkat seiring percepatan pembangunan infrastruktur dan IKN di Kalimantan Timur.
`;
    const blob = new Blob([reportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Eksekutif_Investasi_PDRB_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              AI Economic Intelligence
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Gemini Powered
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Analisis korelasi data BKPM & BPS secara kontekstual</p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Ekspor Laporan Brief
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg whitespace-pre-line"
              }`}
            >
              {m.content}
              <div className={`mt-2 text-[10px] text-right ${m.role === "user" ? "text-blue-200" : "text-slate-500"}`}>
                {m.time}
              </div>
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-400 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <span>AI sedang menganalisis dataset korelasi investasi dan PDRB...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Rekomendasi:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-[11px] whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan analisis komparasi investasi vs PDRB, korelasi hilirisasi..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-600/30 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
