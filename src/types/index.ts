export interface MergedRecord {
  provinsi: string;
  kode_provinsi: string;
  region: string;
  tahun: number;
  triwulan: number;
  periode: string;
  investasi_total_milyar: number;
  investasi_pma_milyar: number;
  investasi_pmdn_milyar: number;
  investasi_total_usd_juta: number;
  pdrb_adhk_milyar: number;
  pdrb_adhb_milyar: number;
  rasio_investasi_pdrb_persen: number;
  pertumbuhan_pdrb_yoy: number | null;
  pertumbuhan_investasi_yoy: number | null;
}

export interface ProvinceProfile {
  provinsi: string;
  region: string;
  lat: number;
  lng: number;
  total_investasi_kumulatif_milyar: number;
  investasi_pma_milyar: number;
  investasi_pmdn_milyar: number;
  pma_share_percent: number;
  pmdn_share_percent: number;
  latest_pdrb_adhb_milyar: number;
  latest_pdrb_adhk_milyar: number;
  latest_investasi_milyar: number;
  avg_rasio_investasi_pdrb: number;
  rank_investasi: number;
}

export interface SectorItem {
  nama_sektor?: string;
  sektor?: string;
  sektor_utama?: string;
  total_investasi_milyar?: number;
  pma_milyar?: number;
  pmdn_milyar?: number;
  total_pdrb_adhb_milyar?: number;
}

export interface SectorComparison {
  bkpm_sectors: SectorItem[];
  bps_sectors: SectorItem[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  source: string;
  summary: string;
  provinces: string[];
  sectors: string[];
  impact: string;
}

export interface FilterState {
  selectedProvince: string;
  startYear: number;
  endYear: number;
  selectedRegion: string;
  selectedQuarter: string;
}
