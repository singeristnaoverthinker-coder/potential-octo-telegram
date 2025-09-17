import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ApplianceCalculator from '@/components/ApplianceCalculator';
import { useAppliances } from '@/context/ApplianceContext';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  refrigerator: require('lucide-react-native').Refrigerator,
  wind: require('lucide-react-native').Wind,
  shirt: require('lucide-react-native').Shirt,
  monitor: require('lucide-react-native').Monitor,
  fan: require('lucide-react-native').Fan,
  droplets: require('lucide-react-native').Droplets,
  microwave: require('lucide-react-native').Microwave,
  zap: Zap,
};

export default function DynamicCalculatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appliances, updateApplianceUsage } = useAppliances();

  const appliance = appliances.find(a => a.id === id);

  if (!appliance) {
    return (
      <View style={styles.errorContainer}>
        <Zap size={64} color="#9CA3AF" />
        <Text style={styles.errorTitle}>Appliance Not Found</Text>
        <Text style={styles.errorText}>
          The requested appliance could not be found.
        </Text>
      </View>
    );
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={40} color={appliance.color} /> : <Zap size={40} color={appliance.color} />;
  };

  return (
    <ApplianceCalculator
      applianceName={appliance.name}
      minWattage={appliance.minWattage}
      maxWattage={appliance.maxWattage}
      defaultWattage={appliance.defaultWattage}
      icon={getIconComponent(appliance.iconName)}
      color={appliance.color}
      onUpdateUsage={(wattage: number, hours: number) => {
        updateApplianceUsage(appliance.id, wattage, hours);
      }}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});