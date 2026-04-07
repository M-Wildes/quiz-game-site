import type {
  BattlePassOverview,
  CommunityQuizDetail,
  CommunityQuizDirectory,
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

export const mockCommunityQuizDirectory: CommunityQuizDirectory = {
  isPreview: true,
  updatedAt: "2026-04-06T20:30:00.000Z",
  quizzes: [
    {
      slug: "science-night-shift",
      title: "Science Night Shift",
      description:
        "A fast-moving late-night science set with space, biology, and weird lab trivia mixed together.",
      category: "Science",
      difficulty: "medium",
      questionCount: 5,
      playCount: 38,
      authorName: "NovaCircuit",
      createdAt: "2026-04-06T19:15:00.000Z",
      sharePath: "/community-quizzes/science-night-shift",
    },
    {
      slug: "retro-arcade-mix",
      title: "Retro Arcade Mix",
      description:
        "Old-school gaming questions built for players who grew up in arcades or wish they had.",
      category: "Gaming",
      difficulty: "easy",
      questionCount: 5,
      playCount: 24,
      authorName: "PixelScholar",
      createdAt: "2026-04-05T18:00:00.000Z",
      sharePath: "/community-quizzes/retro-arcade-mix",
    },
    {
      slug: "midnight-movie-marathon",
      title: "Midnight Movie Marathon",
      description:
        "A shared movie set built around cult classics, modern blockbusters, and soundtrack moments.",
      category: "Movies",
      difficulty: "hard",
      questionCount: 5,
      playCount: 17,
      authorName: "EchoQuill",
      createdAt: "2026-04-04T21:40:00.000Z",
      sharePath: "/community-quizzes/midnight-movie-marathon",
    },
  ],
};

export const mockCommunityQuizDetails: Record<string, CommunityQuizDetail> = {
  "science-night-shift": {
    ...mockCommunityQuizDirectory.quizzes[0],
    questions: [
      {
        id: "science-night-shift-1",
        order: 1,
        prompt: "What is the hottest planet in our solar system?",
        answers: ["Mars", "Venus", "Mercury", "Jupiter"],
        correctIndex: 1,
        explanation:
          "Venus traps heat with a dense carbon-dioxide atmosphere, making it hotter than Mercury.",
      },
      {
        id: "science-night-shift-2",
        order: 2,
        prompt: "Which blood cells are primarily responsible for carrying oxygen?",
        answers: ["Platelets", "White blood cells", "Red blood cells", "Plasma cells"],
        correctIndex: 2,
        explanation:
          "Red blood cells carry oxygen through the body using hemoglobin.",
      },
      {
        id: "science-night-shift-3",
        order: 3,
        prompt: "What part of the cell contains the genetic material in most organisms?",
        answers: ["Nucleus", "Ribosome", "Golgi apparatus", "Cell membrane"],
        correctIndex: 0,
        explanation:
          "The nucleus stores DNA in most plant and animal cells.",
      },
      {
        id: "science-night-shift-4",
        order: 4,
        prompt: "What is the chemical symbol for sodium?",
        answers: ["S", "So", "Na", "Sd"],
        correctIndex: 2,
        explanation:
          "Sodium uses the symbol Na, derived from the Latin word natrium.",
      },
      {
        id: "science-night-shift-5",
        order: 5,
        prompt: "How many bones are in the adult human body?",
        answers: ["198", "206", "214", "222"],
        correctIndex: 1,
        explanation:
          "The typical adult human skeleton has 206 bones.",
      },
    ],
  },
  "retro-arcade-mix": {
    ...mockCommunityQuizDirectory.quizzes[1],
    questions: [
      {
        id: "retro-arcade-mix-1",
        order: 1,
        prompt: "Which company created the original Pac-Man?",
        answers: ["Sega", "Nintendo", "Namco", "Capcom"],
        correctIndex: 2,
        explanation: "Pac-Man was created by Namco and released in 1980.",
      },
      {
        id: "retro-arcade-mix-2",
        order: 2,
        prompt: "What color is the main character in Q*bert?",
        answers: ["Purple", "Orange", "Blue", "Green"],
        correctIndex: 1,
        explanation: "Q*bert is the orange character hopping across the pyramid.",
      },
      {
        id: "retro-arcade-mix-3",
        order: 3,
        prompt: "Which classic arcade game features a giant ape named Donkey Kong?",
        answers: ["Dig Dug", "Galaga", "Donkey Kong", "Defender"],
        correctIndex: 2,
        explanation: "Donkey Kong introduced Mario in the early arcade era.",
      },
      {
        id: "retro-arcade-mix-4",
        order: 4,
        prompt: "In Space Invaders, what are you defending at the bottom of the screen?",
        answers: ["A city", "A base", "A starship dock", "A laboratory"],
        correctIndex: 1,
        explanation: "The player controls a laser base at the bottom of the screen.",
      },
      {
        id: "retro-arcade-mix-5",
        order: 5,
        prompt: "Which yellow arcade character spends the game eating pellets?",
        answers: ["Frogger", "Pac-Man", "Q*bert", "Bub"],
        correctIndex: 1,
        explanation: "Pac-Man clears mazes by eating pellets and avoiding ghosts.",
      },
    ],
  },
  "midnight-movie-marathon": {
    ...mockCommunityQuizDirectory.quizzes[2],
    questions: [
      {
        id: "midnight-movie-marathon-1",
        order: 1,
        prompt: "Which film won Best Picture at the Oscars for 1998 releases?",
        answers: ["Saving Private Ryan", "Shakespeare in Love", "The Truman Show", "Elizabeth"],
        correctIndex: 1,
        explanation: "Shakespeare in Love won Best Picture over Saving Private Ryan.",
      },
      {
        id: "midnight-movie-marathon-2",
        order: 2,
        prompt: "Who directed Inception?",
        answers: ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "Ridley Scott"],
        correctIndex: 1,
        explanation: "Christopher Nolan wrote and directed Inception.",
      },
      {
        id: "midnight-movie-marathon-3",
        order: 3,
        prompt: "In The Matrix, what color pill does Neo take?",
        answers: ["Blue", "Red", "Green", "White"],
        correctIndex: 1,
        explanation: "Neo takes the red pill to learn the truth.",
      },
      {
        id: "midnight-movie-marathon-4",
        order: 4,
        prompt: "Which movie features the line about needing a bigger boat?",
        answers: ["Jaws", "Alien", "Titanic", "The Abyss"],
        correctIndex: 0,
        explanation: "The famous line comes from Jaws.",
      },
      {
        id: "midnight-movie-marathon-5",
        order: 5,
        prompt: "Which actor played Maximus in Gladiator?",
        answers: ["Russell Crowe", "Joaquin Phoenix", "Gerard Butler", "Colin Farrell"],
        correctIndex: 0,
        explanation: "Russell Crowe played Maximus Decimus Meridius.",
      },
    ],
  },
};
