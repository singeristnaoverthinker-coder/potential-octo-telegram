import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Trophy, Target, Calendar, Award, Star, Zap, TrendingUp, Plus, X, Check, Flame, Coins, Settings, Calculator, Leaf, ChevronRight, Crown, Medal, Shield, Clock, Coffee, Sun, Moon, Heart, Smartphone, Chrome as Home, Users, BookOpen, Gift } from 'lucide-react-native';
import { useGamification } from '@/context/GamificationContext';
import { Goal } from '@/types/gamification';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const iconMap: { [key: string]: React.ComponentType<any> } = {
  trophy: Trophy,
  target: Target,
  calendar: Calendar,
  award: Award,
  star: Star,
  zap: Zap,
  trending: TrendingUp,
  flame: Flame,
  coins: Coins,
  settings: Settings,
  calculator: Calculator,
  leaf: Leaf,
  crown: Crown,
  medal: Medal,
  shield: Shield,
  clock: Clock,
  coffee: Coffee,
  sun: Sun,
  moon: Moon,
  heart: Heart,
  smartphone: Smartphone,
  home: Home,
  users: Users,
  bookopen: BookOpen,
  gift: Gift,
};

const goalTemplates = [
  {
    title: 'Daily Energy Check',
    description: 'Check your energy usage daily',
    type: 'daily' as const,
    category: 'usage' as const,
    target: 1,
    unit: 'check',
    iconName: 'calendar',
    color: '#2563EB',
    xpReward: 25,
  },
  {
    title: 'Weekly Savings Goal',
    description: 'Save ₱50 on electricity this week',
    type: 'weekly' as const,
    category: 'cost' as const,
    target: 50,
    unit: '₱',
    iconName: 'coins',
    color: '#10B981',
    xpReward: 75,
  },
  {
    title: 'Monthly Efficiency',
    description: 'Reduce energy consumption by 5%',
    type: 'monthly' as const,
    category: 'efficiency' as const,
    target: 5,
    unit: '%',
    iconName: 'leaf',
    color: '#059669',
    xpReward: 150,
  },
  {
    title: 'Appliance Optimizer',
    description: 'Optimize 3 appliances this week',
    type: 'weekly' as const,
    category: 'usage' as const,
    target: 3,
    unit: 'appliances',
    iconName: 'settings',
    color: '#8B5CF6',
    xpReward: 100,
  },
  {
    title: 'Quick Learner',
    description: 'Complete 5 calculations today',
    type: 'daily' as const,
    category: 'usage' as const,
    target: 5,
    unit: 'calculations',
    iconName: 'calculator',
    color: '#F59E0B',
    xpReward: 50,
  },
];

export default function ChallengesScreen() {
  const {
    achievements,
    badges,
    streaks,
    goals,
    userProgress,
    stats,
    addGoal,
    completeGoal,
    deleteGoal,
  } = useGamification();

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'badges' | 'streaks' | 'goals'>('overview');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof goalTemplates[0] | null>(null);
  const [customGoal, setCustomGoal] = useState({
    title: '',
    description: '',
    target: '1',
    unit: '',
  });

  const scaleValue = useSharedValue(1);
  const modalOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scaleValue.value) }],
    };
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(modalOpacity.value, { duration: 200 }),
    };
  });

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Zap;
  };

  const openGoalModal = () => {
    setShowGoalModal(true);
    modalOpacity.value = 1;
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    modalOpacity.value = 0;
    setSelectedTemplate(null);
    setCustomGoal({ title: '', description: '', target: '1', unit: '' });
  };

  const handleCreateGoal = () => {
    if (selectedTemplate) {
      const endDate = new Date();
      if (selectedTemplate.type === 'daily') {
        endDate.setDate(endDate.getDate() + 1);
      } else if (selectedTemplate.type === 'weekly') {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      addGoal({
        ...selectedTemplate,
        startDate: new Date(),
        endDate,
        isActive: true,
      });
    } else if (customGoal.title && customGoal.target) {
      const target = parseInt(customGoal.target);
      if (isNaN(target) || target <= 0) {
        Alert.alert('Error', 'Please enter a valid target number');
        return;
      }

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Default to weekly

      addGoal({
        title: customGoal.title,
        description: customGoal.description || customGoal.title,
        type: 'weekly',
        category: 'custom',
        target,
        unit: customGoal.unit || 'units',
        startDate: new Date(),
        endDate,
        isActive: true,
        iconName: 'target',
        color: '#6366F1',
        xpReward: 100,
      });
    }

    closeGoalModal();
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* User Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.levelContainer}>
            <Crown size={32} color="#FFD700" />
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {userProgress.level}</Text>
              <Text style={styles.rankText}>{userProgress.rank}</Text>
            </View>
          </View>
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>{userProgress.xp} XP</Text>
            <Text style={styles.xpToNext}>Next: {userProgress.xpToNextLevel}</Text>
          </View>
        </View>
        
        <View style={styles.xpBar}>
          <View 
            style={[
              styles.xpProgress, 
              { width: `${Math.min((userProgress.xp / userProgress.xpToNextLevel) * 100, 100)}%` }
            ]} 
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Trophy size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{stats.unlockedAchievements}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color="#C0C0C0" />
          <Text style={styles.statNumber}>{stats.earnedBadges}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
        <View style={styles.statCard}>
          <Flame size={24} color="#EF4444" />
          <Text style={styles.statNumber}>{stats.activeStreaks}</Text>
          <Text style={styles.statLabel}>Streaks</Text>
        </View>
        <View style={styles.statCard}>
          <Target size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.completedGoals}</Text>
          <Text style={styles.statLabel}>Goals</Text>
        </View>
      </View>

      {/* Active Goals */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Active Goals</Text>
        {goals.filter(g => g.isActive && !g.isCompleted).slice(0, 3).map((goal) => {
          const IconComponent = getIconComponent(goal.iconName);
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <View key={goal.id} style={styles.goalItem}>
              <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                <IconComponent size={20} color={goal.color} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalProgress}>
                  {goal.current}/{goal.target} {goal.unit}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${progress}%`, backgroundColor: goal.color }
                    ]} 
                  />
                </View>
              </View>
            </View>
          );
        })}
        {goals.filter(g => g.isActive && !g.isCompleted).length === 0 && (
          <Text style={styles.emptyText}>No active goals. Create one to get started!</Text>
        )}
      </View>

      {/* Recent Achievements */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {achievements.filter(a => a.isUnlocked).slice(0, 3).map((achievement) => {
          const IconComponent = getIconComponent(achievement.iconName);
          
          return (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                <IconComponent size={20} color={achievement.color} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              </View>
              <Text style={styles.xpReward}>+{achievement.xpReward} XP</Text>
            </View>
          );
        })}
        {achievements.filter(a => a.isUnlocked).length === 0 && (
          <Text style={styles.emptyText}>Complete actions to unlock achievements!</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {achievements.map((achievement) => {
        const IconComponent = getIconComponent(achievement.iconName);
        const progress = Math.min((achievement.criteria.current / achievement.criteria.target) * 100, 100);
        
        return (
          <View 
            key={achievement.id} 
            style={[
              styles.achievementCard,
              achievement.isUnlocked && styles.unlockedCard
            ]}
          >
            <View style={styles.achievementHeader}>
              <View style={[
                styles.achievementIconLarge, 
                { backgroundColor: achievement.color + '20' }
              ]}>
                <IconComponent 
                  size={32} 
                  color={achievement.isUnlocked ? achievement.color : '#9CA3AF'} 
                />
              </View>
              <View style={styles.achievementDetails}>
                <Text style={[
                  styles.achievementTitleLarge,
                  !achievement.isUnlocked && styles.lockedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescLarge}>
                  {achievement.description}
                </Text>
                <Text style={styles.xpRewardLarge}>
                  {achievement.xpReward} XP
                </Text>
              </View>
              {achievement.isUnlocked && (
                <Check size={24} color="#10B981" />
              )}
            </View>
            
            {!achievement.isUnlocked && (
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                  Progress: {achievement.criteria.current}/{achievement.criteria.target}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${progress}%`, backgroundColor: achievement.color }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderBadges = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.badgeGrid}>
        {badges.map((badge) => {
          const IconComponent = getIconComponent(badge.iconName);
          
          return (
            <View 
              key={badge.id} 
              style={[
                styles.badgeCard,
                badge.isEarned && styles.earnedBadge
              ]}
            >
              <View style={[
                styles.badgeIcon,
                { backgroundColor: badge.color + '20' }
              ]}>
                <IconComponent 
                  size={28} 
                  color={badge.isEarned ? badge.color : '#9CA3AF'} 
                />
              </View>
              <Text style={[
                styles.badgeName,
                !badge.isEarned && styles.lockedText
              ]}>
                {badge.name}
              </Text>
              <Text style={styles.badgeTier}>{badge.tier.toUpperCase()}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
              <Text style={styles.badgeReq}>{badge.requirements}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderStreaks = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {streaks.map((streak) => {
        const IconComponent = getIconComponent(streak.iconName);
        
        return (
          <View key={streak.id} style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={[
                styles.streakIcon,
                { backgroundColor: streak.color + '20' }
              ]}>
                <IconComponent size={24} color={streak.color} />
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakName}>{streak.name}</Text>
                <Text style={styles.streakDesc}>{streak.description}</Text>
              </View>
              <View style={styles.streakStats}>
                <Text style={styles.currentStreak}>{streak.currentStreak}</Text>
                <Text style={styles.streakLabel}>Current</Text>
              </View>
            </View>
            
            <View style={styles.streakFooter}>
              <Text style={styles.longestStreak}>
                Longest: {streak.longestStreak} days
              </Text>
              <View style={[
                styles.streakStatus,
                { backgroundColor: streak.isActive ? '#10B981' : '#9CA3AF' }
              ]}>
                <Text style={styles.streakStatusText}>
                  {streak.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderGoals = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.addGoalButton} onPress={openGoalModal}>
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.addGoalText}>Create New Goal</Text>
      </TouchableOpacity>

      {goals.map((goal) => {
        const IconComponent = getIconComponent(goal.iconName);
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isExpired = new Date() > goal.endDate;
        
        return (
          <View 
            key={goal.id} 
            style={[
              styles.goalCard,
              goal.isCompleted && styles.completedGoal,
              isExpired && !goal.isCompleted && styles.expiredGoal
            ]}
          >
            <View style={styles.goalHeader}>
              <View style={[
                styles.goalIconLarge,
                { backgroundColor: goal.color + '20' }
              ]}>
                <IconComponent size={24} color={goal.color} />
              </View>
              <View style={styles.goalDetails}>
                <Text style={styles.goalTitleLarge}>{goal.title}</Text>
                <Text style={styles.goalDescLarge}>{goal.description}</Text>
                <Text style={styles.goalType}>
                  {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
                </Text>
              </View>
              {goal.isCompleted && (
                <Check size={24} color="#10B981" />
              )}
            </View>
            
            <View style={styles.goalProgressSection}>
              <Text style={styles.goalProgressText}>
                {goal.current}/{goal.target} {goal.unit} ({progress.toFixed(0)}%)
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress}%`, backgroundColor: goal.color }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.goalFooter}>
              <Text style={styles.goalDates}>
                Ends: {goal.endDate.toLocaleDateString()}
              </Text>
              <Text style={styles.goalXp}>+{goal.xpReward} XP</Text>
            </View>
          </View>
        );
      })}
      
      {goals.length === 0 && (
        <View style={styles.emptyGoals}>
          <Target size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Goals Yet</Text>
          <Text style={styles.emptyText}>
            Create your first goal to start tracking your progress!
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Trophy size={32} color="#FFD700" />
          <Text style={styles.title}>Challenges</Text>
        </View>
        <Text style={styles.subtitle}>Complete challenges and earn rewards</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'overview', label: 'Overview', icon: Star },
            { key: 'achievements', label: 'Achievements', icon: Trophy },
            { key: 'badges', label: 'Badges', icon: Award },
            { key: 'streaks', label: 'Streaks', icon: Flame },
            { key: 'goals', label: 'Goals', icon: Target },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <IconComponent 
                  size={20} 
                  color={isActive ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'streaks' && renderStreaks()}
        {activeTab === 'goals' && renderGoals()}
      </View>

      {/* Goal Creation Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeGoalModal}
      >
        <Animated.View style={[styles.modalOverlay, animatedModalStyle]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={closeGoalModal} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>Choose Template</Text>
              {goalTemplates.map((template, index) => {
                const IconComponent = getIconComponent(template.iconName);
                const isSelected = selectedTemplate?.title === template.title;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.templateCard,
                      isSelected && styles.selectedTemplate
                    ]}
                    onPress={() => setSelectedTemplate(template)}
                  >
                    <View style={[
                      styles.templateIcon,
                      { backgroundColor: template.color + '20' }
                    ]}>
                      <IconComponent size={20} color={template.color} />
                    </View>
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateTitle}>{template.title}</Text>
                      <Text style={styles.templateDesc}>{template.description}</Text>
                      <Text style={styles.templateReward}>+{template.xpReward} XP</Text>
                    </View>
                    {isSelected && (
                      <Check size={20} color="#10B981" />
                    )}
                  </TouchableOpacity>
                );
              })}

              <Text style={styles.sectionLabel}>Or Create Custom Goal</Text>
              <View style={styles.customGoalForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Goal title"
                  value={customGoal.title}
                  onChangeText={(text) => setCustomGoal(prev => ({ ...prev, title: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description (optional)"
                  value={customGoal.description}
                  onChangeText={(text) => setCustomGoal(prev => ({ ...prev, description: text }))}
                />
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="Target"
                    value={customGoal.target}
                    onChangeText={(text) => setCustomGoal(prev => ({ ...prev, target: text }))}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="Unit"
                    value={customGoal.unit}
                    onChangeText={(text) => setCustomGoal(prev => ({ ...prev, unit: text }))}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeGoalModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateGoal}
                disabled={!selectedTemplate && !customGoal.title}
              >
                <Text style={styles.createButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingTop: Math.max(20, screenHeight * 0.02),
    paddingBottom: Math.max(16, screenHeight * 0.02),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: Math.min(28, screenWidth * 0.07),
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  tabNavigation: {
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelInfo: {
    marginLeft: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  rankText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  xpToNext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  xpBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (screenWidth - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  xpReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    opacity: 0.6,
  },
  unlockedCard: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitleLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescLarge: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  xpRewardLarge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  progressSection: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  badgeCard: {
    width: (screenWidth - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    opacity: 0.6,
  },
  earnedBadge: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeTier: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeReq: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  streakDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  streakStats: {
    alignItems: 'center',
  },
  currentStreak: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EF4444',
  },
  streakLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  streakFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  longestStreak: {
    fontSize: 14,
    color: '#6B7280',
  },
  streakStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addGoalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedGoal: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  expiredGoal: {
    opacity: 0.6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconLarge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitleLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalDescLarge: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  goalType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  goalProgressSection: {
    marginBottom: 12,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  goalDates: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  goalXp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyGoals: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplate: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  templateDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  templateReward: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  customGoalForm: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});