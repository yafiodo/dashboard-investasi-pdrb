"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Download, User } from "lucide-react";
import { ProvinceProfile } from "@/types";
import { formatRupiah } from "@/lib/dataProcessor";
import riruDataRaw from "@/data/riru_readiness_data.json";

export default function AIChatBox({ provinces }: { provinces: ProvinceProfile[] }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; time: string }[]
  >([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah AI Macroeconomic Analyst untuk pemantauan Realisasi Investasi (BKPM), Capaian PDRB (BPS), dan Indeks Kesiapan RIRU (Regional Investment Relations Unit) 2015-2026. Anda dapat menanyakan kesiapan RIRU daerah, efisiensi ICOR, daya serap tenaga kerja, ekspor, atau analisis komparasi antar provinsi.",
      time: "Baru saja",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Bagaimana kesiapan daerah menjadi RIRU dan siapa peringkat teratas?",
    "Jelaskan analisis efisiensi ICOR kuartalan dan formula 6 indikator RIRU.",
    "Bagaimana korelasi hilirisasi di Sulawesi Tengah & Maluku Utara terhadap PDRB dan ekspor?",
    "Bandingkan performa investasi dan tenaga kerja Jawa Barat vs Jawa Timur.",
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

      // Find if a specific province is mentioned
      const matchedRiru = riruDataRaw.provinces.find((p) =>
        lowerQ.includes(p.provinsi.toLowerCase())
      );

      if (lowerQ.includes("riru") || lowerQ.includes("kesiapan") || lowerQ.includes("peringkat teratas") || lowerQ.includes("siapa teratas")) {
        const top5 = riruDataRaw.provinces.slice(0, 5);
        const top5List = top5
          .map(
            (p) =>
              `${p.rank}. ${p.provinsi} (Skor: ${p.riru_score}/100 - ${p.kuadran_label})\n- Realisasi Investasi: ${formatRupiah(p.avg_investasi_tahunan_miliar)}/tahun\n- PDRB Nominal: ${formatRupiah(p.avg_pdrb_tahunan_miliar)}/tahun\n- Efisiensi ICOR: ${p.avg_icor} | TKK: ${p.tkk_pct}%\n- Rekomendasi: ${p.rekomendasi_riru}`
          )
          .join("\n\n");

        answer = `Hasil Analisis Kesiapan Daerah Menjadi RIRU (Regional Investment Relations Unit):\n\nBerdasarkan kombinasi 6 indikator makroekonomi (Investasi, PDRB, Ekspor, Tenaga Kerja TKK, Dominasi Sektor, dan Efisiensi ICOR), berikut adalah 5 provinsi dengan skor kesiapan RIRU tertinggi nasional:\n\n${top5List}\n\nKesimpulan Eksekutif:\nProvinsi di Kuadran I (Jawa Timur, Jawa Tengah, Sumatera Utara) memiliki kematangan ekosistem investasi dan pasar yang seimbang antara skala ekonomi besar dan efisiensi penyerapan modal.`;
      } else if (lowerQ.includes("icor") || lowerQ.includes("formula") || lowerQ.includes("efisiensi modal")) {
        answer = `Penjelasan Metodologi Efisiensi Modal (ICOR) & Formula 6 Indikator RIRU:\n\n1. Incremental Capital Output Ratio (ICOR):\nICOR mengukur rasio antara tambahan investasi kapital (Delta K) terhadap tambahan pertumbuhan output riil (Delta Y / Delta PDRB ADHK). Nilai ICOR yang lebih rendah (kisaran 3.0 - 5.5) menunjukkan efisiensi investasi yang sangat tinggi, sedangkan ICOR tinggi (> 7.5) menunjukkan investasi padat modal jangka panjang (seperti smelter logam dan kilang) atau adanya tantangan biaya logistik.\n\n2. Formula Komposit Kesiapan RIRU (Skala 0 - 100):\nRRS = (0.20 x Z_inv) + (0.20 x Z_pdrb) + (0.15 x Z_exp) + (0.15 x Z_lab) + (0.15 x Z_sec) + (0.15 x Z_icor)\n\n3. Matriks 4 Kuadran:\n- Sumbu X (Skala Pasar & Modal): Kombinasi Investasi, PDRB, dan Ekspor.\n- Sumbu Y (Efisiensi Struktur & Daya Serap): Kombinasi Efisiensi ICOR, Tenaga Kerja (TKK), dan Diversifikasi Sektor.`;
      } else if (
        lowerQ.includes("sulawesi tengah") ||
        lowerQ.includes("maluku utara") ||
        lowerQ.includes("hilirisasi")
      ) {
        const sulteng = riruDataRaw.provinces.find((p) => p.provinsi === "Sulawesi Tengah");
        const malut = riruDataRaw.provinces.find((p) => p.provinsi === "Maluku Utara");
        answer = `Dampak Hilirisasi Sektor Mineral terhadap PDRB dan Ekspor Daerah (2015-2026):\n\n1. Sulawesi Tengah (Peringkat RIRU #${sulteng?.rank}, Skor: ${sulteng?.riru_score}/100):\n- Realisasi Investasi Rata-rata: ${formatRupiah(sulteng?.avg_investasi_tahunan_miliar || 0)}/tahun (didominasi PMA smelter nikel).\n- Ekspor Daerah: $${sulteng?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun, melonjak signifikan setelah ekspor fero-nikel beroperasi penuh.\n- Karakteristik: Masuk dalam Kuadran III (Capital-Intensive), di mana investasi masif membutuhkan percepatan pelatihan vokasi tenaga kerja lokal.\n\n2. Maluku Utara (Peringkat RIRU #${malut?.rank}, Skor: ${malut?.riru_score}/100):\n- Investasi Rata-rata: ${formatRupiah(malut?.avg_investasi_tahunan_miliar || 0)}/tahun dengan rasio investasi terhadap PDRB tertinggi nasional.\n- Ekspor Daerah: $${malut?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun.\n- Dampak PDRB: Industri pengolahan mencatat laju pertumbuhan ekonomi riil tahunan yang sempat menyentuh rekor tertinggi di Indonesia.\n\nKesimpulan Analis:\nHilirisasi mineral mentransformasi neraca perdagangan dan PDRB daerah secara eksponensial. RIRU di wilayah ini diprioritaskan pada integrasi industri hilir turunan (seperti baterai EV) dan peningkatan kapasitas tenaga kerja lokal.`;
      } else if (
        (lowerQ.includes("jawa barat") && lowerQ.includes("jawa timur")) ||
        lowerQ.includes("bandingkan")
      ) {
        const jabar = riruDataRaw.provinces.find((p) => p.provinsi === "Jawa Barat");
        const jatim = riruDataRaw.provinces.find((p) => p.provinsi === "Jawa Timur");
        answer = `Komparasi Kesiapan RIRU: Jawa Barat vs Jawa Timur (2015-2026):\n\n1. Provinsi Jawa Timur (Peringkat RIRU #${jatim?.rank}, Skor: ${jatim?.riru_score}/100):\n- Realisasi Investasi: ${formatRupiah(jatim?.avg_investasi_tahunan_miliar || 0)}/tahun.\n- Capaian PDRB: ${formatRupiah(jatim?.avg_pdrb_tahunan_miliar || 0)}/tahun.\n- Nilai Ekspor: $${jatim?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun.\n- Efisiensi ICOR: ${jatim?.avg_icor} (Sangat efisien, masuk Kuadran I Mature & Prime Destination).\n- Karakteristik: Struktur modal berimbang antara PMA dan PMDN dengan ketahanan industri domestik yang tinggi.\n\n2. Provinsi Jawa Barat (Peringkat RIRU #${jabar?.rank}, Skor: ${jabar?.riru_score}/100):\n- Realisasi Investasi: ${formatRupiah(jabar?.avg_investasi_tahunan_miliar || 0)}/tahun (tertinggi nasional).\n- Capaian PDRB: ${formatRupiah(jabar?.avg_pdrb_tahunan_miliar || 0)}/tahun.\n- Nilai Ekspor: $${jabar?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun (penyumbang ekspor manufaktur terbesar).\n- Efisiensi ICOR: ${jabar?.avg_icor}.\n- Karakteristik: Magnet investasi PMA manufaktur otomotif, semikonduktor, data center, dan ekosistem kendaraan listrik.\n\nRekomendasi Kebijakan:\nJawa Timur unggul dalam efisiensi modal dan penyebaran industri agro-manufaktur, sementara Jawa Barat memimpin dalam skala ekspor dan daya tarik investor global.`;
      } else if (matchedRiru) {
        answer = `Profil Analisis Kesiapan RIRU & Makroekonomi ${matchedRiru.provinsi}:\n\n- Peringkat Kesiapan RIRU: #${matchedRiru.rank} Nasional (Skor Komposit: ${matchedRiru.riru_score}/100)\n- Klasifikasi Matriks: ${matchedRiru.kuadran}\n- Rata-rata Investasi Tahunan: ${formatRupiah(matchedRiru.avg_investasi_tahunan_miliar)}/tahun\n- Rata-rata PDRB Nominal: ${formatRupiah(matchedRiru.avg_pdrb_tahunan_miliar)}/tahun\n- Kinerja Ekspor Daerah: $${matchedRiru.avg_ekspor_tahunan_usd_juta} Juta USD/tahun\n- Penyerapan Tenaga Kerja: Tingkat Kesempatan Kerja (TKK) ${matchedRiru.tkk_pct}%\n- Sektor Dominan PDRB: ${matchedRiru.sektor_dominan} (${matchedRiru.porsi_sektor_dominan_pct}% pangsa)\n- Efisiensi Modal (ICOR): ${matchedRiru.avg_icor}\n\nRekomendasi Kebijakan RIRU:\n${matchedRiru.rekomendasi_riru}`;
      } else {
        answer = `Tinjauan Makroekonomi Kesiapan RIRU Nasional (BKPM & BPS 2015-2026):\n\n1. Pemerataan Investasi Antar-Pulau:\nRealisasi investasi di luar Pulau Jawa terus menunjukkan ekspansi kuat (>52%), dipimpin sektor hilirisasi nikel dan bauksit di Sulawesi dan Maluku serta proyek energi baru terbarukan di Kalimantan.\n\n2. Kesiapan Pembentukan RIRU:\nProvinsi di Kuadran I (Mature & Prime) siap mengadopsi investasi high-tech dan green taxonomy, sedangkan provinsi di Kuadran II dan III difasilitasi untuk akselerasi perizinan dan integrasi rantai pasok lokal.\n\n3. Sinergi 6 Indikator:\nUntuk meningkatkan daya saing investasi daerah, unit RIRU daerah perlu memantau tidak hanya nominal investasi, tetapi juga efisiensi ICOR, daya serap tenaga kerja, dan nilai tambah ekspor produk olahan.`;
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
    }, 500);
  };

  const handleDownloadBrief = () => {
    const report = `# EXECUTIVE BRIEF: ANALISIS MAKROEKONOMI & KESIAPAN RIRU INDONESIA (2015-2026)
Badan Pusat Statistik (BPS) & Kementerian Investasi / BKPM
Tanggal Dibuat: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}

---

## 1. RINGKASAN STRATEGIS
Laporan ini mengintegrasikan data realisasi investasi PMA/PMDN (BKPM) dengan capaian Produk Domestik Regional Bruto (BPS) dan 4 indikator kesiapan Regional Investment Relations Unit (RIRU) di 38 provinsi periode 2015-2026.

## 2. METODOLOGI 6 INDIKATOR RIRU
1. Skala Investasi Modal (BKPM) - Bobot 20%
2. Skala PDRB Daerah (BPS) - Bobot 20%
3. Daya Saing Ekspor Daerah (BPS) - Bobot 15%
4. Penyerapan Tenaga Kerja / TKK (BPS) - Bobot 15%
5. Diversifikasi & Dominasi Sektor - Bobot 15%
6. Efisiensi Alokasi Modal (ICOR Kuartalan) - Bobot 15%

## 3. HASIL PEMETAAN MATRIKS 4 KUADRAN
- Kuadran I (Mature & Prime Destination): Jawa Timur, Jawa Barat, Jawa Tengah, DKI Jakarta, Sumatera Utara.
- Kuadran II (High-Efficiency Emerging): Bali, DI Yogyakarta, Sulawesi Selatan, Lampung, Sumatera Barat.
- Kuadran III (Capital-Intensive Hilirisasi): Sulawesi Tengah, Maluku Utara, Kalimantan Timur, Papua Barat.
- Kuadran IV (Nascent / Basic Readiness): Maluku, Sulawesi Barat, Gorontalo, NTT, Papua Selatan.

## 4. REKOMENDASI UNTUK INVESTOR RELATIONS (RIRU)
- Mendorong transisi dari investasi padat modal ekstraktif ke industri manufaktur turunan bernilai tambah tinggi.
- Memperkuat program pelatihan vokasi daerah untuk meningkatkan elastisitas penyerapan tenaga kerja lokal.
- Menjaga rasio ICOR tetap efisien melalui pemangkasan biaya logistik dan deregulasi perizinan terintegrasi (OSS).
`;

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Executive_Brief_RIRU_Investasi_PDRB_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#0b192e] to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm flex items-center gap-2">
              AI Macroeconomic Analyst &amp; RIRU Intelligence
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Online
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 font-medium">
              Analisis cerdas terhubung dengan dataset BKPM, BPS, dan Kesiapan RIRU 38 Provinsi (2015&ndash;2026)
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBrief}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-sm"
          title="Unduh Laporan Ringkasan Eksekutif (.md)"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Unduh Executive Brief</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl ${
                m.role === "user"
                  ? "bg-blue-900 text-white rounded-br-none shadow-sm"
                  : "bg-white text-[#0f172a] border border-slate-200 rounded-bl-none shadow-sm font-medium"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <span
                className={`text-[10px] block mt-2 text-right ${
                  m.role === "user" ? "text-blue-200" : "text-slate-400"
                }`}
              >
                {m.time}
              </span>
            </div>

            {m.role === "user" && (
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs justify-start items-center">
            <div className="w-7 h-7 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="font-semibold text-xs">Menganalisis data makroekonomi &amp; kesiapan RIRU...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Saran Topik:</span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold shrink-0 transition-all border border-slate-200 text-left"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan analisis kesiapan RIRU, efisiensi ICOR, atau provinsi tertentu..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
}
