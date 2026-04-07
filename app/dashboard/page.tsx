import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { SectionHeading } from "@/components/section-heading";
import { getDashboardSnapshot } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const levelSpan = Math.max(
    snapshot.nextLevelTarget - snapshot.currentLevelFloor,
    1,
  );
  const levelProgress = Math.max(snapshot.totalXp - snapshot.currentLevelFloor, 0);

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            description="This page is the player command center: identity, progress, recent runs, category strengths, and next unlocks."
            eyebrow="Player dashboard"
            title={`Welcome back, ${snapshot.playerName}.`}
          />

          {snapshot.isPreview ? (
            <div className="mt-8 rounded-[24px] border border-[rgba(255,138,0,0.18)] bg-[rgba(255,245,232,0.9)] px-5 py-4 text-sm text-[var(--accent-strong)]">
              Preview data is showing because no authenticated Supabase session
              is available yet. Once you add env vars and sign in, this page
              will reflect the real player record.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="panel-strong rounded-[26px] p-6">
              <p className="tiny-label">Level</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
                {snapshot.level}
              </p>
              <div className="mt-5">
                <ProgressBar
                  label={`${levelProgress} / ${levelSpan} XP this level`}
                  max={levelSpan}
                  value={levelProgress}
                />
              </div>
            </div>
            <div className="panel rounded-[26px] p-6">
              <p className="tiny-label">Total XP</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {formatNumber(snapshot.totalXp)}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {formatNumber(snapshot.xpToNextLevel)} XP until level{" "}
                {snapshot.level + 1}
              </p>
            </div>
            <div className="panel rounded-[26px] p-6">
              <p className="tiny-label">Lifetime score</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {formatNumber(snapshot.totalScore)}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {snapshot.quizzesCompleted} quizzes completed
              </p>
            </div>
            <div className="panel rounded-[26px] p-6">
              <p className="tiny-label">Accuracy / streak</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {snapshot.accuracy}%
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {snapshot.streak} run streak active
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="panel rounded-[30px] p-7">
          <SectionHeading
            description="This should become the habit-forming area: recent performance, category preference, and how close the player is to their next target."
            eyebrow="Recent performance"
            title="Latest quiz runs"
          />
          <div className="mt-8 space-y-3">
            {snapshot.recentResults.map((result) => (
              <div
                className="flex items-center justify-between rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-4"
                key={`${result.category}-${result.playedAt}`}
              >
                <div>
                  <p className="font-medium">{result.category}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {formatDate(result.playedAt)} · {result.accuracy}% accuracy
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatNumber(result.score)}</p>
                  <p className="tiny-label">+{result.xpEarned} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="Tie your dashboard back into the reward loop so progress never feels hidden."
              eyebrow="Season snapshot"
              title={snapshot.season.name}
            />
            <div className="mt-8 space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="tiny-label">Current tier</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                    {snapshot.season.currentTier}
                  </p>
                </div>
                <p className="text-right text-sm text-[var(--muted)]">
                  {snapshot.season.daysLeft} days left
                </p>
              </div>
              <ProgressBar
                label={`${snapshot.season.currentXp} / ${snapshot.season.nextTierXp} season XP`}
                max={snapshot.season.nextTierXp}
                value={snapshot.season.currentXp}
              />
              <Link className="button-secondary" href="/battle-pass">
                View battle pass
              </Link>
            </div>
          </div>

          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="Pull top categories from quiz history to give players a visible identity and reason to branch out."
              eyebrow="Category mastery"
              title="Strongest lanes"
            />
            <div className="mt-8 space-y-3">
              {snapshot.topCategories.map((category) => (
                <div
                  className="flex items-center justify-between rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-3"
                  key={category.category}
                >
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-[var(--muted)]">
                      Mastery {category.mastery}%
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatNumber(category.averageScore)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
