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
    id: 'welcome',
    title: 'Welcome!',
    description: 'Open the app for the first time',
    category: 'milestone',
    iconName: 'star',
    color: '#10B981',
    isUnlocked: false,
    criteria: { type: 'app_opens', target: 1, current: 0 },
    xpReward: 25,
  },
  {
    id: 'first_calculation',
    title: 'First Steps',
    description: 'Complete your first appliance calculation',
    category: 'milestone',
    iconName: 'calculator',
    color: '#2563EB',
    isUnlocked: false,
    criteria: { type: 'calculations', target: 1, current: 0 },
    xpReward: 50,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Open the app before 9 AM',
    category: 'time',
    iconName: 'sun',
    color: '#F59E0B',
    isUnlocked: false,
    criteria: { type: 'early_opens', target: 1, current: 0 },
    xpReward: 30,
  },
  {
    id: 'consistent',
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
    id: 'explorer',
    title: 'Explorer',
    description: 'Select your first appliance',
    category: 'behavior',
    iconName: 'zap',
    color: '#10B981',
    isUnlocked: false,
    criteria: { type: 'appliances_selected', target: 1, current: 0 },
    xpReward: 40,
  },
  {
    id: 'calculator_pro',
    title: 'Calculator Pro',
    description: 'Complete 5 calculations',
    category: 'milestone',
    iconName: 'calculator',
    color: '#6366F1',
    isUnlocked: false,
    criteria: { type: 'calculations', target: 5, current: 0 },
    xpReward: 100,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Use the app after 9 PM',
    category: 'time',
    iconName: 'moon',
    color: '#6366F1',
    isUnlocked: false,
    criteria: { type: 'late_opens', target: 1, current: 0 },
    xpReward: 30,
  },
  {
    id: 'energy_conscious',
    title: 'Energy Conscious',
    description: 'Track 3 different appliances',
    category: 'behavior',
    iconName: 'leaf',
    color: '#059669',
    isUnlocked: false,
    criteria: { type: 'appliances_tracked', target: 3, current: 0 },
    xpReward: 80,
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Use the app for 7 consecutive days',
    category: 'time',
    iconName: 'flame',
    color: '#EF4444',
    isUnlocked: false,
    criteria: { type: 'streak_days', target: 7, current: 0 },
    xpReward: 150,
  },
  {
    id: 'goal_setter',
    title: 'Goal Setter',
    description: 'Create your first goal',
    category: 'milestone',
    iconName: 'target',
    color: '#8B5CF6',
    isUnlocked: false,
    criteria: { type: 'goals_created', target: 1, current: 0 },
    xpReward: 60,
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Reduce monthly costs by ₱200',
    category: 'savings',
    iconName: 'coins',
    color: '#10B981',
    isUnlocked: false,
    criteria: { type: 'savings', target: 200, current: 0 },
    xpReward: 120,
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
    iconName: 'trophy',
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
    iconName: 'star',
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
    iconName: 'calculator',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Complete 1 calculation',
  },
  {
    id: 'morning_person',
    name: 'Morning Person',
    description: 'Early bird gets the worm',
    tier: 'bronze',
    category: 'time',
    iconName: 'sun',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Open app before 9 AM',
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Building good habits',
    tier: 'bronze',
    category: 'time',
    iconName: 'calendar',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Use app 3 days in a row',
  },
  {
    id: 'efficiency_bronze',
    name: 'Efficiency Explorer',
    description: 'Started your energy efficiency journey',
    tier: 'silver',
    category: 'efficiency',
    iconName: 'leaf',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Track 3 appliances',
  },
  {
    id: 'efficiency_silver',
    name: 'Efficiency Enthusiast',
    description: 'Consistently tracking energy usage',
    tier: 'gold',
    category: 'efficiency',
    iconName: 'leaf',
    color: '#FFD700',
    isEarned: false,
    requirements: 'Use app for 7 days',
  },
  {
    id: 'calculator_bronze',
    name: 'Calculator Novice',
    description: 'Getting comfortable with calculations',
    tier: 'bronze',
    category: 'usage',
    iconName: 'calculator',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Complete 5 calculations',
  },
  {
    id: 'calculator_silver',
    name: 'Calculator Expert',
    description: 'Mastering the calculation tools',
    tier: 'silver',
    category: 'usage',
    iconName: 'calculator',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Complete 20 calculations',
  },
  {
    id: 'goal_bronze',
    name: 'Goal Setter',
    description: 'Taking charge of your energy goals',
    tier: 'bronze',
    category: 'goals',
    iconName: 'target',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Create 1 goal',
  },
  {
    id: 'goal_silver',
    name: 'Goal Achiever',
    description: 'Consistently reaching targets',
    tier: 'silver',
    category: 'goals',
    iconName: 'trophy',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Complete 3 goals',
  },
  {
    id: 'saver_bronze',
    name: 'Penny Saver',
    description: 'Every peso counts!',
    tier: 'bronze',
    category: 'savings',
    iconName: 'coins',
    color: '#CD7F32',
    isEarned: false,
    requirements: 'Save ₱50 monthly',
  },
  {
    id: 'saver_silver',
    name: 'Smart Saver',
    description: 'Making meaningful savings',
    tier: 'silver',
    category: 'savings',
    iconName: 'coins',
    color: '#C0C0C0',
    isEarned: false,
    requirements: 'Save ₱200 monthly',
  },
  {
    id: 'streak_bronze',
    name: 'Streak Starter',
    description: 'Building consistency',
    tier: 'bronze',
    category: 'streaks',
    iconName: 'flame',
    color: '#CD7F32',
    isEarned: false,
    requirements: '3-day streak',
  },
  {
    id: 'streak_silver',
    name: 'Streak Master',
    description: 'Consistency is key',
    tier: 'silver',
    category: 'streaks',
    iconName: 'flame',
    color: '#C0C0C0',
    isEarned: false,
    requirements: '7-day streak',
  },
  {
    id: 'efficiency_gold',
    name: 'Efficiency Master',
    description: 'True energy optimization expert',
    tier: 'gold',
    category: 'efficiency',
    iconName: 'crown',
    color: '#FFD700',
    isEarned: false,
    requirements: 'Track 10 appliances and save ₱500',
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
          
          if (!lastAction || isConsecutiveDay(lastAction, today)) {
            return {
              ...streak,
              currentStreak: streak.currentStreak + 1,
              longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
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
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNextLevel = prev.xpToNextLevel;
      
      // Level up logic
      while (newXp >= xpToNextLevel) {
        newLevel++;
        xpToNextLevel = newLevel * 100; // Each level requires 100 more XP
      }
      
      const rank = getRank(newLevel);
      
      return {
        ...prev,
        xp: newXp,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel,
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