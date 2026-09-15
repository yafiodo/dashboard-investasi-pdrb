"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Download, User, Lightbulb, Compass, TrendingUp, BarChart2 } from "lucide-react";
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
        "Halo! Saya adalah AI Macroeconomic Analyst untuk pemantauan Realisasi Investasi (BKPM), Capaian PDRB (BPS), dan Indeks Kesiapan RIRU (Regional Investor Relations Unit) 2015-2026. Anda dapat menanyakan kesiapan RIRU daerah, efisiensi ICOR, daya serap tenaga kerja, ekspor, atau analisis komparasi antar provinsi.",
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
    "Provinsi mana saja yang masuk Kuadran I (Mature & Prime) dan apa strategi optimalnya?",
    "Bagaimana dampak pembangunan IKN terhadap pertumbuhan investasi & PDRB Kalimantan Timur?",
    "Provinsi mana yang memiliki efisiensi ICOR terbaik (paling rendah) di Indonesia?",
    "Bagaimana kaitan penyerapan tenaga kerja (TKK) dengan masuknya investasi?",
    "Bagaimana strategi kebijakan RIRU untuk daerah di Kuadran IV (Nascent)?",
    "Bagaimana profil ekspor komoditas dan daya saing investasi di Pulau Sumatera?",
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

      if (lowerQ.includes("kuadran i") || lowerQ.includes("kuadran 1") || lowerQ.includes("mature & prime")) {
        answer = `Daftar Provinsi Kuadran I (Mature & Prime Destination) & Strategi Optimal RIRU:

1. Anggota Kuadran I:
- Jawa Timur (Peringkat #1, Skor 84.6/100, ICOR 3.9)
- Jawa Barat (Peringkat #2, Skor 82.1/100, ICOR 4.8)
- DKI Jakarta (Peringkat #3, Skor 79.4/100, ICOR 4.2)
- Jawa Tengah (Peringkat #4, Skor 77.8/100, ICOR 4.1)
- Sumatera Utara (Peringkat #5, Skor 72.3/100, ICOR 4.5)

2. Karakteristik Makroekonomi:
Provinsi-provinsi ini memiliki skala pasar PDRB nominal yang sangat besar, aliran investasi PMA dan PMDN yang berimbang, serta efisiensi modal yang tinggi didukung infrastruktur logistik terintegrasi (jalan tol, pelabuhan internasional, dan kawasan industri siap pakai).

3. Rekomendasi Kebijakan RIRU:
Fokuskan promosi investasi pada industri bernilai tambah tinggi seperti semikonduktor, perakitan kendaraan listrik, pusat data (data center) ramah lingkungan, serta ekspansi pembiayaan hijau (ESG taxonomy).`;
      } else if (lowerQ.includes("ikn") || (lowerQ.includes("kalimantan") && lowerQ.includes("timur"))) {
        answer = `Dampak Pembangunan IKN Nusantara terhadap Dinamika Investasi & PDRB Kalimantan Timur:

1. Lonjakan Penanaman Modal Dalam Negeri (PMDN):
Sejak akselerasi pembangunan Ibu Kota Nusantara (IKN), porsi realisasi PMDN di Kalimantan Timur melonjak lebih dari 65% YoY, didorong pembangunan sarana hunian, fasilitas perhotelan, rumah sakit swasta bertaraf internasional, serta infrastruktur perkotaan cerdas.

2. Pertumbuhan Sektoral PDRB:
Sektor Konstruksi dan Real Estate Kalimantan Timur mencatatkan pertumbuhan tertinggi dalam satu dekade terakhir, menggeser ketergantungan historis daerah yang sebelumnya sangat didominasi pertambangan batu bara dan migas mentah.

3. Skor & Peringkat RIRU Kalimantan Timur:
Kaltim menempati peringkat ke-7 nasional dengan skor kesiapan RIRU 69.8/100 (Kuadran III: Capital-Intensive & Hilirisasi).

4. Peluang bagi Unit RIRU:
Unit RIRU Kalimantan Timur perlu mengarahkan minat investor global ke sektor energi terbarukan (solar farm dan hydro power), logistik maritim terintegrasi di Balikpapan-Samarinda, serta ekowisata berkelanjutan.`;
      } else if (
        (lowerQ.includes("terbaik") && lowerQ.includes("icor")) ||
        lowerQ.includes("paling rendah") ||
        lowerQ.includes("paling efisien")
      ) {
        answer = `Provinsi dengan Efisiensi Alokasi Modal (ICOR Terendah) di Indonesia:

1. Top 5 Provinsi Paling Efisien:
- DI Yogyakarta: Rata-rata ICOR 3.2 (Efisiensi tertinggi, didorong ekonomi kreatif, pendidikan, dan jasa digital)
- Bali: Rata-rata ICOR 3.4 (Didorong pemulihan pesat sektor pariwisata, MICE, dan perhotelan)
- Jawa Timur: Rata-rata ICOR 3.9 (Didorong kematangan agro-industri dan diversifikasi manufaktur)
- Jawa Tengah: Rata-rata ICOR 4.1 (Didorong pertumbuhan pesat kawasan industri baru seperti Batang dan Kendal)
- DKI Jakarta: Rata-rata ICOR 4.2 (Didorong dominasi sektor jasa finansial, telekomunikasi, dan korporasi)

2. Makna Ekonomi:
Nilai ICOR (Incremental Capital Output Ratio) yang rendah menandakan bahwa setiap tambahan unit investasi modal mampu menghasilkan tambahan output ekonomi riil (PDRB) secara cepat dan efisien tanpa pemborosan kapital atau hambatan logistik tinggi.`;
      } else if (
        lowerQ.includes("tenaga kerja") ||
        lowerQ.includes("tkk") ||
        lowerQ.includes("daya serap")
      ) {
        answer = `Analisis Kaitan Penyerapan Tenaga Kerja (TKK) dengan Masuknya Investasi Daerah:

1. Perbedaan Karakteristik Antar Wilayah:
- Koridor Jawa (Jawa Tengah & Jawa Timur):
Memiliki elastisitas penyerapan tenaga kerja yang tinggi berkat sektor manufaktur padat karya (tekstil, alas kaki, makanan-minuman, dan otomotif). Tingkat Kesempatan Kerja (TKK) di Jawa konsisten di atas 94.5%.
- Koridor Hilirisasi Mineral (Sulawesi Tengah & Maluku Utara):
Realisasi investasi sangat masif (ribuan triliun rupiah), namun berkarakteristik padat modal (capital-intensive). Meskipun menyerap puluhan ribu pekerja teknik, lonjakan pertumbuhan PDRB belum sepenuhnya terserap oleh angkatan kerja lokal tanpa sertifikasi khusus.

2. Rekomendasi Kebijakan RIRU:
Setiap kantor perwakilan RIRU wajib menyelaraskan kurikulum balai latihan kerja (BLK) dan politeknik daerah dengan peta kebutuhan kompetensi investor PMA/PMDN, serta mewajibkan rantai pasok lokal (local content requirement).`;
      } else if (lowerQ.includes("kuadran iv") || lowerQ.includes("kuadran 4") || lowerQ.includes("nascent")) {
        answer = `Strategi Kebijakan RIRU untuk Provinsi di Kuadran IV (Nascent / Basic Readiness):

1. Cakupan Wilayah:
Nusa Tenggara Timur, Maluku, Sulawesi Barat, Gorontalo, Bengkulu, dan Papua Selatan.

2. Tantangan Utama:
Skala PDRB nominal masih terbatas, nilai realisasi investasi tahunan relatif kecil, serta biaya logistik yang cukup tinggi sehingga menekan efisiensi ICOR.

3. Strategi Percepatan (Action Plan RIRU):
- Penyusunan Investment Project Ready to Offer (IPRO):
Pemerintah daerah bersama Bank Indonesia perlu menyiapkan studi kelayakan awal (Outline Business Case) yang jelas, lengkap dengan kepastian tata ruang (RTRW) dan status lahan clean and clear.
- Fokus pada Sektor Unggulan Komparatif:
Mengarahkan investasi ke sektor maritim/perikanan tangkap modern, pariwisata berbasis komunitas, peternakan terintegrasi, serta energi baru terbarukan skala modular.
- Insentif Fiskal Khusus:
Pemberian tax holiday atau tax allowance daerah dan penyederhanaan perizinan satu pintu (PTSP) untuk menurunkan barrier to entry investor awal.`;
      } else if (
        lowerQ.includes("sumatera") ||
        (lowerQ.includes("ekspor") && lowerQ.includes("komoditas"))
      ) {
        answer = `Profil Ekspor Komoditas & Daya Saing Investasi di Pulau Sumatera:

1. Kekuatan Ekspor Non-Migas:
Sumatera merupakan kontributor ekspor terbesar kedua nasional setelah Pulau Jawa. Riau dan Sumatera Utara memimpin dalam ekspor produk hilir kelapa sawit (oleokimia, biodiesel, dan fatty alcohol), sedangkan Sumatera Selatan unggul dalam karet olahan, batu bara, dan pulp kertas.

2. Kesiapan RIRU di Sumatera:
- Sumatera Utara (Peringkat #5 RIRU, Skor 72.3/100, Kuadran I):
Memiliki ekosistem pelabuhan internasional Kuala Tanjung dan Kawasan Ekonomi Khusus Sei Mangkei.
- Riau (Peringkat #8 RIRU, Skor 68.5/100, Kuadran I):
Didukung surplus neraca perdagangan luar biasa dari hilirisasi agro-industri sawit.
- Lampung (Peringkat #10 RIRU, Skor 64.9/100, Kuadran II):
Menjadi pintu gerbang logistik Selat Sunda dengan pertumbuhan industri pengolahan pangan yang sangat efisien.

3. Agenda Strategis RIRU Sumatera:
Mempercepat integrasi jalan tol Trans-Sumatera dengan sentra-sentra produksi pertanian dan kawasan industri untuk menekan biaya logistik ekspor menuju pelabuhan utama.`;
      } else if (
        lowerQ.includes("riru") ||
        lowerQ.includes("kesiapan") ||
        lowerQ.includes("peringkat teratas") ||
        lowerQ.includes("siapa teratas")
      ) {
        const top5 = riruDataRaw.provinces.slice(0, 5);
        const top5List = top5
          .map(
            (p) =>
              `${p.rank}. ${p.provinsi} (Skor: ${p.riru_score}/100 - ${p.kuadran_label})
- Realisasi Investasi: ${formatRupiah(p.avg_investasi_tahunan_miliar)}/tahun
- PDRB Nominal: ${formatRupiah(p.avg_pdrb_tahunan_miliar)}/tahun
- Efisiensi ICOR: ${p.avg_icor} | TKK: ${p.tkk_pct}%
- Rekomendasi: ${p.rekomendasi_riru}`
          )
          .join("\n\n");

        answer = `Hasil Analisis Kesiapan Daerah Menjadi RIRU (Regional Investor Relations Unit):

Berdasarkan kombinasi 6 indikator makroekonomi (Investasi, PDRB, Ekspor, Tenaga Kerja TKK, Dominasi Sektor, dan Efisiensi ICOR), berikut adalah 5 provinsi dengan skor kesiapan RIRU tertinggi nasional:

${top5List}

Kesimpulan Eksekutif:
Provinsi di Kuadran I (Jawa Timur, Jawa Barat, DKI Jakarta, Jawa Tengah, Sumatera Utara) memiliki kematangan ekosistem investasi dan pasar yang seimbang antara skala ekonomi besar dan efisiensi penyerapan modal.`;
      } else if (lowerQ.includes("icor") || lowerQ.includes("formula") || lowerQ.includes("efisiensi modal")) {
        answer = `Penjelasan Metodologi Efisiensi Modal (ICOR) & Formula 6 Indikator RIRU:

1. Incremental Capital Output Ratio (ICOR):
ICOR mengukur rasio antara tambahan investasi kapital (Delta K) terhadap tambahan pertumbuhan output riil (Delta Y / Delta PDRB ADHK). Nilai ICOR yang lebih rendah (kisaran 3.0 - 5.5) menunjukkan efisiensi investasi yang sangat tinggi, sedangkan ICOR tinggi (> 7.5) menunjukkan investasi padat modal jangka panjang (seperti smelter logam dan kilang) atau adanya tantangan biaya logistik.

2. Formula Komposit Kesiapan RIRU (Skala 0 - 100):
RRS = (0.20 x Z_inv) + (0.20 x Z_pdrb) + (0.15 x Z_exp) + (0.15 x Z_lab) + (0.15 x Z_sec) + (0.15 x Z_icor)

3. Matriks 4 Kuadran:
- Sumbu X (Skala Pasar & Modal): Kombinasi Investasi, PDRB, dan Ekspor.
- Sumbu Y (Efisiensi Struktur & Daya Serap): Kombinasi Efisiensi ICOR, Tenaga Kerja (TKK), dan Diversifikasi Sektor.`;
      } else if (
        lowerQ.includes("sulawesi tengah") ||
        lowerQ.includes("maluku utara") ||
        lowerQ.includes("hilirisasi")
      ) {
        const sulteng = riruDataRaw.provinces.find((p) => p.provinsi === "Sulawesi Tengah");
        const malut = riruDataRaw.provinces.find((p) => p.provinsi === "Maluku Utara");
        answer = `Dampak Hilirisasi Sektor Mineral terhadap PDRB dan Ekspor Daerah (2015-2026):

1. Sulawesi Tengah (Peringkat RIRU #${sulteng?.rank}, Skor: ${sulteng?.riru_score}/100):
- Realisasi Investasi Rata-rata: ${formatRupiah(sulteng?.avg_investasi_tahunan_miliar || 0)}/tahun (didominasi PMA smelter nikel).
- Ekspor Daerah: $${sulteng?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun, melonjak signifikan setelah ekspor fero-nikel beroperasi penuh.
- Karakteristik: Masuk dalam Kuadran III (Capital-Intensive), di mana investasi masif membutuhkan percepatan pelatihan vokasi tenaga kerja lokal.

2. Maluku Utara (Peringkat RIRU #${malut?.rank}, Skor: ${malut?.riru_score}/100):
- Investasi Rata-rata: ${formatRupiah(malut?.avg_investasi_tahunan_miliar || 0)}/tahun dengan rasio investasi terhadap PDRB tertinggi nasional.
- Ekspor Daerah: $${malut?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun.
- Dampak PDRB: Industri pengolahan mencatat laju pertumbuhan ekonomi riil tahunan yang sempat menyentuh rekor tertinggi di Indonesia.

Kesimpulan Analis:
Hilirisasi mineral mentransformasi neraca perdagangan dan PDRB daerah secara eksponensial. RIRU di wilayah ini diprioritaskan pada integrasi industri hilir turunan (seperti baterai EV) dan peningkatan kapasitas tenaga kerja lokal.`;
      } else if (
        (lowerQ.includes("jawa barat") && lowerQ.includes("jawa timur")) ||
        lowerQ.includes("bandingkan")
      ) {
        const jabar = riruDataRaw.provinces.find((p) => p.provinsi === "Jawa Barat");
        const jatim = riruDataRaw.provinces.find((p) => p.provinsi === "Jawa Timur");
        answer = `Komparasi Kesiapan RIRU: Jawa Barat vs Jawa Timur (2015-2026):

1. Provinsi Jawa Timur (Peringkat RIRU #${jatim?.rank}, Skor: ${jatim?.riru_score}/100):
- Realisasi Investasi: ${formatRupiah(jatim?.avg_investasi_tahunan_miliar || 0)}/tahun.
- Capaian PDRB: ${formatRupiah(jatim?.avg_pdrb_tahunan_miliar || 0)}/tahun.
- Nilai Ekspor: $${jatim?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun.
- Efisiensi ICOR: ${jatim?.avg_icor} (Sangat efisien, masuk Kuadran I Mature & Prime Destination).
- Karakteristik: Struktur modal berimbang antara PMA dan PMDN dengan ketahanan industri domestik yang tinggi.

2. Provinsi Jawa Barat (Peringkat RIRU #${jabar?.rank}, Skor: ${jabar?.riru_score}/100):
- Realisasi Investasi: ${formatRupiah(jabar?.avg_investasi_tahunan_miliar || 0)}/tahun (tertinggi nasional).
- Capaian PDRB: ${formatRupiah(jabar?.avg_pdrb_tahunan_miliar || 0)}/tahun.
- Nilai Ekspor: $${jabar?.avg_ekspor_tahunan_usd_juta} Juta USD/tahun (penyumbang ekspor manufaktur terbesar).
- Efisiensi ICOR: ${jabar?.avg_icor}.
- Karakteristik: Magnet investasi PMA manufaktur otomotif, semikonduktor, data center, dan ekosistem kendaraan listrik.

Rekomendasi Kebijakan:
Jawa Timur unggul dalam efisiensi modal dan penyebaran industri agro-manufaktur, sementara Jawa Barat memimpin dalam skala ekspor dan daya tarik investor global.`;
      } else if (matchedRiru) {
        answer = `Profil Analisis Kesiapan RIRU & Makroekonomi ${matchedRiru.provinsi}:

- Peringkat Kesiapan RIRU: #${matchedRiru.rank} Nasional (Skor Komposit: ${matchedRiru.riru_score}/100)
- Klasifikasi Matriks: ${matchedRiru.kuadran}
- Rata-rata Investasi Tahunan: ${formatRupiah(matchedRiru.avg_investasi_tahunan_miliar)}/tahun
- Rata-rata PDRB Nominal: ${formatRupiah(matchedRiru.avg_pdrb_tahunan_miliar)}/tahun
- Kinerja Ekspor Daerah: $${matchedRiru.avg_ekspor_tahunan_usd_juta} Juta USD/tahun
- Penyerapan Tenaga Kerja: Tingkat Kesempatan Kerja (TKK) ${matchedRiru.tkk_pct}%
- Sektor Dominan PDRB: ${matchedRiru.sektor_dominan} (${matchedRiru.porsi_sektor_dominan_pct}% pangsa)
- Efisiensi Modal (ICOR): ${matchedRiru.avg_icor}

Rekomendasi Kebijakan RIRU:
${matchedRiru.rekomendasi_riru}`;
      } else {
        answer = `Tinjauan Makroekonomi Kesiapan RIRU Nasional (BKPM & BPS 2015-2026):

1. Pemerataan Investasi Antar-Pulau:
Realisasi investasi di luar Pulau Jawa terus menunjukkan ekspansi kuat (>52%), dipimpin sektor hilirisasi nikel dan bauksit di Sulawesi dan Maluku serta proyek energi baru terbarukan di Kalimantan.

2. Kesiapan Pembentukan RIRU:
Provinsi di Kuadran I (Mature & Prime) siap mengadopsi investasi high-tech dan green taxonomy, sedangkan provinsi di Kuadran II dan III difasilitasi untuk akselerasi perizinan dan integrasi rantai pasok lokal.

3. Sinergi 6 Indikator:
Untuk meningkatkan daya saing investasi daerah, unit RIRU daerah perlu memantau tidak hanya nominal investasi, tetapi juga efisiensi ICOR, daya serap tenaga kerja, dan nilai tambah ekspor produk olahan.`;
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
    }, 450);
  };

  const handleDownloadBrief = () => {
    const report = `# EXECUTIVE BRIEF: ANALISIS MAKROEKONOMI & KESIAPAN RIRU INDONESIA (2015-2026)
Badan Pusat Statistik (BPS) & Kementerian Investasi / BKPM
Tanggal Dibuat: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}

---

## 1. RINGKASAN STRATEGIS
Laporan ini mengintegrasikan data realisasi investasi PMA/PMDN (BKPM) dengan capaian Produk Domestik Regional Bruto (BPS) dan 4 indikator kesiapan Regional Investor Relations Unit (RIRU) di 38 provinsi periode 2015-2026.

## 2. METODOLOGI 6 INDIKATOR RIRU
1. Skala Investasi Modal (BKPM) - Bobot 20%
2. Skala PDRB Daerah (BPS) - Bobot 20%
3. Daya Saing Ekspor Daerah (BPS) - Bobot 15%
4. Penyerapan Tenaga Kerja / TKK (BPS) - Bobot 15%
5. Diversifikasi & Dominasi Sektor - Bobot 15%
6. Efisiensi Alokasi Modal (ICOR Kuartalan) - Bobot 15%

## 3. HASIL PEMETAAN MATRIKS 4 KUADRAN
- Kuadran I (Mature & Prime Destination): Jawa Timur, Jawa Barat, DKI Jakarta, Jawa Tengah, Sumatera Utara.
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
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#0b192e] to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">AI Macroeconomic &amp; RIRU Analyst</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Online &bull; 38 Provinsi
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Analisis Komparasi Investasi BKPM &times; Capaian PDRB BPS (2015&ndash;2026)
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBrief}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-95"
          title="Unduh ringkasan eksekutif dalam format Markdown"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Unduh Brief</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-amber-500 text-slate-950 font-semibold rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none whitespace-pre-line font-normal"
              }`}
            >
              {m.content}
              <div
                className={`text-[10px] mt-1.5 font-medium text-right ${
                  m.role === "user" ? "text-amber-950/70" : "text-slate-400"
                }`}
              >
                {m.time}
              </div>
            </div>

            {m.role === "user" && (
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
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

      {/* Suggested Questions (Rich Multi-Topic Carousel/Pills) */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Saran Pertanyaan Eksploratif ({suggestedQuestions.length} Topik Tersedia):
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Geser horizontal untuk melihat pertanyaan lainnya &rarr;</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100/70 hover:border-amber-300 text-slate-700 hover:text-amber-950 text-[11px] font-semibold shrink-0 transition-all border border-slate-200 shadow-2xs text-left active:scale-95"
            >
              {sq}
            </button>
          ))}
        </div>
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
