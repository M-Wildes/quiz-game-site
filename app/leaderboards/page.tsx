import { SectionHeading } from "@/components/section-heading";
import { getLeaderboardSnapshot } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default async function LeaderboardsPage() {
  const leaderboard = await getLeaderboardSnapshot(10);
  const podium = leaderboard.entries.slice(0, 3);

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            description="Show global rankings, surface momentum, and make each category feel like a ladder worth climbing."
            eyebrow="Leaderboard command"
            title="Turn every good quiz run into public momentum."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {podium.map((entry) => (
              <div className="panel-strong rounded-[26px] p-6" key={entry.rank}>
                <p className="tiny-label">Rank #{entry.rank}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                  {entry.username}
                </h2>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {entry.category} specialist · {entry.streak} streak
                </p>
                <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                  {formatNumber(entry.score)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden rounded-[30px]">
          <div className="grid grid-cols-[0.7fr_2fr_1.1fr_0.9fr_0.9fr] gap-3 border-b border-[rgba(62,43,22,0.08)] bg-white/60 px-5 py-4 text-sm font-semibold text-[var(--muted)]">
            <span>Rank</span>
            <span>Player</span>
            <span>Category</span>
            <span className="text-right">XP</span>
            <span className="text-right">Score</span>
          </div>
          {leaderboard.entries.map((entry) => (
            <div
              className="grid grid-cols-[0.7fr_2fr_1.1fr_0.9fr_0.9fr] gap-3 px-5 py-4 text-sm even:bg-white/54"
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
              <span className="text-right">{formatNumber(entry.xp)}</span>
              <span className="text-right font-semibold">
                {formatNumber(entry.score)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="Use weekly resets, category tabs, and featured rivals later. The starter focuses on a strong global ladder first."
              eyebrow="Preview state"
              title={
                leaderboard.isPreview
                  ? "Sample leaderboard currently shown"
                  : "Live leaderboard connected"
              }
            />
          </div>

          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="You already have a JSON endpoint ready for the desktop app, overlays, or Discord bots."
              eyebrow="API ready"
              title="Consume rankings anywhere"
            />
            <div className="mt-8 rounded-[22px] bg-[rgba(29,23,21,0.92)] p-5 font-mono text-sm text-[#f7f2eb]">
              <p>GET /api/leaderboard</p>
              <p className="mt-2 text-[#c8bbab]">
                Returns ranked entries and a preview flag when the database is
                not wired in yet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
