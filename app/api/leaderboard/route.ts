import { NextResponse } from "next/server";
import { getLeaderboardSnapshot } from "@/lib/data";

export async function GET() {
  const leaderboard = await getLeaderboardSnapshot();
  return NextResponse.json(leaderboard);
}
