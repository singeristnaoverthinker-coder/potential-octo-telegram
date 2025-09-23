import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Achievement, Badge, Streak, Goal, UserProgress, GamificationStats } from '@/types/gamification';

interface GamificationContextType {
  achievements: Achievement[];
  badges: Badge[];
  streaks: Streak[];
  goals: Goal[];
  userProgress: UserProgress;
  stats: GamificationStats;
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'isCompleted' | 'completedAt'>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  completeGoal: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  updateStreak: (streakId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  earnBadge: (badgeId: string) => void;
  addXp: (amount: number) => void;
  checkAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: 'first_calculation',
    title: 'First Steps',
    description: 'Complete your first appliance calculation',
    category: 'milestone',
    iconName: 'zap',
    color: '#10B981',
    isUnlocked: false,
    criteria: { type: 'calculations', target: 1, current: 0 },
    xpReward: 50,
  },
  {
    id: 'welcome',
    title: 'Welcome!',
    description: 'Open the app for the first time',
    category: 'milestone',
    iconName: 'star',
    color: '#2563EB',
    isUnlocked: false,
    criteria: { type: 'app_opens', target: 1, current: 0 },
    xpReward: 25,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Open the app before 9 AM',
    category: 'behavior',
    iconName: 'sun',
    color: '#F59E0B',
    isUnlocked: false,
    criteria: { type: 'early_opens', target: 1, current: 0 },
    xpReward: 30,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Select your first appliance',
    category: 'milestone',
    iconName: 'zap',
    color: '#8B5CF6',
    isUnlocked: false,
    criteria: { type: 'appliances_selected', target: 1, current: 0 },
    xpReward: 40,
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Reduce monthly costs by ₱200',
    category: 'savings',
    iconName: 'leaf',
    color: '#059669',
    isUnlocked: false,
    criteria: { type: 'savings', target: 200, current: 0 },
    xpReward: 120,
  },
  {
    id: 'week_warrior',
    title: 'Consistent',
    description: 'Use the app for 3 consecutive days',
    category: 'time',
    iconName: 'calendar',
    color: '#8B5CF6',
    isUnlocked: false,
    criteria: { type: 'streak_days', target: 3, current: 0 },
    xpReward: 75,
  },
  {
    id: 'appliance_master',
    title: 'Appliance Master',
    description: 'Track 5 different appliances',
    category: 'behavior',
    iconName: 'settings',
    color: '#F59E0B',
    isUnlocked: false,
    criteria: { type: 'appliances_tracked', target: 5, current: 0 },
    xpReward: 150,
  },
  {
    id: 'goal_achiever',
    title: 'Goal Achiever',
    description: 'Complete 3 goals',
    category: 'milestone',
    iconName: 'target',
    color: '#EF4444',
    isUnlocked: false,
    criteria: { type: 'goals_completed', target: 3, current: 0 },
    xpReward: 200,
  },
];

const defaultBadges: Badge[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to the app!',
    tier: 'bronze',
    category: 'milestone',
    iconName: 'award',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Open the app',
  },
  {
    id: 'first_timer',
    name: 'First Timer',
    description: 'Completed first calculation',
    tier: 'bronze',
    category: 'milestone',
    iconName: 'award',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Complete 1 calculation',
  },
  {
    id: 'morning_person',
    name: 'Morning Person',
    description: 'Early riser energy saver',
    tier: 'bronze',
    category: 'behavior',
    iconName: 'sun',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Open app before 9 AM',
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Consistent app usage',
    tier: 'bronze',
    category: 'behavior',
    iconName: 'calendar',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Use app 3 days in a row',
  },
  {
    id: 'efficiency_explorer',
    name: 'Efficiency Explorer',
    description: 'Started tracking appliances',
    tier: 'silver',
    category: 'efficiency',
    iconName: 'award',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Track 3 appliances',
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Master of energy optimization',
    tier: 'gold',
    category: 'efficiency',
    iconName: 'award',
    color: '#FFD700',
    isEarned: false,
    requirements: 'Track 10 appliances and save ₱500',
  },
  {
    id: 'penny_saver',
    name: 'Penny Saver',
    description: 'Started saving money',
    tier: 'bronze',
    category: 'savings',
    iconName: 'coins',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Save ₱50 monthly',
  },
  {
    id: 'smart_saver',
    name: 'Smart Saver',
    description: 'Significant savings achieved',
    tier: 'silver',
    category: 'savings',
    iconName: 'coins',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Save ₱200 monthly',
  },
];

const defaultStreaks: Streak[] = [
  {
    id: 'daily_usage',
    name: 'Daily Check-in',
    description: 'Open the app daily',
    currentStreak: 0,
    longestStreak: 0,
    isActive: false,
    iconName: 'calendar',
    color: '#2563EB',
  },
  {
    id: 'calculation_streak',
    name: 'Calculation Streak',
    description: 'Perform calculations daily',
    currentStreak: 0,
    longestStreak: 0,
    isActive: false,
    iconName: 'calculator',
    color: '#10B981',
  },
  {
    id: 'goal_streak',
    name: 'Goal Completion',
    description: 'Complete goals consistently',
    currentStreak: 0,
    longestStreak: 0,
    isActive: false,
    iconName: 'target',
    color: '#8B5CF6',
  },
];

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [streaks, setStreaks] = useState<Streak[]>(defaultStreaks);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    rank: 'Beginner',
    joinDate: new Date(),
  });

  const stats: GamificationStats = {
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.isUnlocked).length,
    totalBadges: badges.length,
    earnedBadges: badges.filter(b => b.isEarned).length,
    activeStreaks: streaks.filter(s => s.isActive).length,
    completedGoals: goals.filter(g => g.isCompleted).length,
    totalXp: userProgress.totalXp,
    currentLevel: userProgress.level,
  };

  const addGoal = (newGoal: Omit<Goal, 'id' | 'current' | 'isCompleted' | 'completedAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      current: 0,
      isCompleted: false,
    };
    setGoals(prev => [...prev, goal]);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, current: Math.min(progress, goal.target) }
          : goal
      )
    );
  };

  const completeGoal = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, isCompleted: true, completedAt: new Date(), current: goal.target }
          : goal
      )
    );
    
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      addXp(goal.xpReward);
    }
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateStreak = (streakId: string) => {
    setStreaks(prev => 
      prev.map(streak => {
        if (streak.id === streakId) {
          const today = new Date();
          const lastAction = streak.lastActionDate;
          
          if (!lastAction) {
            // First time action
            return {
              ...streak,
              currentStreak: 1,
              longestStreak: Math.max(streak.longestStreak, 1),
              lastActionDate: today,
              isActive: true,
            };
          } else if (isSameDay(lastAction, today)) {
            // Same day, don't increment
            return streak;
          } else if (isConsecutiveDay(lastAction, today)) {
            // Consecutive day
            return {
              ...streak,
              currentStreak: streak.currentStreak + 1,
              longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
              lastActionDate: today,
              isActive: true,
            };
          } else {
            // Streak broken, reset
            return {
              ...streak,
              currentStreak: 1,
              longestStreak: streak.longestStreak,
              lastActionDate: today,
              isActive: true,
            };
          }
        }
        return streak;
      })
    );
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, isUnlocked: true, unlockedAt: new Date() }
          : achievement
      )
    );
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.isUnlocked) {
      addXp(achievement.xpReward);
    }
  };

  const earnBadge = (badgeId: string) => {
    setBadges(prev => 
      prev.map(badge => 
        badge.id === badgeId 
          ? { ...badge, isEarned: true, earnedAt: new Date() }
          : badge
      )
    );
  };

  const addXp = (amount: number) => {
    setUserProgress(prev => {
      const newTotalXp = prev.totalXp + amount;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNextLevel = newLevel * 100;
      
      // Level up logic
      while (newXp >= xpToNextLevel) {
        newXp -= xpToNextLevel;
        newLevel++;
        xpToNextLevel = newLevel * 100;
      }
      
      const rank = getRank(newLevel);
      
      return {
        ...prev,
        xp: newXp,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel: xpToNextLevel - newXp,
        rank,
      };
    });
  };

  const checkAchievements = () => {
    // This would be called when certain actions are performed
    // Implementation would check criteria and unlock achievements
  };

  const isConsecutiveDay = (lastDate: Date, currentDate: Date): boolean => {
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const getRank = (level: number): string => {
    if (level < 5) return 'Beginner';
    if (level < 10) return 'Apprentice';
    if (level < 20) return 'Expert';
    if (level < 30) return 'Master';
    return 'Grandmaster';
  };

  return (
    <GamificationContext.Provider value={{
      achievements,
      badges,
      streaks,
      goals,
      userProgress,
      stats,
      addGoal,
      updateGoalProgress,
      completeGoal,
      deleteGoal,
      updateStreak,
      unlockAchievement,
      earnBadge,
      addXp,
      checkAchievements,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}