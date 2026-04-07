import { githubEnv, hasGitHubReleaseEnv } from "@/lib/env";
import { mockRelease } from "@/lib/mock-data";
import type { DownloadRelease } from "@/lib/types";

type GitHubReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  body: string | null;
  published_at: string | null;
  assets: GitHubReleaseAsset[];
};

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let currentBytes = bytes;
  let unitIndex = 0;

  while (currentBytes >= 1024 && unitIndex < units.length - 1) {
    currentBytes /= 1024;
    unitIndex += 1;
  }

  return `${currentBytes.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function inferLabel(assetName: string) {
  const lower = assetName.toLowerCase();

  if (lower.includes("windows") || lower.endsWith(".exe")) {
    return "Windows";
  }

  if (lower.includes("mac") || lower.includes("darwin") || lower.endsWith(".dmg")) {
    return "macOS";
  }

  if (lower.includes("linux") || lower.endsWith(".appimage")) {
    return "Linux";
  }

  return "Direct download";
}

function inferArchitecture(assetName: string) {
  const lower = assetName.toLowerCase();

  if (lower.includes("arm64") || lower.includes("aarch64")) {
    return "ARM64";
  }

  return "x64";
}

export async function getLatestRelease(): Promise<DownloadRelease> {
  if (!hasGitHubReleaseEnv()) {
    return mockRelease;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${githubEnv.owner}/${githubEnv.repo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(githubEnv.token
            ? { Authorization: `Bearer ${githubEnv.token}` }
            : {}),
        },
        next: {
          revalidate: 900,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Unable to fetch latest GitHub release.");
    }

    const release = (await response.json()) as GitHubRelease;
    const leadAsset = release.assets[0];

    return {
      isPreview: false,
      version: release.tag_name.replace(/^v/i, ""),
      channel: "Live release",
      publishedAt: release.published_at ?? new Date().toISOString(),
      fileName: leadAsset?.name ?? "latest-build",
      fileSize: leadAsset ? formatBytes(leadAsset.size) : mockRelease.fileSize,
      downloadUrl: leadAsset?.browser_download_url ?? release.html_url,
      notes:
        release.body
          ?.split("\n")
          .map((line) => line.replace(/^[-*#\s]+/, "").trim())
          .filter(Boolean)
          .slice(0, 6) ?? mockRelease.notes,
      platforms:
        release.assets.length > 0
          ? release.assets.map((asset) => ({
              label: inferLabel(asset.name),
              architecture: inferArchitecture(asset.name),
              size: formatBytes(asset.size),
              href: asset.browser_download_url,
              status: asset.name === leadAsset?.name ? "Latest" : "Alternate",
            }))
          : mockRelease.platforms,
    };
  } catch {
    return mockRelease;
  }
}
