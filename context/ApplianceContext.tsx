import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appliance, ApplianceUsage } from '@/types/appliance';

const energySavingTips = [
  {
    title: '💡 Energy Saving Tip',
    text: 'Air conditioners typically consume the most electricity. Setting the temperature to 24°C instead of 18°C can reduce consumption by up to 30%.',
  },
  {
    title: '🔌 Power Management Tip',
    text: 'Unplug appliances when not in use. Even in standby mode, many devices consume electricity - this is called "phantom load".',
  },
  {
    title: '💰 Cost Saving Tip',
    text: 'Use your washing machine and dishwasher only when you have full loads. This maximizes efficiency and reduces per-item energy costs.',
  },
  {
    title: '🌡️ Temperature Control Tip',
    text: 'Set your water heater to 120°F (49°C). For every 10°F reduction, you can save 3-5% on water heating costs.',
  },
  {
    title: '💡 Lighting Efficiency Tip',
    text: 'Replace incandescent bulbs with LED lights. LEDs use 75% less energy and last 25 times longer than traditional bulbs.',
  },
  {
    title: '❄️ Refrigerator Efficiency Tip',
    text: 'Keep your refrigerator between 37-40°F and freezer at 5°F. Clean the coils regularly to maintain efficiency.',
  },
  {
    title: '🌬️ Ventilation Tip',
    text: 'Use ceiling fans to circulate air. This allows you to set your AC 4°F higher while maintaining the same comfort level.',
  },
  {
    title: '🔥 Cooking Efficiency Tip',
    text: 'Use the microwave, toaster oven, or slow cooker instead of the full oven when possible. They use 50% less energy.',
  },
  {
    title: '🌙 Peak Hours Tip',
    text: 'Run major appliances during off-peak hours (usually late evening or early morning) when electricity rates are lower.',
  },
  {
    title: '🏠 Insulation Tip',
    text: 'Proper insulation can reduce heating and cooling costs by up to 15%. Check windows, doors, and attic insulation.',
  },
];
interface ApplianceContextType {
  appliances: Appliance[];
  selectedAppliances: Appliance[];
  applianceUsage: ApplianceUsage[];
  ratePerKwh: number;
  currentTip: { title: string; text: string };
  addCustomAppliance: (appliance: Omit<Appliance, 'id' | 'isSelected'>) => void;
  toggleApplianceSelection: (applianceId: string) => void;
  updateApplianceUsage: (applianceId: string, wattage: number, hours: number) => void;
  updateElectricityRate: (rate: number) => void;
  removeCustomAppliance: (applianceId: string) => void;
  rotateTip: () => void;
}

const ApplianceContext = createContext<ApplianceContextType | undefined>(undefined);

const defaultAppliances: Appliance[] = [
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    minWattage: 80,
    maxWattage: 400,
    defaultWattage: 180,
    color: '#2563EB',
    iconName: 'refrigerator',
    isSelected: false,
  },
  {
    id: 'aircon',
    name: 'Air Conditioner',
    minWattage: 500,
    maxWattage: 2500,
    defaultWattage: 1200,
    color: '#06B6D4',
    iconName: 'wind',
    isSelected: false,
  },
  {
    id: 'washing',
    name: 'Washing Machine',
    minWattage: 400,
    maxWattage: 1500,
    defaultWattage: 800,
    color: '#10B981',
    iconName: 'shirt',
    isSelected: false,
  },
  {
    id: 'television',
    name: 'Television',
    minWattage: 50,
    maxWattage: 400,
    defaultWattage: 150,
    color: '#8B5CF6',
    iconName: 'monitor',
    isSelected: false,
  },
  {
    id: 'fan',
    name: 'Electric Fan',
    minWattage: 25,
    maxWattage: 150,
    defaultWattage: 75,
    color: '#10B981',
    iconName: 'fan',
    isSelected: false,
  },
  {
    id: 'heater',
    name: 'Water Heater',
    minWattage: 1000,
    maxWattage: 4000,
    defaultWattage: 2500,
    color: '#EF4444',
    iconName: 'droplets',
    isSelected: false,
  },
  {
    id: 'microwave',
    name: 'Microwave Oven',
    minWattage: 600,
    maxWattage: 1500,
    defaultWattage: 1000,
    color: '#F59E0B',
    iconName: 'microwave',
    isSelected: false,
  },
];

export function ApplianceProvider({ children }: { children: ReactNode }) {
  const [appliances, setAppliances] = useState<Appliance[]>(defaultAppliances);
  const [applianceUsage, setApplianceUsage] = useState<ApplianceUsage[]>([]);
  const [ratePerKwh, setRatePerKwh] = useState(12.50);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const selectedAppliances = appliances.filter(appliance => appliance.isSelected);
  const currentTip = energySavingTips[currentTipIndex];

  const rotateTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % energySavingTips.length);
  };
  const addCustomAppliance = (newAppliance: Omit<Appliance, 'id' | 'isSelected'>) => {
    const id = `custom-${Date.now()}`;
    const appliance: Appliance = {
      ...newAppliance,
      id,
      isSelected: false,
    };
    setAppliances(prev => [...prev, appliance]);
  };

  const toggleApplianceSelection = (applianceId: string) => {
    setAppliances(prev => 
      prev.map(appliance => 
        appliance.id === applianceId 
          ? { ...appliance, isSelected: !appliance.isSelected }
          : appliance
      )
    );

    // Initialize usage data for newly selected appliances
    const appliance = appliances.find(a => a.id === applianceId);
    if (appliance && !appliance.isSelected) {
      const dailyConsumption = (appliance.defaultWattage * 8) / 1000;
      const dailyCost = dailyConsumption * ratePerKwh;
      const monthlyCost = dailyCost * 30;

      setApplianceUsage(prev => [...prev, {
        applianceId,
        wattage: appliance.defaultWattage,
        hoursPerDay: 8,
        dailyCost,
        monthlyCost,
      }]);
    } else {
      // Remove usage data for deselected appliances
      setApplianceUsage(prev => prev.filter(usage => usage.applianceId !== applianceId));
    }
  };

  const updateApplianceUsage = (applianceId: string, wattage: number, hours: number) => {
    const dailyConsumption = (wattage * hours) / 1000;
    const dailyCost = dailyConsumption * ratePerKwh;
    const monthlyCost = dailyCost * 30;

    setApplianceUsage(prev => 
      prev.map(usage => 
        usage.applianceId === applianceId
          ? { ...usage, wattage, hoursPerDay: hours, dailyCost, monthlyCost }
          : usage
      )
    );
  };

  const updateElectricityRate = (rate: number) => {
    setRatePerKwh(rate);
    // Recalculate all usage costs
    setApplianceUsage(prev => 
      prev.map(usage => {
        const dailyConsumption = (usage.wattage * usage.hoursPerDay) / 1000;
        const dailyCost = dailyConsumption * rate;
        const monthlyCost = dailyCost * 30;
        return { ...usage, dailyCost, monthlyCost };
      })
    );
  };

  const removeCustomAppliance = (applianceId: string) => {
    setAppliances(prev => prev.filter(appliance => appliance.id !== applianceId));
    setApplianceUsage(prev => prev.filter(usage => usage.applianceId !== applianceId));
  };

  return (
    <ApplianceContext.Provider value={{
      appliances,
      selectedAppliances,
      applianceUsage,
      ratePerKwh,
      currentTip,
      addCustomAppliance,
      toggleApplianceSelection,
      updateApplianceUsage,
      updateElectricityRate,
      removeCustomAppliance,
      rotateTip,
    }}>
      {children}
    </ApplianceContext.Provider>
  );
}

export function useAppliances() {
  const context = useContext(ApplianceContext);
  if (context === undefined) {
    throw new Error('useAppliances must be used within an ApplianceProvider');
  }
  return context;
}