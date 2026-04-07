import { ProgressBar } from "@/components/progress-bar";
import { SectionHeading } from "@/components/section-heading";
import { getBattlePassOverview } from "@/lib/data";

const xpRules = [
  "Complete a quiz: +50 XP",
  "Score above 80 percent: +10 XP",
  "Score above 90 percent: +20 XP",
  "Hard difficulty bonus: +45 XP",
  "Fast clear bonus: +15 XP",
];

export default async function BattlePassPage() {
  const battlePass = await getBattlePassOverview();
  const progressInTier = Math.max(
    battlePass.currentXp - (battlePass.currentTier - 1) * 200,
    0,
  );
  const progressTarget = Math.max(
    battlePass.nextTierXp - (battlePass.currentTier - 1) * 200,
    1,
  );

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            description="Season progress should reward consistency. Every finished quiz pushes the player a little closer to the next reward."
            eyebrow="Season progression"
            title={`${battlePass.seasonName} rewards consistency, not just one lucky run.`}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="panel-strong rounded-[28px] p-7">
              <p className="tiny-label">Current tier</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
                {battlePass.currentTier}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {battlePass.currentXp} XP earned | {battlePass.daysLeft} days left
              </p>
              <div className="mt-6">
                <ProgressBar
                  label={`${progressInTier} / ${progressTarget} XP in this tier`}
                  max={progressTarget}
                  value={progressInTier}
                />
              </div>
            </div>

            <div className="panel rounded-[28px] p-7">
              <SectionHeading
                description="Start with a reward track that feels satisfying without locking core gameplay behind the pass."
                eyebrow="XP economy"
                title="How players move through the season"
              />
              <div className="mt-8 space-y-3">
                {xpRules.map((rule) => (
                  <div
                    className="rounded-[20px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-3 text-sm"
                    key={rule}
                  >
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {battlePass.tiers.map((tier) => (
            <div className="panel rounded-[26px] p-6" key={tier.tier}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="tiny-label">Tier {tier.tier}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                    {tier.reward}
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--blue-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--blue)]">
                  {tier.rarity}
                </span>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Unlocks at {tier.xpRequired} XP
              </p>
              <div className="mt-6 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-center text-sm font-semibold text-[var(--accent-strong)]">
                {tier.claimed
                  ? "Claimed"
                  : tier.unlocked
                    ? "Unlocked"
                    : "Locked"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

