import { NextResponse } from "next/server";
import { getLatestRelease } from "@/lib/downloads";

export async function GET() {
  const release = await getLatestRelease();
  return NextResponse.json(release);
}
