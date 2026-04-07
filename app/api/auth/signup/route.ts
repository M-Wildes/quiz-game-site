import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseEnv } from "@/lib/env";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase env vars are missing." },
      {
        status: 503,
      },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    displayName?: string;
    username?: string;
  };

  const email = body.email?.trim();
  const password = body.password?.trim();
  const displayName = body.displayName?.trim();
  const username = body.username?.trim();

  if (!email || !password || !displayName || !username) {
    return NextResponse.json(
      { error: "Email, password, displayName, and username are required." },
      {
        status: 400,
      },
    );
  }

  const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        username,
      },
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json({
    user: data.user,
    session: data.session
      ? {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at,
        }
      : null,
  });
}
