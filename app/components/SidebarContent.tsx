
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Upload, Search, Edit3, CheckSquare, MessageCircle, Download,
  Zap, Users, Palette, FileText, Shield, Lock
} from 'lucide-react-native';

const SidebarContent: React.FC = () => {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();
  
  // Using the same steps and features as web version
  const howItWorksSteps = [
    { key: 'sidebar.step1_new', icon: Upload },
    { key: 'sidebar.step2_new', icon: Search },
    { key: 'sidebar.step3_new', icon: Edit3 },
    { key: 'sidebar.step4_new', icon: CheckSquare },
    { key: 'sidebar.step5_new', icon: MessageCircle },
    { key: 'sidebar.step6_new', icon: Download },
  ];
  
  const features = [
    { key: 'features.instantAnalysis_new', icon: Zap },
    { key: 'features.designedForIslamicLaw', icon: Shield },
    { key: 'features.multilingual_new', icon: Users },
    { key: 'features.darkMode_new', icon: Palette },
    { key: 'features.exportDocuments', icon: FileText },
    { key: 'features.dataPrivacy_new', icon: Lock },
  ];

  // For now, we'll use a placeholder or you can add the logo files to app/assets/
  const logoSource = theme === 'dark' 
    ? { uri: 'https://via.placeholder.com/120x120/10b981/ffffff?text=Shar%27AI' }
    : { uri: 'https://via.placeholder.com/120x120/10b981/000000?text=Shar%27AI' };

  return (
    <ScrollView 
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Logo and Title */}
      <View style={{ 
        alignItems: 'center', 
        paddingVertical: 16, 
        borderBottomWidth: 1,
        borderBottomColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
        marginBottom: 24
      }}>
        <Image 
          source={logoSource}
          style={{ height: 120, width: 120, marginBottom: 8 }}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Section */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: '#10b981',
          textAlign: 'center',
          marginBottom: 8
        }}>
          {t('sidebar.welcome')}
        </Text>
        <Text style={{
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          lineHeight: 22,
          textAlign: 'center',
          fontSize: 14
        }}>
          {t('sidebar.description_new')}
        </Text>
      </View>

      {/* How It Works */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          marginBottom: 12
        }}>
          {t('sidebar.howTo_new')}
        </Text>
        {howItWorksSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <View key={step.key} style={{
              flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              marginBottom: 12,
              paddingHorizontal: 4
            }}>
              <IconComponent 
                size={20} 
                color="#10b981" 
                style={{ marginTop: 2, marginRight: dir === 'rtl' ? 0 : 12, marginLeft: dir === 'rtl' ? 12 : 0 }}
              />
              <Text style={{
                flex: 1,
                color: theme === 'dark' ? '#d1d5db' : '#4b5563',
                lineHeight: 20,
                fontSize: 14
              }}>
                {t(step.key)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Key Features */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          marginBottom: 12
        }}>
          {t('sidebar.features_new')}
        </Text>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <View key={feature.key} style={{
              flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
              alignItems: 'center',
              marginBottom: 10,
              paddingHorizontal: 4
            }}>
              <IconComponent 
                size={16} 
                color="#10b981" 
                style={{ marginRight: dir === 'rtl' ? 0 : 10, marginLeft: dir === 'rtl' ? 10 : 0 }}
              />
              <Text style={{
                color: theme === 'dark' ? '#d1d5db' : '#4b5563',
                fontSize: 14
              }}>
                {t(feature.key)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default SidebarContent;
