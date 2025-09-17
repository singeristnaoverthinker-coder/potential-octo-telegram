import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Settings as SettingsIcon, Zap, Info } from 'lucide-react-native';
import { useAppliances } from '@/context/ApplianceContext';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

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
  const sliderWidth = width - 64;
  const knobSize = 28;
  
  const translateX = useSharedValue(((value - min) / (max - min)) * (sliderWidth - knobSize));
  const isPressed = useSharedValue(false);

  const animatedKnobStyle = useAnimatedStyle(() => {
    const scale = isPressed.value ? 1.2 : 1;
    const backgroundColor = interpolateColor(
      isPressed.value ? 1 : 0,
      [0, 1],
      [color, '#FFFFFF']
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale: withSpring(scale) },
      ],
      backgroundColor: withSpring(backgroundColor),
      borderColor: color,
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    const activeWidth = translateX.value + knobSize / 2;
    return {
      width: withSpring(activeWidth),
      backgroundColor: color,
    };
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      isPressed.value = true;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    })
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(sliderWidth - knobSize, event.translationX + translateX.value));
      translateX.value = newX;
      
      const newValue = min + (newX / (sliderWidth - knobSize)) * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      onValueChange(Math.max(min, Math.min(max, steppedValue)));
    })
    .onEnd(() => {
      isPressed.value = false;
      translateX.value = ((value - min) / (max - min)) * (sliderWidth - knobSize);
    });

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderWrapper}>
        <View style={[styles.sliderTrack, { width: sliderWidth }]}>
          <Animated.View style={[styles.activeTrack, animatedTrackStyle]} />
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.sliderKnob, animatedKnobStyle]} />
          </GestureDetector>
        </View>
        <Text style={[styles.sliderValue, { color }]}>
          {value} {unit}
        </Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { ratePerKwh, updateElectricityRate, selectedAppliances, currentTip } = useAppliances();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <SettingsIcon size={40} color="#2563EB" />
        </View>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your electricity settings</Text>
      </View>

      <View style={styles.settingsCard}>
        <CustomSlider
          label="Electricity Rate"
          value={ratePerKwh}
          min={8.0}
          max={25.0}
          step={0.25}
          unit="₱/kWh"
          color="#2563EB"
          onValueChange={updateElectricityRate}
        />

        <View style={styles.rateInfo}>
          <Info size={16} color="#6B7280" />
          <Text style={styles.rateInfoText}>
            Philippine electricity rates typically range from ₱8-₱20 per kWh depending on your location and provider.
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>App Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Selected Appliances</Text>
          <Text style={styles.infoValue}>{selectedAppliances.length}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>John Rayven G. Bulanadi</Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>{currentTip.title}</Text>
        <Text style={styles.tipText}>
          {currentTip.text}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
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
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sliderWrapper: {
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '700',
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  rateInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});