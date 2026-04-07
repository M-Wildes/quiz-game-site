import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type { Difficulty, QuizUploadPayload } from "@/lib/types";
import { calculateQuizOutcome } from "@/lib/xp";

function normalizeDifficulty(value: string | undefined): Difficulty | null {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }

  return null;
}

function parsePayload(body: Record<string, unknown>): QuizUploadPayload | null {
  const difficulty = normalizeDifficulty(String(body.difficulty ?? ""));
  const correctAnswers = Number(body.correctAnswers ?? body.correct_answers);
  const totalQuestions = Number(body.totalQuestions ?? body.total_questions);
  const durationMs = Number(body.durationMs ?? body.duration_ms);

  if (
    !difficulty ||
    !Number.isFinite(correctAnswers) ||
    !Number.isFinite(totalQuestions) ||
    !Number.isFinite(durationMs)
  ) {
    return null;
  }

  return {
    quizType: String(body.quizType ?? body.quiz_type ?? "standard").trim(),
    category: String(body.category ?? "General").trim(),
    difficulty,
    correctAnswers,
    totalQuestions,
    durationMs,
    streakBonus: Boolean(body.streakBonus ?? body.streak_bonus ?? false),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const payload = parsePayload(body);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid quiz payload." },
      {
        status: 400,
      },
    );
  }

  const result = calculateQuizOutcome(payload);

  if (!hasSupabaseEnv()) {
    return NextResponse.json({
      mode: "preview",
      result,
    });
  }

  const user = await getRequestUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated." },
      {
        status: 401,
      },
    );
  }

  const supabase = createServiceRoleSupabaseClient();

  if (!supabase) {
    return NextResponse.json({
      mode: "validated-only",
      result,
    });
  }

  const { data: seasonRows } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .limit(1);

  const seasonId = seasonRows?.[0]?.id ?? null;

  const { data: inserted, error } = await supabase
    .from("quiz_results")
    .insert({
      user_id: user.id,
      quiz_type: payload.quizType,
      category: payload.category,
      difficulty: payload.difficulty,
      score: result.score,
      correct_answers: result.correctAnswers,
      total_questions: result.totalQuestions,
      duration_ms: payload.durationMs,
      xp_earned: result.xpEarned,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      },
    );
  }

  await supabase.from("leaderboard_entries").insert({
    user_id: user.id,
    season_id: seasonId,
    category: payload.category,
    score: result.score,
    xp: result.xpEarned,
    streak: payload.streakBonus ? 1 : 0,
  });

  return NextResponse.json({
    mode: "persisted",
    quizResultId: inserted.id,
    result,
  });
}
