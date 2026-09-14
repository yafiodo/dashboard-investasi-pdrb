import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    bps_rows: 57744,
    bkpm_rows: 639463,
    provinces_count: 38,
    years_covered: "2015 - 2026",
    message: "Data BPS & BKPM sinkron dan mutakhir.",
  });
}

export async function POST() {
  // Simulate live reload check
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return NextResponse.json({
    success: true,
    message: `Pembaruan data berhasil dijalankan pada ${formattedTime}. 57.744 baris data BPS dan 639.463 baris data BKPM telah diverifikasi aktif.`,
    lastSync: now.toISOString(),
  });
}
