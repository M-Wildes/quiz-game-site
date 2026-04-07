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
  const hasLiveDownload = !release.isPreview && release.downloadUrl !== "#";

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            description="This is the public release hub for the quiz app: the newest installer, supported platforms, and the notes players should read before updating."
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
                Published {formatDate(release.publishedAt)} | {release.fileSize}
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {release.isPreview || !hasGitHubReleaseEnv()
                  ? "The release feed is still being prepared. The page layout is live now, and the latest installer will appear here as soon as a GitHub release is published."
                  : "This page is reading the live release feed, so players can grab the newest installer and patch notes from one reliable link."}
              </p>
              {hasLiveDownload ? (
                <a
                  className="button-primary mt-6"
                  href={release.downloadUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Download latest build
                </a>
              ) : (
                <span className="button-secondary mt-6">
                  Release publishing soon
                </span>
              )}
            </div>

            <div className="grid gap-4">
              {release.platforms.map((platform) => {
                const content = (
                  <>
                    <div>
                      <p className="text-xl font-semibold tracking-[-0.04em]">
                        {platform.label}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {platform.architecture} | {platform.size}
                      </p>
                    </div>
                    <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                      {platform.status}
                    </div>
                  </>
                );

                return platform.href !== "#" ? (
                  <a
                    className="panel flex items-center justify-between rounded-[26px] p-5 transition-transform hover:-translate-y-0.5"
                    href={platform.href}
                    key={`${platform.label}-${platform.architecture}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    className="panel flex items-center justify-between rounded-[26px] p-5"
                    key={`${platform.label}-${platform.architecture}`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[28px] p-7">
          <SectionHeading
            description="Keep every release easy to scan. Players should immediately understand what feels better, what was fixed, and what is worth trying next."
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
              description="The website already exposes a release endpoint, so the desktop app, launcher, or patch prompt can all read the same source of truth."
              eyebrow="Release endpoint"
              title="One feed for the website and launcher"
            />
            <div className="mt-8 rounded-[22px] bg-[rgba(29,23,21,0.92)] p-5 font-mono text-sm text-[#f7f2eb]">
              <p>GET /api/download/latest</p>
              <p className="mt-2 text-[#c8bbab]">
                Serves the newest release metadata and keeps the download page
                aligned with the launcher experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

