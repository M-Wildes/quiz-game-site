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
  };

  const email = body.email?.trim();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      {
        status: 400,
      },
    );
  }

  const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to sign in." },
      {
        status: 401,
      },
    );
  }

  return NextResponse.json({
    user: data.user,
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    },
  });
}
