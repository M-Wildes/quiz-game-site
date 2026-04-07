import { SectionHeading } from "@/components/section-heading";
import { hasGitHubReleaseEnv } from "@/lib/env";
import { getLatestRelease } from "@/lib/downloads";
import { formatDate } from "@/lib/utils";

const requirements = [
  { label: "OS", value: "Windows 10+, macOS 13+, Ubuntu 22.04+" },
  { label: "Memory", value: "4 GB RAM minimum" },
  { label: "Storage", value: "300 MB free space" },
  { label: "Connection", value: "Internet required for sync and leaderboards" },
];

export default async function DownloadPage() {
  const release = await getLatestRelease();

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            description="Use this page as the public home for the latest build, patch notes, platform choices, and rollout status."
            eyebrow="Release hub"
            title={`Download the latest build, now serving v${release.version}.`}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="panel-strong rounded-[28px] p-6">
              <p className="tiny-label">Current release</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
                v{release.version}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Published {formatDate(release.publishedAt)} · {release.fileSize}
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {release.isPreview || !hasGitHubReleaseEnv()
                  ? "The page is currently showing fallback release data until you wire in the GitHub repo details."
                  : "This page is reading live GitHub release metadata and can be linked directly from your game launcher or installer prompts."}
              </p>
              <a
                className="button-primary mt-6"
                href={release.downloadUrl}
                rel="noreferrer"
                target="_blank"
              >
                Download latest build
              </a>
            </div>

            <div className="grid gap-4">
              {release.platforms.map((platform) => (
                <a
                  className="panel flex items-center justify-between rounded-[26px] p-5 transition-transform hover:-translate-y-0.5"
                  href={platform.href}
                  key={`${platform.label}-${platform.architecture}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div>
                    <p className="text-xl font-semibold tracking-[-0.04em]">
                      {platform.label}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {platform.architecture} · {platform.size}
                    </p>
                  </div>
                  <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                    {platform.status}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[28px] p-7">
          <SectionHeading
            description="Release notes should be short, scannable, and tied to the latest version. Keep the top line player-facing."
            eyebrow="Patch notes"
            title="What changed in this build"
          />
          <div className="mt-8 space-y-3">
            {release.notes.map((note) => (
              <div
                className="rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/76 px-4 py-4"
                key={note}
              >
                <p className="leading-7">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="Keep these visible so support questions and compatibility confusion stay low."
              eyebrow="Requirements"
              title="System requirements"
            />
            <div className="mt-8 grid gap-3">
              {requirements.map((item) => (
                <div
                  className="flex items-center justify-between rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-3"
                  key={item.label}
                >
                  <span className="tiny-label">{item.label}</span>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[28px] p-7">
            <SectionHeading
              description="This starter already includes the endpoint scaffold for serving the latest release metadata."
              eyebrow="API ready"
              title="Hook the frontend to your real release pipeline"
            />
            <div className="mt-8 rounded-[22px] bg-[rgba(29,23,21,0.92)] p-5 font-mono text-sm text-[#f7f2eb]">
              <p>GET /api/download/latest</p>
              <p className="mt-2 text-[#c8bbab]">
                Fetches the latest GitHub release and falls back gracefully when
                env vars are missing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
