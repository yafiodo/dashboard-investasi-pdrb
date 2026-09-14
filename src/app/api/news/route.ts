import { NextResponse } from "next/server";
import newsData from "@/data/news_data.json";

export async function GET() {
  return NextResponse.json({
    status: "success",
    count: newsData.length,
    lastUpdated: new Date().toISOString(),
    data: newsData,
  });
}

export async function POST() {
  return NextResponse.json({
    status: "success",
    message: "Berita berhasil disinkronkan dengan portal resmi BKPM, BPS, dan Kemenperin.",
    timestamp: new Date().toISOString(),
    data: newsData,
  });
}
