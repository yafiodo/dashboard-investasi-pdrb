import { MergedRecord } from "@/types";

export function formatRupiah(valMilyar: number): string {
  if (!valMilyar || isNaN(valMilyar)) return "Rp 0";
  if (valMilyar >= 1000) {
    const triliun = valMilyar / 1000;
    return `Rp ${triliun.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} T`;
  }
  return `Rp ${valMilyar.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 1 })} M`;
}

export function formatUSD(valJuta: number): string {
  if (!valJuta || isNaN(valJuta)) return "$0";
  if (valJuta >= 1000) {
    const miliar = valJuta / 1000;
    return `$${miliar.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} B`;
  }
  return `$${valJuta.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })} M`;
}

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - avgX;
    const diffY = y[i] - avgY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return Number((num / den).toFixed(2));
}

export function filterMergedData(
  data: MergedRecord[],
  options: {
    province?: string;
    region?: string;
    startYear?: number;
    endYear?: number;
    quarter?: number;
  }
): MergedRecord[] {
  return data.filter((item) => {
    if (options.province && options.province !== "Semua" && item.provinsi !== options.province) {
      return false;
    }
    if (options.region && options.region !== "Semua" && item.region !== options.region) {
      return false;
    }
    if (options.startYear && item.tahun < options.startYear) {
      return false;
    }
    if (options.endYear && item.tahun > options.endYear) {
      return false;
    }
    if (options.quarter && item.triwulan !== options.quarter) {
      return false;
    }
    return true;
  });
}

export function aggregateByPeriod(data: MergedRecord[]): {
  periode: string;
  tahun: number;
  triwulan: number;
  investasi_total_milyar: number;
  investasi_pma_milyar: number;
  investasi_pmdn_milyar: number;
  pdrb_adhk_milyar: number;
  pdrb_adhb_milyar: number;
  rasio_investasi_pdrb: number;
}[] {
  const map: { [key: string]: any } = {};

  data.forEach((item) => {
    const p = item.periode;
    if (!map[p]) {
      map[p] = {
        periode: p,
        tahun: item.tahun,
        triwulan: item.triwulan,
        investasi_total_milyar: 0,
        investasi_pma_milyar: 0,
        investasi_pmdn_milyar: 0,
        pdrb_adhk_milyar: 0,
        pdrb_adhb_milyar: 0,
      };
    }
    map[p].investasi_total_milyar += item.investasi_total_milyar;
    map[p].investasi_pma_milyar += item.investasi_pma_milyar;
    map[p].investasi_pmdn_milyar += item.investasi_pmdn_milyar;
    map[p].pdrb_adhk_milyar += item.pdrb_adhk_milyar;
    map[p].pdrb_adhb_milyar += item.pdrb_adhb_milyar;
  });

  return Object.values(map)
    .map((m) => ({
      ...m,
      investasi_total_milyar: Number(m.investasi_total_milyar.toFixed(2)),
      investasi_pma_milyar: Number(m.investasi_pma_milyar.toFixed(2)),
      investasi_pmdn_milyar: Number(m.investasi_pmdn_milyar.toFixed(2)),
      pdrb_adhk_milyar: Number(m.pdrb_adhk_milyar.toFixed(2)),
      pdrb_adhb_milyar: Number(m.pdrb_adhb_milyar.toFixed(2)),
      rasio_investasi_pdrb:
        m.pdrb_adhb_milyar > 0
          ? Number(((m.investasi_total_milyar / m.pdrb_adhb_milyar) * 100).toFixed(2))
          : 0,
    }))
    .sort((a, b) => a.tahun - b.tahun || a.triwulan - b.triwulan);
}
