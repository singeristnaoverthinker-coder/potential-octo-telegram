export interface Appliance {
  id: string;
  name: string;
  minWattage: number;
  maxWattage: number;
  defaultWattage: number;
  color: string;
  iconName: string;
  isSelected: boolean;
  currentWattage?: number;
  currentHours?: number;
}

export interface ApplianceUsage {
  applianceId: string;
  wattage: number;
  hoursPerDay: number;
  dailyCost: number;
  monthlyCost: number;
}