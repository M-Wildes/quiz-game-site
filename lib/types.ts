export type Difficulty = "easy" | "medium" | "hard";

export type DownloadPlatform = {
  label: string;
  architecture: string;
  size: string;
  href: string;
  status: string;
};

export type DownloadRelease = {
  isPreview: boolean;
  version: string;
  channel: string;
  publishedAt: string;
  fileName: string;
  fileSize: string;
  downloadUrl: string;
  notes: string[];
  platforms: DownloadPlatform[];
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  xp: number;
  streak: number;
  category: string;
  trend: "up" | "steady" | "new";
};

export type LeaderboardSnapshot = {
  isPreview: boolean;
  updatedAt: string;
  entries: LeaderboardEntry[];
};

export type RecentQuizResult = {
  category: string;
  score: number;
  xpEarned: number;
  accuracy: number;
  playedAt: string;
};

export type CategoryPerformance = {
  category: string;
  averageScore: number;
  mastery: number;
};

export type DashboardSnapshot = {
  isPreview: boolean;
  signedIn: boolean;
  playerName: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  currentLevelFloor: number;
  nextLevelTarget: number;
  totalScore: number;
  quizzesCompleted: number;
  accuracy: number;
  streak: number;
  season: {
    name: string;
    daysLeft: number;
    currentTier: number;
    currentXp: number;
    nextTierXp: number;
  };
  recentResults: RecentQuizResult[];
  topCategories: CategoryPerformance[];
};

export type BattlePassTier = {
  tier: number;
  xpRequired: number;
  reward: string;
  rarity: "free" | "premium" | "legendary";
  unlocked: boolean;
  claimed: boolean;
};

export type BattlePassOverview = {
  isPreview: boolean;
  seasonName: string;
  daysLeft: number;
  currentXp: number;
  currentTier: number;
  nextTierXp: number;
  tiers: BattlePassTier[];
};

export type QuizUploadPayload = {
  quizType: string;
  category: string;
  difficulty: Difficulty;
  correctAnswers: number;
  totalQuestions: number;
  durationMs: number;
  streakBonus?: boolean;
};

export type CalculatedQuizResult = {
  score: number;
  xpEarned: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
};
