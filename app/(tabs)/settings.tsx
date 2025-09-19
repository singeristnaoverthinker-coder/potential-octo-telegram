import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Settings as SettingsIcon, Zap, Info } from 'lucide-react-native';
import { useAppliances } from '@/context/ApplianceContext';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const sliderWidth = Math.min(screenWidth - 80, 300);
  const knobSize = 28;
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [knobPosition, setKnobPosition] = React.useState(((value - min) / (max - min)) * (sliderWidth - knobSize));

  React.useEffect(() => {
    setKnobPosition(((value - min) / (max - min)) * (sliderWidth - knobSize));
  }, [value, min, max, sliderWidth]);

  const handlePanGestureEvent = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      setIsDragging(true);
      if (Platform.OS !== 'web') {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Haptics not available
        }
      }
    } else if (state === State.ACTIVE) {
      const newX = Math.max(0, Math.min(sliderWidth - knobSize, knobPosition + translationX));
      const newValue = min + (newX / (sliderWidth - knobSize)) * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));
      
      onValueChange(clampedValue);
    } else if (state === State.END || state === State.CANCELLED) {
      setIsDragging(false);
    }
  };

  const knobStyle = {
    ...styles.sliderKnob,
    transform: [
      { translateX: knobPosition },
      { scale: isDragging ? 1.2 : 1 }
    ],
    backgroundColor: isDragging ? '#FFFFFF' : color,
    borderColor: color,
  };

  const activeTrackStyle = {
    ...styles.activeTrack,
    width: knobPosition + knobSize / 2,
    backgroundColor: color,
  };

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderWrapper}>
        <View style={[styles.sliderTrack, { width: sliderWidth }]}>
          <View style={activeTrackStyle} />
          <PanGestureHandler onGestureEvent={handlePanGestureEvent}>
            <View style={knobStyle} />
          </PanGestureHandler>
        </View>
        <Text style={[styles.sliderValue, { color }]}>
          {value.toFixed(2)} {unit}
        </Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { ratePerKwh, updateElectricityRate, selectedAppliances, currentTip } = useAppliances();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <SettingsIcon size={Math.min(40, screenWidth * 0.1)} color="#2563EB" />
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
  iconContainer: {
    width: Math.min(80, screenWidth * 0.2),
    height: Math.min(80, screenWidth * 0.2),
    backgroundColor: '#EBF4FF',
    borderRadius: Math.min(20, screenWidth * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
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
    textAlign: 'center',
  },
  settingsCard: {
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
    marginBottom: 24,
    alignItems: 'center',
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
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  rateInfoText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
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
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  infoValue: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'right',
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(16, screenHeight * 0.02),
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