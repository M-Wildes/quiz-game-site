import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { ProgressBar } from "@/components/progress-bar";
import { SectionHeading } from "@/components/section-heading";
import { getBattlePassOverview, getLeaderboardSnapshot } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";
import { getLatestRelease } from "@/lib/downloads";
import { formatDate, formatNumber } from "@/lib/utils";

const launchLoop = [
  "Install the current build from the download hub.",
  "Create one account that works in both the site and the game.",
  "Sync every quiz result into your cloud profile and leaderboard history.",
  "Feed that data into seasonal XP and battle pass progression.",
];

const productPillars = [
  {
    eyebrow: "Latest build delivery",
    title: "A proper launcher page instead of a random file link.",
    description:
      "Pull release metadata from GitHub, surface patch notes, and make the newest installer obvious on every visit.",
  },
  {
    eyebrow: "Account sync",
    title: "One identity across the web dashboard and the desktop game.",
    description:
      "Supabase Auth keeps sign-up, sign-in, and password reset in one place so every score maps back to a real player profile.",
  },
  {
    eyebrow: "Retention loop",
    title: "Leaderboards and XP give players a reason to come back tomorrow.",
    description:
      "A seasonal battle pass turns quiz volume into progression, cosmetics, and visible milestones rather than isolated play sessions.",
  },
];

export default async function Home() {
  const [release, leaderboard, battlePass] = await Promise.all([
    getLatestRelease(),
    getLeaderboardSnapshot(5),
    getBattlePassOverview(),
  ]);

  const progressInTier = Math.max(
    battlePass.currentXp - (battlePass.currentTier - 1) * 200,
    0,
  );
  const progressTarget = Math.max(
    battlePass.nextTierXp - (battlePass.currentTier - 1) * 200,
    1,
  );

  return (
    <div className="space-y-16 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel float-in overflow-hidden rounded-[34px] p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="eyebrow">Seasonal progression</span>
                <span className="eyebrow">Shared web + game accounts</span>
                {(!hasSupabaseEnv() || release.isPreview) && (
                  <span className="eyebrow">Preview mode until env is connected</span>
                )}
              </div>

              <div className="space-y-5">
                <h1 className="hero-title max-w-4xl font-semibold">
                  Give the quiz game a live home players keep coming back to.
                </h1>
                <p className="body-copy max-w-2xl text-lg sm:text-xl">
                  QuizForge turns the website into more than a download page:
                  it becomes the place where installs, profiles, synced scores,
                  leaderboards, and battle pass momentum all meet.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link className="button-primary" href="/download">
                  Download v{release.version}
                </Link>
                <Link className="button-secondary" href="/signup">
                  Create account
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  accent="sun"
                  hint={`Published ${formatDate(release.publishedAt)}`}
                  label="Current release"
                  value={`v${release.version}`}
                />
                <MetricCard
                  accent="teal"
                  hint="Starter metric card for your home page"
                  label="Tracked players"
                  value={formatNumber(1842)}
                />
                <MetricCard
                  accent="blue"
                  hint={`${battlePass.daysLeft} days left in ${battlePass.seasonName}`}
                  label="Season progress"
                  value={`Tier ${battlePass.currentTier}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="panel-strong float-card rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="tiny-label">Latest build</p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                      v{release.version}
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
                      {release.platforms[0]?.label ?? "Windows"} download
                      surfaced from your release feed, ready to swap from mock
                      data to live assets.
                    </p>
                  </div>
                  <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                    {release.channel}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {release.platforms.slice(0, 3).map((platform) => (
                    <div
                      className="flex items-center justify-between rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/75 px-4 py-3"
                      key={platform.label}
                    >
                      <div>
                        <p className="font-medium">{platform.label}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {platform.architecture}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{platform.size}</p>
                        <p className="tiny-label">{platform.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {launchLoop.map((step, index) => (
                  <div className="panel rounded-[24px] p-5" key={step}>
                    <p className="tiny-label">Step {index + 1}</p>
                    <p className="mt-3 text-base leading-7">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell space-y-7">
        <SectionHeading
          description="The structure below keeps acquisition, identity, progression, and competition in one coherent flow."
          eyebrow="Product loop"
          title="Everything your quiz game needs to feel alive between launches."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {productPillars.map((pillar) => (
            <article className="panel rounded-[28px] p-6" key={pillar.title}>
              <p className="tiny-label">{pillar.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                {pillar.title}
              </h2>
              <p className="body-copy mt-4 text-base">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="panel rounded-[30px] p-7">
            <SectionHeading
              description="XP gained from quizzes flows into a seasonal reward track. Start with badges, profile frames, and question pack unlocks, then expand later."
              eyebrow="Battle pass preview"
              title={`${battlePass.seasonName} keeps players chasing the next unlock.`}
            />
            <div className="mt-8 space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="tiny-label">Current progress</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                    Tier {battlePass.currentTier}
                  </p>
                </div>
                <p className="text-right text-sm text-[var(--muted)]">
                  {battlePass.currentXp} XP banked
                  <br />
                  Next unlock at {battlePass.nextTierXp} XP
                </p>
              </div>
              <ProgressBar
                label={`${progressInTier} / ${progressTarget} XP in current tier`}
                max={progressTarget}
                value={progressInTier}
              />
              <div className="grid gap-3">
                {battlePass.tiers.slice(0, 4).map((tier) => (
                  <div
                    className="flex items-center justify-between rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-3"
                    key={tier.tier}
                  >
                    <div>
                      <p className="font-medium">Tier {tier.tier}</p>
                      <p className="text-sm text-[var(--muted)]">
                        {tier.reward}
                      </p>
                    </div>
                    <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
                      {tier.claimed
                        ? "Claimed"
                        : tier.unlocked
                          ? "Unlocked"
                          : `${tier.xpRequired} XP`}
                    </div>
                  </div>
                ))}
              </div>
              <Link className="button-secondary" href="/battle-pass">
                Open full reward track
              </Link>
            </div>
          </div>

          <div className="panel rounded-[30px] p-7">
            <SectionHeading
              description="Your site becomes the social surface for score chasing, streak bragging, and category mastery."
              eyebrow="Live competition"
              title="Leaderboards only matter when players can see the climb."
            />
            <div className="mt-8 overflow-hidden rounded-[24px] border border-[rgba(62,43,22,0.08)] bg-white/72">
              <div className="grid grid-cols-[0.7fr_2fr_1.2fr_1fr] gap-3 border-b border-[rgba(62,43,22,0.08)] px-4 py-3 text-sm font-semibold text-[var(--muted)]">
                <span>Rank</span>
                <span>Player</span>
                <span>Category</span>
                <span className="text-right">Score</span>
              </div>
              {leaderboard.entries.map((entry) => (
                <div
                  className="grid grid-cols-[0.7fr_2fr_1.2fr_1fr] gap-3 px-4 py-4 text-sm even:bg-[rgba(255,255,255,0.66)]"
                  key={`${entry.username}-${entry.rank}`}
                >
                  <span className="font-semibold text-[var(--accent-strong)]">
                    #{entry.rank}
                  </span>
                  <div>
                    <p className="font-medium">{entry.username}</p>
                    <p className="tiny-label">{entry.trend}</p>
                  </div>
                  <span className="text-[var(--muted)]">{entry.category}</span>
                  <span className="text-right font-semibold">
                    {formatNumber(entry.score)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link className="button-secondary" href="/leaderboards">
                Open leaderboard hub
              </Link>
              <Link className="button-ghost" href="/dashboard">
                View player dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
