import type {
  BattlePassOverview,
  DashboardSnapshot,
  DownloadRelease,
  LeaderboardEntry,
} from "@/lib/types";

export const mockRelease: DownloadRelease = {
  isPreview: true,
  version: "0.9.4",
  channel: "Founder's build",
  publishedAt: "2026-04-05T09:00:00.000Z",
  fileName: "quizforge-setup.exe",
  fileSize: "126 MB",
  downloadUrl: "#",
  notes: [
    "Fresh home, dashboard, and progression pages for the public website.",
    "Shared account flow prepared for both the desktop app and the web dashboard.",
    "Leaderboard snapshots now surface current-season momentum and top categories.",
    "Battle pass rewards, notes, and release info are organized into one cleaner hub.",
  ],
  platforms: [
    {
      label: "Windows",
      architecture: "x64",
      size: "126 MB",
      href: "#",
      status: "Ready first",
    },
    {
      label: "macOS",
      architecture: "ARM64",
      size: "131 MB",
      href: "#",
      status: "Coming next",
    },
    {
      label: "Linux",
      architecture: "x64",
      size: "129 MB",
      href: "#",
      status: "Planned",
    },
  ],
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "NovaCircuit",
    score: 19840,
    xp: 1220,
    streak: 8,
    category: "Science",
    trend: "up",
  },
  {
    rank: 2,
    username: "AtlasByte",
    score: 19420,
    xp: 1180,
    streak: 7,
    category: "History",
    trend: "up",
  },
  {
    rank: 3,
    username: "EchoQuill",
    score: 18810,
    xp: 1115,
    streak: 6,
    category: "Movies",
    trend: "new",
  },
  {
    rank: 4,
    username: "PixelScholar",
    score: 18295,
    xp: 1090,
    streak: 5,
    category: "Geography",
    trend: "steady",
  },
  {
    rank: 5,
    username: "CrimsonCue",
    score: 17610,
    xp: 1035,
    streak: 4,
    category: "General",
    trend: "steady",
  },
  {
    rank: 6,
    username: "MossSignal",
    score: 17280,
    xp: 980,
    streak: 3,
    category: "Music",
    trend: "steady",
  },
];

export const mockDashboard: DashboardSnapshot = {
  isPreview: true,
  signedIn: false,
  playerName: "Guest Challenger",
  level: 12,
  totalXp: 2460,
  xpToNextLevel: 240,
  currentLevelFloor: 2420,
  nextLevelTarget: 2700,
  totalScore: 64320,
  quizzesCompleted: 84,
  accuracy: 86,
  streak: 6,
  season: {
    name: "Season 01: Opening Bell",
    daysLeft: 19,
    currentTier: 7,
    currentXp: 1380,
    nextTierXp: 1600,
  },
  recentResults: [
    {
      category: "Science",
      score: 1880,
      xpEarned: 120,
      accuracy: 92,
      playedAt: "2026-04-06T19:45:00.000Z",
    },
    {
      category: "History",
      score: 1760,
      xpEarned: 105,
      accuracy: 84,
      playedAt: "2026-04-06T18:10:00.000Z",
    },
    {
      category: "Movies",
      score: 1640,
      xpEarned: 98,
      accuracy: 80,
      playedAt: "2026-04-05T20:25:00.000Z",
    },
  ],
  topCategories: [
    { category: "Science", averageScore: 1860, mastery: 91 },
    { category: "History", averageScore: 1715, mastery: 86 },
    { category: "Movies", averageScore: 1605, mastery: 81 },
    { category: "Music", averageScore: 1490, mastery: 78 },
  ],
};

export const mockBattlePass: BattlePassOverview = {
  isPreview: true,
  seasonName: "Season 01: Opening Bell",
  daysLeft: 19,
  currentXp: 1380,
  currentTier: 7,
  nextTierXp: 1600,
  tiers: Array.from({ length: 8 }, (_, index) => {
    const tier = index + 1;
    const rarity =
      tier % 5 === 0 ? "legendary" : tier % 2 === 0 ? "premium" : "free";

    return {
      tier,
      xpRequired: tier * 200,
      reward:
        tier === 1
          ? "Starter profile badge"
          : tier === 2
            ? "Retro avatar frame"
            : tier === 3
              ? "Quiz title unlock"
          : tier === 4
            ? "Arcade neon avatar frame"
            : tier === 5
              ? "Season winner banner"
              : tier === 6
                ? "Bonus question pack"
                : tier === 7
                  ? "Profile flair set"
            : tier === 8
              ? "Night shift theme pack"
              : "Season reward",
      rarity,
      unlocked: tier <= 7,
      claimed: tier <= 6,
    };
  }),
};
