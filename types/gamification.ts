export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'milestone' | 'behavior' | 'time' | 'savings';
  iconName: string;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  criteria: {
    type: string;
    target: number;
    current: number;
  };
  xpReward: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: string;
  iconName: string;
  color: string;
  isEarned: boolean;
  earnedAt?: Date;
  requirements: string;
}

export interface Streak {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  lastActionDate?: Date;
  isActive: boolean;
  iconName: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'usage' | 'cost' | 'efficiency' | 'custom';
  target: number;
  current: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  iconName: string;
  color: string;
  xpReward: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  rank: string;
  joinDate: Date;
}

export interface GamificationStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalBadges: number;
  earnedBadges: number;
  activeStreaks: number;
  completedGoals: number;
  totalXp: number;
  currentLevel: number;
}