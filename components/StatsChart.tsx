import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { getIconColor } from '@/constants/iconColors';
import { affirmations } from '@/constants/affirmations';
import { useAppStore } from '@/store/useAppStore';
import { Heart, Sparkles, Coins, Trophy, Shield, Flower, Leaf, Feather, Handshake, Zap } from 'lucide-react-native';
import { translations } from '@/constants/translations';

type StatsChartProps = {
  period: 'daily' | 'monthly' | 'yearly';
};

export const StatsChart: React.FC<StatsChartProps> = ({ period }) => {
  const { stats, settings } = useAppStore();
  const language = settings.language;
  
  // Get current period string
  const getCurrentPeriodString = () => {
    const date = new Date();
    
    switch (period) {
      case 'daily':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      case 'monthly':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      case 'yearly':
        return `${date.getFullYear()}`;
    }
  };
  
  // Get formatted date display
  const getFormattedDateDisplay = () => {
    const date = new Date();
    
    switch (period) {
      case 'daily':
        switch (language) {
          case 'zh':
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          case 'ja':
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          case 'ko':
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
          case 'en':
          default:
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
        }
      case 'monthly':
        switch (language) {
          case 'zh':
            return `${date.getFullYear()}年${date.getMonth() + 1}月`;
          case 'ja':
            return `${date.getFullYear()}年${date.getMonth() + 1}月`;
          case 'ko':
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
          case 'en':
          default:
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long'
            });
        }
      case 'yearly':
        switch (language) {
          case 'zh':
            return `${date.getFullYear()}年`;
          case 'ja':
            return `${date.getFullYear()}年`;
          case 'ko':
            return `${date.getFullYear()}년`;
          case 'en':
          default:
            return `${date.getFullYear()}`;
        }
    }
  };
  
  // Get stats for current period
  const periodString = getCurrentPeriodString();
  const periodStats = stats[period] && stats[period][periodString] ? stats[period][periodString] : [];
  
  // Calculate total count for the period
  const totalCount = periodStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
  
  // Find max count for scaling
  const maxCount = Math.max(...periodStats.map(stat => stat.count || 0), 10);
  
  const renderIcon = (icon: string) => {
    // Get the color for this specific icon
    const iconColor = getIconColor(icon);
    
    const iconProps = { 
      size: 20, 
      color: iconColor,
      strokeWidth: 2
    };
    
    switch (icon) {
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'coins':
        return <Coins {...iconProps} />;
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'flower':
        return <Flower {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'leaf':
        return <Leaf {...iconProps} />;
      case 'feather':
        return <Feather {...iconProps} />;
      case 'handshake':
        return <Handshake {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };
  
  // Get period label based on language and period
  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        switch (language) {
          case 'zh': return '今日累積次數';
          case 'ja': return '今日の累計回数';
          case 'ko': return '오늘 누적 횟수';
          case 'en':
          default: return "Today's Total Count";
        }
      case 'monthly':
        switch (language) {
          case 'zh': return '本月累積次數';
          case 'ja': return '今月の累計回数';
          case 'ko': return '이번 달 누적 횟수';
          case 'en':
          default: return "This Month's Total Count";
        }
      case 'yearly':
        switch (language) {
          case 'zh': return '今年累積次數';
          case 'ja': return '今年の累計回数';
          case 'ko': return '올해 누적 횟수';
          case 'en':
          default: return "This Year's Total Count";
        }
    }
  };
  
  // Function to get a lighter version of the color for specific affirmations
  const getBarColor = (affirmation: any) => {
    const iconColor = getIconColor(affirmation.icon);
    
    // Make colors lighter for all affirmations to improve text visibility
    // Especially for "I am an eternal spirit" (id: 8) and "I'm grateful for everyone" (id: 9)
    if (affirmation.id === 8 || affirmation.id === 9) {
      return `${iconColor}30`; // 30% opacity for better text visibility
    }
    
    // Make other bars slightly lighter too
    return `${iconColor}70`; // 70% opacity for better text visibility
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
        <Text style={styles.dateDisplay}>{getFormattedDateDisplay()}</Text>
        <View style={styles.totalCountContainer}>
          <Text style={styles.totalCountLabel}>
            {language === 'zh' ? '總計' : 
             language === 'ja' ? '合計' : 
             language === 'ko' ? '총계' : 'Total'}:
          </Text>
          <Text style={styles.totalCountValue}>{totalCount}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.chartContainer} showsVerticalScrollIndicator={false}>
        {affirmations.map((affirmation) => {
          const stat = periodStats.find(s => s.id === affirmation.id);
          const count = stat ? stat.count : 0;
          const barWidth = Math.max(count / maxCount * 200, 4);
          const barColor = getBarColor(affirmation);
          
          return (
            <View key={affirmation.id} style={styles.barRow}>
              <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(affirmation.icon)}20` }]}>
                {renderIcon(affirmation.icon)}
              </View>
              
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: barWidth, backgroundColor: barColor }]} />
                <Text style={styles.barLabel}>{affirmation.text[language].substring(0, 10)}...</Text>
              </View>
              
              <Text style={styles.countText}>{count}</Text>
            </View>
          );
        })}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: `${colors.primary}10`,
    padding: 16,
    borderRadius: 12,
  },
  periodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  dateDisplay: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  totalCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCountLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  totalCountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  chartContainer: {
    flex: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  barContainer: {
    flex: 1,
    height: 36,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
    position: 'absolute',
    left: 0,
  },
  barLabel: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    zIndex: 1, // Ensure text is above the bar
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  countText: {
    width: 40,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  }
});