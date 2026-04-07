import { getWebsiteUser } from "@/lib/auth";
import {
  mockBattlePass,
  mockDashboard,
  mockLeaderboard,
} from "@/lib/mock-data";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type {
  BattlePassOverview,
  BattlePassTier,
  DashboardSnapshot,
  LeaderboardEntry,
  LeaderboardSnapshot,
} from "@/lib/types";
import { getLevelFromXp, getXpForLevel, getXpForNextLevel } from "@/lib/xp";

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function getDaysLeft(dateValue: string | null | undefined, fallback = 0) {
  if (!dateValue) {
    return fallback;
  }

  const endDate = new Date(dateValue);
  const delta = endDate.getTime() - Date.now();
  return Math.max(Math.ceil(delta / (1000 * 60 * 60 * 24)), 0);
}

function getTopCategories(
  results: Array<{
    category: string | null;
    score: number | null;
    total_questions?: number | null;
    correct_answers?: number | null;
  }>,
) {
  const byCategory = new Map<
    string,
    { totalScore: number; totalCorrect: number; totalQuestions: number; plays: number }
  >();

  for (const result of results) {
    const category = result.category ?? "General";
    const entry = byCategory.get(category) ?? {
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      plays: 0,
    };

    entry.totalScore += asNumber(result.score);
    entry.totalCorrect += asNumber(result.correct_answers);
    entry.totalQuestions += asNumber(result.total_questions);
    entry.plays += 1;
    byCategory.set(category, entry);
  }

  return Array.from(byCategory.entries())
    .map(([category, stats]) => ({
      category,
      averageScore: Math.round(stats.totalScore / Math.max(stats.plays, 1)),
      mastery:
        stats.totalQuestions > 0
          ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
          : 0,
    }))
    .sort((left, right) => right.averageScore - left.averageScore)
    .slice(0, 4);
}

function mapBattlePassTiers(
  tiers:
    | Array<{
        tier_number: number | null;
        xp_required: number | null;
        reward_name: string | null;
        reward_type: string | null;
      }>
    | null,
  currentXp: number,
): BattlePassTier[] {
  if (!tiers?.length) {
    return mockBattlePass.tiers;
  }

  return tiers
    .sort((left, right) => asNumber(left.tier_number) - asNumber(right.tier_number))
    .map((tier) => {
      const xpRequired = asNumber(tier.xp_required);
      return {
        tier: asNumber(tier.tier_number),
        xpRequired,
        reward: tier.reward_name ?? "Mystery reward",
        rarity:
          tier.reward_type === "legendary" || tier.reward_type === "epic"
            ? "legendary"
            : tier.reward_type === "premium"
              ? "premium"
              : "free",
        unlocked: currentXp >= xpRequired,
        claimed: false,
      };
    });
}

export async function getLeaderboardSnapshot(
  limit = 10,
): Promise<LeaderboardSnapshot> {
  const client = createServiceRoleSupabaseClient();

  if (!client) {
    return {
      isPreview: true,
      updatedAt: new Date().toISOString(),
      entries: mockLeaderboard.slice(0, limit),
    };
  }

  try {
    const { data, error } = await client
      .from("leaderboard_entries")
      .select(
        `
          score,
          xp,
          streak,
          category,
          profiles:profiles!leaderboard_entries_user_id_fkey (
            username,
            display_name
          )
        `,
      )
      .order("score", { ascending: false })
      .limit(limit);

    if (error || !data?.length) {
      throw error;
    }

    const entries: LeaderboardEntry[] = data.map((row, index) => {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles;
      const username =
        profile?.display_name || profile?.username || `Player ${index + 1}`;

      return {
        rank: index + 1,
        username,
        score: asNumber(row.score),
        xp: asNumber(row.xp),
        streak: asNumber(row.streak),
        category: row.category ?? "General",
        trend: index < 2 ? "up" : index === 2 ? "new" : "steady",
      };
    });

    return {
      isPreview: false,
      updatedAt: new Date().toISOString(),
      entries,
    };
  } catch {
    return {
      isPreview: true,
      updatedAt: new Date().toISOString(),
      entries: mockLeaderboard.slice(0, limit),
    };
  }
}

export async function getDashboardSnapshotForUser(
  userId?: string | null,
): Promise<DashboardSnapshot> {
  const client = createServiceRoleSupabaseClient();

  if (!userId || !client) {
    return {
      ...mockDashboard,
      isPreview: true,
      signedIn: false,
    };
  }

  try {
    const [
      { data: profile },
      { data: stats },
      { data: results },
      { data: progressRows },
    ] = await Promise.all([
      client
        .from("profiles")
        .select("username, display_name")
        .eq("id", userId)
        .maybeSingle(),
      client
        .from("user_stats")
        .select(
          "total_score, total_xp, level, quizzes_completed, accuracy, streak",
        )
        .eq("user_id", userId)
        .maybeSingle(),
      client
        .from("quiz_results")
        .select(
          "category, score, xp_earned, correct_answers, total_questions, played_at",
        )
        .eq("user_id", userId)
        .order("played_at", { ascending: false })
        .limit(10),
      client
        .from("user_battle_pass_progress")
        .select(
          `
            current_xp,
            current_tier,
            seasons (
              name,
              ends_at
            )
          `,
        )
        .eq("user_id", userId)
        .limit(1),
    ]);

    const totalXp = asNumber(stats?.total_xp, mockDashboard.totalXp);
    const level = asNumber(stats?.level) || getLevelFromXp(totalXp);
    const currentLevelFloor = getXpForLevel(level);
    const nextLevelTarget = getXpForNextLevel(level);
    const progress = progressRows?.[0];
    const seasonRecord = Array.isArray(progress?.seasons)
      ? progress.seasons[0]
      : progress?.seasons;

    return {
      isPreview: false,
      signedIn: true,
      playerName:
        profile?.display_name ||
        profile?.username ||
        mockDashboard.playerName,
      level,
      totalXp,
      xpToNextLevel: Math.max(nextLevelTarget - totalXp, 0),
      currentLevelFloor,
      nextLevelTarget,
      totalScore: asNumber(stats?.total_score, mockDashboard.totalScore),
      quizzesCompleted: asNumber(
        stats?.quizzes_completed,
        mockDashboard.quizzesCompleted,
      ),
      accuracy: asNumber(stats?.accuracy, mockDashboard.accuracy),
      streak: asNumber(stats?.streak, mockDashboard.streak),
      season: {
        name: seasonRecord?.name ?? mockDashboard.season.name,
        daysLeft: getDaysLeft(seasonRecord?.ends_at, mockDashboard.season.daysLeft),
        currentTier: asNumber(
          progress?.current_tier,
          mockDashboard.season.currentTier,
        ),
        currentXp: asNumber(progress?.current_xp, totalXp),
        nextTierXp:
          (asNumber(progress?.current_tier, mockDashboard.season.currentTier) + 1) *
          200,
      },
      recentResults:
        results?.map((result) => ({
          category: result.category ?? "General",
          score: asNumber(result.score),
          xpEarned: asNumber(result.xp_earned),
          accuracy:
            asNumber(result.total_questions) > 0
              ? Math.round(
                  (asNumber(result.correct_answers) /
                    asNumber(result.total_questions, 1)) *
                    100,
                )
              : 0,
          playedAt: result.played_at ?? new Date().toISOString(),
        })) ?? mockDashboard.recentResults,
      topCategories:
        results?.length ? getTopCategories(results) : mockDashboard.topCategories,
    };
  } catch {
    return {
      ...mockDashboard,
      isPreview: true,
      signedIn: false,
    };
  }
}

export async function getDashboardSnapshot() {
  const user = await getWebsiteUser();
  return getDashboardSnapshotForUser(user?.id);
}

export async function getBattlePassOverviewForUser(
  userId?: string | null,
): Promise<BattlePassOverview> {
  const client = createServiceRoleSupabaseClient();

  if (!userId || !client) {
    return {
      ...mockBattlePass,
      isPreview: true,
    };
  }

  try {
    const { data: seasonRows } = await client
      .from("seasons")
      .select("id, name, ends_at")
      .eq("is_active", true)
      .limit(1);

    const activeSeason = seasonRows?.[0];

    if (!activeSeason) {
      return {
        ...mockBattlePass,
        isPreview: true,
      };
    }

    const [{ data: progress }, { data: tiers }] = await Promise.all([
      client
        .from("user_battle_pass_progress")
        .select("current_xp, current_tier")
        .eq("season_id", activeSeason.id)
        .eq("user_id", userId)
        .maybeSingle(),
      client
        .from("battle_pass_tiers")
        .select("tier_number, xp_required, reward_name, reward_type")
        .eq("season_id", activeSeason.id)
        .order("tier_number", { ascending: true }),
    ]);

    const currentXp = asNumber(progress?.current_xp, mockBattlePass.currentXp);
    const currentTier = asNumber(
      progress?.current_tier,
      mockBattlePass.currentTier,
    );

    return {
      isPreview: false,
      seasonName: activeSeason.name ?? mockBattlePass.seasonName,
      daysLeft: getDaysLeft(activeSeason.ends_at, mockBattlePass.daysLeft),
      currentXp,
      currentTier,
      nextTierXp: (currentTier + 1) * 200,
      tiers: mapBattlePassTiers(tiers, currentXp),
    };
  } catch {
    return {
      ...mockBattlePass,
      isPreview: true,
    };
  }
}

export async function getBattlePassOverview() {
  const user = await getWebsiteUser();
  return getBattlePassOverviewForUser(user?.id);
}
