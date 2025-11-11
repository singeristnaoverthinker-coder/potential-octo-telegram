import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { 
  Zap, 
  TrendingUp, 
  Calendar,
  Calculator,
  ChevronRight,
  Plus,
  Refrigerator, 
  Wind, 
  Shirt, 
  Monitor, 
  Fan, 
  Droplets, 
  Microwave,
  Lightbulb,
  Coffee,
  Tv,
  Cpu,
} from 'lucide-react-native';
import { useAppliances } from '@/context/ApplianceContext';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const iconMap: { [key: string]: React.ComponentType<any> } = {
  refrigerator: Refrigerator,
  wind: Wind,
  shirt: Shirt,
  monitor: Monitor,
  fan: Fan,
  droplets: Droplets,
  microwave: Microwave,
  zap: Zap,
  lightbulb: Lightbulb,
  coffee: Coffee,
  tv: Tv,
  cpu: Cpu,
};

export default function SummaryScreen() {
  const { selectedAppliances, applianceUsage, ratePerKwh } = useAppliances();
  const { currentTip } = useAppliances();

  const scaleValue = useSharedValue(1);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scaleValue.value) }],
    };
  });

  const totalDailyCost = applianceUsage.reduce((sum, usage) => sum + usage.dailyCost, 0);
  const totalMonthlyCost = applianceUsage.reduce((sum, usage) => sum + usage.monthlyCost, 0);
  const totalDailyConsumption = applianceUsage.reduce((sum, usage) => 
    sum + (usage.wattage * usage.hoursPerDay) / 1000, 0
  );
  const totalAnnualCost = totalMonthlyCost * 12;

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Zap;
  };

  const navigateToCalculator = (applianceId: string) => {
    router.push(`/calculator/${applianceId}` as any);
  };

  if (selectedAppliances.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, animatedHeaderStyle]}>
          <View style={styles.logoContainer}>
            <Zap size={40} color="#2563EB" />
          </View>
          <Text style={styles.appTitle}>Project BEAM</Text>
          <Text style={styles.appSubtitle}>Budget-Efficient Appliance Monitor</Text>
        </Animated.View>

        <View style={styles.emptyState}>
          <Calculator size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Appliances Selected</Text>
          <Text style={styles.emptyText}>
            Go to the Appliances tab to select which devices you want to track or add your own custom appliances
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/appliances')}
          >
            <Text style={styles.selectButtonText}>Select Appliances</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>App Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Zap size={20} color="#2563EB" />
              <Text style={styles.featureText}>Calculate costs for 7+ appliance types</Text>
            </View>
            <View style={styles.featureItem}>
              <Plus size={20} color="#10B981" />
              <Text style={styles.featureText}>Add custom appliances</Text>
            </View>
            <View style={styles.featureItem}>
              <TrendingUp size={20} color="#8B5CF6" />
              <Text style={styles.featureText}>Track daily and monthly costs</Text>
            </View>
            <View style={styles.featureItem}>
              <Calculator size={20} color="#F59E0B" />
              <Text style={styles.featureText}>Works completely offline</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <View style={styles.logoContainer}>
          <Zap size={40} color="#2563EB" />
        </View>
        <Text style={styles.appTitle}>Project BEAM</Text>
        <Text style={styles.appSubtitle}>Budget-Efficient Appliance Monitor</Text>
      </Animated.View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Monthly Overview</Text>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Estimated Monthly Bill</Text>
          <Text style={styles.totalValue}>₱{totalMonthlyCost.toFixed(2)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <TrendingUp size={24} color="#6B7280" />
            <Text style={styles.statLabel}>Annual Cost</Text>
            <Text style={styles.statValue}>₱{totalAnnualCost.toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={24} color="#6B7280" />
            <Text style={styles.statLabel}>Daily Cost</Text>
            <Text style={styles.statValue}>₱{totalDailyCost.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.additionalStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Daily kWh</Text>
            <Text style={styles.statValue}>{totalDailyConsumption.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.appliancesList}>
        <Text style={styles.listTitle}>Selected Appliances ({selectedAppliances.length})</Text>
        
        {selectedAppliances.map((appliance) => {
          const usage = applianceUsage.find(u => u.applianceId === appliance.id);
          const IconComponent = getIconComponent(appliance.iconName);
          const isCustom = appliance.id.startsWith('custom-');
          
          return (
            <TouchableOpacity
              key={appliance.id}
              style={styles.applianceItem}
              onPress={() => navigateToCalculator(appliance.id)}
              activeOpacity={0.7}
            >
              <View style={styles.applianceContent}>
                <View style={[styles.applianceIcon, { backgroundColor: appliance.color + '20' }]}>
                  <IconComponent size={24} color={appliance.color} />
                </View>
                
                <View style={styles.applianceInfo}>
                  <View style={styles.applianceHeader}>
                    <Text style={styles.applianceName}>{appliance.name}</Text>
                    {isCustom && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>Custom</Text>
                      </View>
                    )}
                  </View>
                  {usage && (
                    <>
                      <Text style={styles.applianceUsage}>
                        {usage.wattage}W • {usage.hoursPerDay}h/day
                      </Text>
                      <Text style={styles.applianceCost}>
                        ₱{usage.monthlyCost.toFixed(2)}/month
                      </Text>
                    </>
                  )}
                </View>

                <ChevronRight size={20} color="#9CA3AF" />
              </View>

              {usage && totalMonthlyCost > 0 && (
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(usage.monthlyCost / totalMonthlyCost) * 100}%`,
                        backgroundColor: appliance.color,
                      },
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.rateCard}>
        <Text style={styles.rateTitle}>Current Electricity Rate</Text>
        <Text style={styles.rateValue}>₱{ratePerKwh.toFixed(2)} per kWh</Text>
        <Text style={styles.rateNote}>
          You can adjust this rate in the Settings tab
        </Text>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>{currentTip.title}</Text>
        <Text style={styles.tipText}>
          {currentTip.text}
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: Math.max(20, screenHeight * 0.02),
    paddingBottom: Math.max(20, screenHeight * 0.03),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  logoContainer: {
    width: Math.min(80, screenWidth * 0.2),
    height: Math.min(80, screenWidth * 0.2),
    backgroundColor: '#EBF4FF',
    borderRadius: Math.min(20, screenWidth * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: Math.min(32, screenWidth * 0.08),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(16, screenHeight * 0.02),
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalValue: {
    fontSize: Math.min(36, screenWidth * 0.09),
    fontWeight: '800',
    color: '#2563EB',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  additionalStats: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  appliancesList: {
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  listTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  applianceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Math.max(12, screenWidth * 0.03),
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  applianceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applianceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  applianceInfo: {
    flex: 1,
  },
  applianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  applianceName: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  customBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  applianceUsage: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  applianceCost: {
    fontSize: Math.min(14, screenWidth * 0.035),
    fontWeight: '700',
    color: '#2563EB',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(16, screenHeight * 0.02),
    borderRadius: 12,
    padding: Math.max(16, screenWidth * 0.04),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rateTitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  rateValue: {
    fontSize: Math.min(24, screenWidth * 0.06),
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
    textAlign: 'center',
  },
  rateNote: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  emptyTitle: {
    fontSize: Math.min(24, screenWidth * 0.06),
    fontWeight: '700',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Math.max(24, screenHeight * 0.03),
  },
  selectButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: Math.max(24, screenWidth * 0.06),
    paddingVertical: Math.max(12, screenHeight * 0.015),
    borderRadius: 12,
  },
  selectButtonText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(24, screenHeight * 0.03),
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(24, screenHeight * 0.03),
    borderRadius: 12,
    padding: Math.max(16, screenWidth * 0.04),
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipTitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#78350F',
    lineHeight: 20,
  },
});