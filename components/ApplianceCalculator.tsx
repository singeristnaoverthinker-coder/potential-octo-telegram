import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppliances } from '@/context/ApplianceContext';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ApplianceCalculatorProps {
  applianceName: string;
  minWattage: number;
  maxWattage: number;
  defaultWattage: number;
  icon: React.ReactNode;
  color: string;
  onUpdateUsage?: (wattage: number, hours: number) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  onValueChange: (value: number) => void;
}

function CustomSlider({ label, value, min, max, step, unit, color, onValueChange }: SliderProps) {
  const sliderWidth = Math.min(screenWidth - 64, 300);
  const knobSize = 28;
  
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(((value - min) / (max - min)) * (sliderWidth - knobSize));
  const startPosition = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = ((value - min) / (max - min)) * (sliderWidth - knobSize);
  }, [value, min, max, sliderWidth]);

  const updateValue = (newX: number) => {
    'worklet';
    const clampedX = Math.max(0, Math.min(sliderWidth - knobSize, newX));
    const newValue = min + (clampedX / (sliderWidth - knobSize)) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));
    
    runOnJS(onValueChange)(finalValue);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isDragging.value = true;
      startPosition.value = translateX.value;
      if (Platform.OS !== 'web') {
        runOnJS(() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (error) {
            // Haptics not available
          }
        })();
      }
    },
    onActive: (event) => {
      const newX = startPosition.value + event.translationX;
      translateX.value = Math.max(0, Math.min(sliderWidth - knobSize, newX));
      updateValue(translateX.value);
    },
    onEnd: () => {
      isDragging.value = false;
    },
  });

  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: withSpring(isDragging.value ? 1.2 : 1) }
      ],
      backgroundColor: isDragging.value ? '#FFFFFF' : color,
      borderColor: color,
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + knobSize / 2,
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderWrapper}>
        <View style={[styles.sliderTrack, { width: sliderWidth }]}>
          <Animated.View style={[styles.activeTrack, animatedTrackStyle]} />
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.sliderKnob, animatedKnobStyle]} />
          </PanGestureHandler>
        </View>
        <Text style={[styles.sliderValue, { color }]}>
          {value} {unit}
        </Text>
      </View>
    </View>
  );
}

export default function ApplianceCalculator({
  applianceName,
  minWattage,
  maxWattage,
  defaultWattage,
  icon,
  color,
  onUpdateUsage,
}: ApplianceCalculatorProps) {
  const { ratePerKwh, currentTip } = useAppliances();
  const [wattage, setWattage] = useState(defaultWattage);
  const [hoursPerDay, setHoursPerDay] = useState(8);

  const dailyConsumption = (wattage * hoursPerDay) / 1000; // kWh per day
  const monthlyConsumption = dailyConsumption * 30; // kWh per month
  const dailyCost = dailyConsumption * ratePerKwh;
  const monthlyCost = monthlyConsumption * ratePerKwh;

  const scaleValue = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scaleValue.value) }],
    };
  });

  useEffect(() => {
    scaleValue.value = 0.95;
    setTimeout(() => {
      scaleValue.value = 1;
    }, 100);
    
    // Update usage in context if callback provided
    if (onUpdateUsage) {
      onUpdateUsage(wattage, hoursPerDay);
    }
  }, [wattage, hoursPerDay, onUpdateUsage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            {icon}
          </View>
          <Text style={styles.applianceName}>{applianceName}</Text>
          <Text style={styles.subtitle}>Electricity Cost Calculator</Text>
        </View>
      </View>

      <View style={styles.calculatorCard}>
        <CustomSlider
          label="Power Consumption"
          value={wattage}
          min={minWattage}
          max={maxWattage}
          step={5}
          unit="Watts"
          color={color}
          onValueChange={setWattage}
        />

        <CustomSlider
          label="Daily Usage Hours"
          value={hoursPerDay}
          min={1}
          max={24}
          step={0.5}
          unit="hours"
          color={color}
          onValueChange={setHoursPerDay}
        />

        <View style={styles.rateDisplay}>
          <Text style={styles.rateLabel}>Current Electricity Rate</Text>
          <Text style={[styles.rateValue, { color }]}>₱{ratePerKwh.toFixed(2)} per kWh</Text>
          <Text style={styles.rateNote}>Adjust this rate in Settings</Text>
        </View>
      </View>

      <Animated.View style={[styles.resultsCard, animatedContainerStyle]}>
        <Text style={styles.resultsTitle}>Estimated Costs</Text>
        
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Daily Consumption</Text>
            <Text style={[styles.resultValue, { color }]}>
              {dailyConsumption.toFixed(2)} kWh
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Daily Cost</Text>
            <Text style={[styles.resultValue, { color }]}>
              ₱{dailyCost.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Monthly Consumption</Text>
            <Text style={[styles.resultValue, { color }]}>
              {monthlyConsumption.toFixed(2)} kWh
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Monthly Cost</Text>
            <Text style={[styles.resultValue, { color }]}>
              ₱{monthlyCost.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.totalCostContainer, { backgroundColor: color + '10' }]}>
          <Text style={styles.totalCostLabel}>Estimated Monthly Bill</Text>
          <Text style={[styles.totalCostValue, { color }]}>
            ₱{monthlyCost.toFixed(2)}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.tipContainer}>
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
    paddingTop: Math.max(20, screenHeight * 0.02),
    paddingBottom: Math.max(20, screenHeight * 0.03),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: Math.min(80, screenWidth * 0.2),
    height: Math.min(80, screenWidth * 0.2),
    borderRadius: Math.min(20, screenWidth * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  applianceName: {
    fontSize: Math.min(28, screenWidth * 0.07),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    fontWeight: '500',
  },
  calculatorCard: {
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
  sliderContainer: {
    marginBottom: 32,
  },
  sliderLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  sliderWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 16,
  },
  activeTrack: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    position: 'absolute',
    top: -11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderValue: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    textAlign: 'center',
  },
  rateDisplay: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  rateValue: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  rateNote: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
  },
  resultsCard: {
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
  resultsTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    textAlign: 'center',
  },
  totalCostContainer: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  totalCostLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalCostValue: {
    fontSize: Math.min(32, screenWidth * 0.08),
    fontWeight: '800',
    textAlign: 'center',
  },
  tipContainer: {
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