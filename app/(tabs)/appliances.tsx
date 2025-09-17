import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Refrigerator, Wind, Shirt, Monitor, Fan, Droplets, Microwave, Plus, X, Check, Trash2, Zap, Lightbulb, Coffee, Tv, Cpu, Smartphone, Laptop, Gamepad2, Speaker, Router, Printer, Camera, Headphones, Battery, Plug, Chrome as Home, Car, Flame, Snowflake, Sun, Moon, Clock, Power, Volume2, Wifi, Bluetooth, Radio, Music, Video, Image, FileText, Calculator, Thermometer, Activity, Settings, PenTool as Tool, Wrench, Hammer, Scissors, PaintBucket, Brush, Palette, Eye, Heart, Star, Shield, Lock, Key, Bell, Mail, Phone, MessageCircle, Send, Download, Upload, Share, Copy, Save, Folder, File, Search, Filter, Import as Sort, Grid2x2 as Grid, List, Map, Navigation, Compass, Globe, Cloud, CloudRain, CloudSnow, Umbrella, TreePine, Flower, Leaf, Apple, Coffee as CoffeeIcon, Wine, Pizza, Utensils, ChefHat, IceCreamBowl as IceCream, Cake, Cookie, Candy, Gift, ShoppingCart, CreditCard, Wallet, Coins, DollarSign, TrendingUp, TrendingDown, ChartBar as BarChart, ChartPie as PieChart, ChartLine as LineChart, Target, Award, Trophy, Medal, Flag, Bookmark, Tag, Hash, AtSign, Percent, Plus as PlusIcon, Minus, Equal, Divide, X as XIcon, Check as CheckIcon, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info, CircleHelp as HelpCircle, FileQuestion as Question, Radiation as Exclamation } from 'lucide-react-native';
import { useAppliances } from '@/context/ApplianceContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

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
  smartphone: Smartphone,
  laptop: Laptop,
  gamepad2: Gamepad2,
  speaker: Speaker,
  router: Router,
  printer: Printer,
  camera: Camera,
  headphones: Headphones,
  battery: Battery,
  plug: Plug,
  home: Home,
  car: Car,
  flame: Flame,
  snowflake: Snowflake,
  sun: Sun,
  moon: Moon,
  clock: Clock,
  power: Power,
  volume2: Volume2,
  wifi: Wifi,
  bluetooth: Bluetooth,
  radio: Radio,
  music: Music,
  video: Video,
  thermometer: Thermometer,
  activity: Activity,
  settings: Settings,
  tool: Tool,
  wrench: Wrench,
  hammer: Hammer,
  scissors: Scissors,
  heart: Heart,
  star: Star,
  shield: Shield,
  bell: Bell,
  phone: Phone,
  search: Search,
  globe: Globe,
  cloud: Cloud,
  treepine: TreePine,
  leaf: Leaf,
  apple: Apple,
  wine: Wine,
  pizza: Pizza,
  utensils: Utensils,
  chefhat: ChefHat,
  icecream: IceCream,
  cake: Cake,
  gift: Gift,
  shoppingcart: ShoppingCart,
  creditcard: CreditCard,
  wallet: Wallet,
  coins: Coins,
  dollarsign: DollarSign,
  trendup: TrendingUp,
  trenddown: TrendingDown,
  barchart: BarChart,
  piechart: PieChart,
  linechart: LineChart,
  target: Target,
  award: Award,
  trophy: Trophy,
  medal: Medal,
  flag: Flag,
  bookmark: Bookmark,
  tag: Tag,
  hash: Hash,
  atsign: AtSign,
  percent: Percent,
  plusicon: PlusIcon,
  minus: Minus,
  equal: Equal,
  divide: Divide,
  xicon: XIcon,
  checkicon: CheckIcon,
  alerttriangle: AlertTriangle,
  alertcircle: AlertCircle,
  info: Info,
  helpcircle: HelpCircle,
  question: Question,
  exclamation: Exclamation,
};

const availableIcons = [
  { name: 'refrigerator', component: Refrigerator, label: 'Refrigerator' },
  { name: 'wind', component: Wind, label: 'Air Conditioner' },
  { name: 'shirt', component: Shirt, label: 'Washing Machine' },
  { name: 'monitor', component: Monitor, label: 'Television' },
  { name: 'fan', component: Fan, label: 'Fan' },
  { name: 'droplets', component: Droplets, label: 'Water Heater' },
  { name: 'microwave', component: Microwave, label: 'Microwave' },
  { name: 'zap', component: Zap, label: 'Generic Appliance' },
  { name: 'lightbulb', component: Lightbulb, label: 'Lighting' },
  { name: 'coffee', component: Coffee, label: 'Coffee Maker' },
  { name: 'tv', component: Tv, label: 'Entertainment' },
  { name: 'cpu', component: Cpu, label: 'Computer/Electronics' },
  { name: 'smartphone', component: Smartphone, label: 'Smartphone' },
  { name: 'laptop', component: Laptop, label: 'Laptop' },
  { name: 'gamepad2', component: Gamepad2, label: 'Gaming Console' },
  { name: 'speaker', component: Speaker, label: 'Speaker' },
  { name: 'router', component: Router, label: 'Router/Modem' },
  { name: 'printer', component: Printer, label: 'Printer' },
  { name: 'camera', component: Camera, label: 'Camera' },
  { name: 'headphones', component: Headphones, label: 'Headphones' },
  { name: 'battery', component: Battery, label: 'Battery/UPS' },
  { name: 'plug', component: Plug, label: 'Power Adapter' },
  { name: 'home', component: Home, label: 'Home Appliance' },
  { name: 'car', component: Car, label: 'Vehicle Charger' },
  { name: 'flame', component: Flame, label: 'Heater/Stove' },
  { name: 'snowflake', component: Snowflake, label: 'Cooler/Freezer' },
  { name: 'sun', component: Sun, label: 'Solar Panel' },
  { name: 'moon', component: Moon, label: 'Night Light' },
  { name: 'clock', component: Clock, label: 'Timer/Clock' },
  { name: 'power', component: Power, label: 'Power Tool' },
  { name: 'volume2', component: Volume2, label: 'Audio System' },
  { name: 'wifi', component: Wifi, label: 'WiFi Device' },
  { name: 'bluetooth', component: Bluetooth, label: 'Bluetooth Device' },
  { name: 'radio', component: Radio, label: 'Radio' },
  { name: 'music', component: Music, label: 'Music Player' },
  { name: 'video', component: Video, label: 'Video Player' },
  { name: 'thermometer', component: Thermometer, label: 'Thermostat' },
  { name: 'activity', component: Activity, label: 'Fitness Equipment' },
  { name: 'settings', component: Settings, label: 'Control Panel' },
  { name: 'tool', component: Tool, label: 'Workshop Tool' },
  { name: 'wrench', component: Wrench, label: 'Maintenance Tool' },
  { name: 'hammer', component: Hammer, label: 'Construction Tool' },
  { name: 'scissors', component: Scissors, label: 'Cutting Tool' },
  { name: 'heart', component: Heart, label: 'Health Device' },
  { name: 'star', component: Star, label: 'Premium Device' },
  { name: 'shield', component: Shield, label: 'Security System' },
  { name: 'bell', component: Bell, label: 'Alarm/Notification' },
  { name: 'phone', component: Phone, label: 'Phone/Intercom' },
  { name: 'search', component: Search, label: 'Scanner/Detector' },
  { name: 'globe', component: Globe, label: 'Internet Device' },
  { name: 'cloud', component: Cloud, label: 'Cloud Device' },
  { name: 'treepine', component: TreePine, label: 'Garden Equipment' },
  { name: 'leaf', component: Leaf, label: 'Eco Device' },
  { name: 'apple', component: Apple, label: 'Food Processor' },
  { name: 'wine', component: Wine, label: 'Wine Cooler' },
  { name: 'pizza', component: Pizza, label: 'Pizza Oven' },
  { name: 'utensils', component: Utensils, label: 'Kitchen Utensil' },
  { name: 'chefhat', component: ChefHat, label: 'Cooking Equipment' },
  { name: 'icecream', component: IceCream, label: 'Ice Cream Maker' },
  { name: 'cake', component: Cake, label: 'Baking Equipment' },
  { name: 'gift', component: Gift, label: 'Special Appliance' },
  { name: 'shoppingcart', component: ShoppingCart, label: 'Commercial Equipment' },
  { name: 'creditcard', component: CreditCard, label: 'Payment Terminal' },
  { name: 'wallet', component: Wallet, label: 'Personal Device' },
  { name: 'coins', component: Coins, label: 'Coin Counter' },
  { name: 'dollarsign', component: DollarSign, label: 'Business Equipment' },
  { name: 'trendup', component: TrendingUp, label: 'Performance Monitor' },
  { name: 'trenddown', component: TrendingDown, label: 'Energy Saver' },
  { name: 'barchart', component: BarChart, label: 'Data Display' },
  { name: 'piechart', component: PieChart, label: 'Analytics Device' },
  { name: 'linechart', component: LineChart, label: 'Monitoring System' },
  { name: 'target', component: Target, label: 'Precision Tool' },
  { name: 'award', component: Award, label: 'Award Device' },
  { name: 'trophy', component: Trophy, label: 'Competition Equipment' },
  { name: 'medal', component: Medal, label: 'Achievement Device' },
  { name: 'flag', component: Flag, label: 'Signal Device' },
  { name: 'bookmark', component: Bookmark, label: 'Reference Tool' },
  { name: 'tag', component: Tag, label: 'Labeling Device' },
  { name: 'hash', component: Hash, label: 'Coding Device' },
  { name: 'atsign', component: AtSign, label: 'Communication Device' },
  { name: 'percent', component: Percent, label: 'Calculator' },
  { name: 'plusicon', component: PlusIcon, label: 'Addition Tool' },
  { name: 'minus', component: Minus, label: 'Subtraction Tool' },
  { name: 'equal', component: Equal, label: 'Comparison Tool' },
  { name: 'divide', component: Divide, label: 'Division Tool' },
  { name: 'xicon', component: XIcon, label: 'Multiplication Tool' },
  { name: 'checkicon', component: CheckIcon, label: 'Verification Device' },
  { name: 'alerttriangle', component: AlertTriangle, label: 'Warning System' },
  { name: 'alertcircle', component: AlertCircle, label: 'Alert Device' },
  { name: 'info', component: Info, label: 'Information Display' },
  { name: 'helpcircle', component: HelpCircle, label: 'Help System' },
  { name: 'question', component: Question, label: 'Query Device' },
  { name: 'exclamation', component: Exclamation, label: 'Notification System' },
];

const availableColors = [
  '#2563EB', '#06B6D4', '#10B981', '#8B5CF6', 
  '#EF4444', '#F59E0B', '#EC4899', '#14B8A6',
  '#8B5A2B', '#6366F1', '#DC2626', '#059669',
];

export default function AppliancesScreen() {
  const { 
    appliances, 
    toggleApplianceSelection, 
    addCustomAppliance, 
    removeCustomAppliance 
  } = useAppliances();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppliance, setNewAppliance] = useState({
    name: '',
    minWattage: '50',
    maxWattage: '1000',
    defaultWattage: '100',
    color: '#2563EB',
    iconName: 'zap',
  });

  const scaleValue = useSharedValue(1);
  const modalOpacity = useSharedValue(0);

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scaleValue.value) }],
    };
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(modalOpacity.value, { duration: 200 }),
    };
  });

  const handleAddAppliance = () => {
    if (!newAppliance.name.trim()) {
      Alert.alert('Error', 'Please enter an appliance name');
      return;
    }

    const minWattage = parseInt(newAppliance.minWattage);
    const maxWattage = parseInt(newAppliance.maxWattage);
    const defaultWattage = parseInt(newAppliance.defaultWattage);

    if (isNaN(minWattage) || isNaN(maxWattage) || isNaN(defaultWattage)) {
      Alert.alert('Error', 'Please enter valid numbers for wattage values');
      return;
    }

    if (minWattage >= maxWattage) {
      Alert.alert('Error', 'Maximum wattage must be greater than minimum wattage');
      return;
    }

    if (defaultWattage < minWattage || defaultWattage > maxWattage) {
      Alert.alert('Error', 'Default wattage must be between minimum and maximum values');
      return;
    }

    addCustomAppliance({
      name: newAppliance.name,
      minWattage,
      maxWattage,
      defaultWattage,
      color: newAppliance.color,
      iconName: newAppliance.iconName,
    });

    setNewAppliance({
      name: '',
      minWattage: '50',
      maxWattage: '1000',
      defaultWattage: '100',
      color: '#2563EB',
      iconName: 'zap',
    });

    setShowAddModal(false);
    modalOpacity.value = 0;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleToggleSelection = (applianceId: string) => {
    toggleApplianceSelection(applianceId);
    scaleValue.value = 0.95;
    setTimeout(() => {
      scaleValue.value = 1;
    }, 100);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const openModal = () => {
    setShowAddModal(true);
    modalOpacity.value = 1;
  };

  const closeModal = () => {
    setShowAddModal(false);
    modalOpacity.value = 0;
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent || Zap;
  };

  const isCustomAppliance = (applianceId: string) => {
    return applianceId.startsWith('custom-');
  };

  const handleRemoveAppliance = (applianceId: string, applianceName: string) => {
    Alert.alert(
      'Remove Appliance',
      `Are you sure you want to remove ${applianceName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            removeCustomAppliance(applianceId);
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Appliances</Text>
        <Text style={styles.subtitle}>Choose appliances to track and add custom ones</Text>
      </View>

      <ScrollView style={styles.appliancesList} showsVerticalScrollIndicator={false}>
        {appliances.map((appliance) => {
          const IconComponent = getIconComponent(appliance.iconName);
          
          return (
            <Animated.View key={appliance.id} style={animatedFabStyle}>
              <TouchableOpacity
                style={[
                  styles.applianceCard,
                  appliance.isSelected && { 
                    borderColor: appliance.color,
                    borderWidth: 2,
                    backgroundColor: appliance.color + '10',
                  }
                ]}
                onPress={() => handleToggleSelection(appliance.id)}
                activeOpacity={0.7}
              >
                <View style={styles.applianceContent}>
                  <View style={[styles.iconContainer, { backgroundColor: appliance.color + '20' }]}>
                    <IconComponent size={32} color={appliance.color} />
                  </View>
                  
                  <View style={styles.applianceInfo}>
                    <Text style={styles.applianceName}>{appliance.name}</Text>
                    <Text style={styles.applianceWattage}>
                      {appliance.minWattage}W - {appliance.maxWattage}W
                    </Text>
                    <Text style={styles.applianceDefault}>
                      Default: {appliance.defaultWattage}W
                    </Text>
                  </View>

                  <View style={styles.actionContainer}>
                    {appliance.isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: appliance.color }]}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                    {isCustomAppliance(appliance.id) && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleRemoveAppliance(appliance.id, appliance.name);
                        }}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={styles.addNewSection}>
          <Text style={styles.addNewTitle}>Add Custom Appliance</Text>
          <TouchableOpacity
            style={styles.addNewCard}
            onPress={openModal}
            activeOpacity={0.7}
          >
            <View style={styles.addNewContent}>
              <View style={styles.addNewIcon}>
                <Plus size={32} color="#6B7280" />
              </View>
              <View style={styles.addNewText}>
                <Text style={styles.addNewLabel}>Add New Appliance</Text>
                <Text style={styles.addNewSubtitle}>Create a custom calculator</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, animatedModalStyle]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Appliance</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Appliance Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newAppliance.name}
                  onChangeText={(text) => setNewAppliance(prev => ({ ...prev, name: text }))}
                  placeholder="e.g., Rice Cooker, Desktop Computer"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Min Watts</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAppliance.minWattage}
                    onChangeText={(text) => setNewAppliance(prev => ({ ...prev, minWattage: text }))}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Max Watts</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAppliance.maxWattage}
                    onChangeText={(text) => setNewAppliance(prev => ({ ...prev, maxWattage: text }))}
                    keyboardType="numeric"
                    placeholder="1000"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Default Wattage</Text>
                <TextInput
                  style={styles.textInput}
                  value={newAppliance.defaultWattage}
                  onChangeText={(text) => setNewAppliance(prev => ({ ...prev, defaultWattage: text }))}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Choose Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
                  {availableIcons.map((icon) => {
                    const IconComponent = icon.component;
                    const isSelected = newAppliance.iconName === icon.name;
                    
                    return (
                      <TouchableOpacity
                        key={icon.name}
                        style={[
                          styles.iconOption,
                          isSelected && { 
                            backgroundColor: newAppliance.color,
                            borderColor: newAppliance.color,
                          }
                        ]}
                        onPress={() => setNewAppliance(prev => ({ ...prev, iconName: icon.name }))}
                      >
                        <IconComponent 
                          size={20} 
                          color={isSelected ? '#FFFFFF' : '#6B7280'} 
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <Text style={styles.helperText}>Selected: {availableIcons.find(i => i.name === newAppliance.iconName)?.label}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Choose Color</Text>
                <View style={styles.colorGrid}>
                  {availableColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newAppliance.color === color && styles.selectedColor,
                      ]}
                      onPress={() => setNewAppliance(prev => ({ ...prev, color }))}
                    >
                      {newAppliance.color === color && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Preview</Text>
                <View style={[styles.previewCard, { borderColor: newAppliance.color }]}>
                  <View style={[styles.previewIcon, { backgroundColor: newAppliance.color + '20' }]}>
                    {React.createElement(iconMap[newAppliance.iconName], { 
                      size: 24, 
                      color: newAppliance.color 
                    })}
                  </View>
                  <Text style={styles.previewName}>{newAppliance.name || 'New Appliance'}</Text>
                  <Text style={styles.previewWattage}>
                    {newAppliance.minWattage}W - {newAppliance.maxWattage}W
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: newAppliance.color }]}
                onPress={handleAddAppliance}
              >
                <Text style={styles.addButtonText}>Add Appliance</Text>
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
    paddingTop: Math.max(20, screenHeight * 0.02),
    paddingBottom: Math.max(16, screenHeight * 0.02),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    alignItems: 'center',
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
  appliancesList: {
    flex: 1,
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  applianceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  applianceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: Math.min(60, screenWidth * 0.15),
    height: Math.min(60, screenWidth * 0.15),
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  applianceInfo: {
    flex: 1,
  },
  applianceName: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  applianceWattage: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  applianceDefault: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginTop: 8,
  },
  addNewSection: {
    marginTop: 24,
    marginBottom: 100,
  },
  addNewTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  addNewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addNewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addNewIcon: {
    width: Math.min(60, screenWidth * 0.15),
    height: Math.min(60, screenWidth * 0.15),
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addNewText: {
    flex: 1,
  },
  addNewLabel: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  addNewSubtitle: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Math.max(16, screenWidth * 0.04),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: Math.min(400, screenWidth * 0.9),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.max(16, screenWidth * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: Math.min(20, screenWidth * 0.05),
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
  formContainer: {
    padding: Math.max(16, screenWidth * 0.04),
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: Math.max(10, screenWidth * 0.025),
    fontSize: Math.min(16, screenWidth * 0.04),
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  iconSelector: {
    marginTop: 8,
    marginBottom: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  helperText: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#6B7280',
    fontStyle: 'italic',
  },
  previewSection: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: Math.max(12, screenWidth * 0.03),
    borderWidth: 2,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewName: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  previewWattage: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    padding: Math.max(16, screenWidth * 0.04),
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
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#6B7280',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});