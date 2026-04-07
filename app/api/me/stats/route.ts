import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { getDashboardSnapshotForUser } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";

export async function GET(request: Request) {
  const user = await getRequestUser(request);

  if (!user && hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Not authenticated." },
      {
        status: 401,
      },
    );
  }

  const snapshot = await getDashboardSnapshotForUser(user?.id);
  return NextResponse.json(snapshot);
}
