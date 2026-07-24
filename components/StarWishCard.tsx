import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

type StarWishCardProps = {
  puzzleId: number;
  onPress: (puzzleId: number) => void;
  isUnlocked: boolean;
  isVisible: boolean;
};

export const StarWishCard: React.FC<StarWishCardProps> = ({ 
  puzzleId, 
  onPress, 
  isUnlocked, 
  isVisible 
}) => {
  const { settings } = useAppStore();
  const language = settings.language;
  
  // Get card title based on language and puzzle ID
  const getCardTitle = (): string => {
    const titles = {
      zh: {
        1: "露比（Ruby）｜心星瓶的收集者",
        2: "菲拉（Fila）｜星星花園的花語師",
        3: "莫娜（Mona）｜幸福收藏的夢光旅人",
        4: "星語的召喚",
        5: "星語花園的試煉",
        6: "回憶中的幸福微光",
        7: "星光停止的那一天",
        8: "遺失的心語之光",
        9: "光之迴響與星願合奏"
      },
      en: {
        1: "Ruby | Collector of the Heart Star Jar",
        2: "Fila | Florist of the Starry Garden",
        3: "Mona | Dream Light Traveler of Happiness Collection",
        4: "The Call of Star Language",
        5: "The Trial of the Star Garden",
        6: "The Glimmer of Happiness in Memories",
        7: "The Day the Starlight Stopped",
        8: "The Lost Light of Heart Language",
        9: "The Echo of Light and the Star Wish Ensemble"
      },
      ja: {
        1: "ルビー（Ruby）｜心の星の瓶の収集者",
        2: "フィラ（Fila）｜星の庭の花言葉師",
        3: "モナ（Mona）｜幸福収集の夢光旅人",
        4: "星の言葉の呼びかけ",
        5: "星の庭の試練",
        6: "思い出の中の幸せの光",
        7: "星の光が止まった日",
        8: "失われた心の言葉の光",
        9: "光のこだまと星の願いのアンサンブル"
      },
      ko: {
        1: "루비 (Ruby) | 마음별 병의 수집가",
        2: "필라 (Fila) | 별빛 정원의 꽃말사",
        3: "모나 (Mona) | 행복 수집의 꿈빛 여행자",
        4: "별말의 부름",
        5: "별빛 정원의 시련",
        6: "기억 속의 행복한 빛",
        7: "별빛이 멈춘 날",
        8: "잃어버린 마음 언어의 빛",
        9: "빛의 메아리와 별 소원의 앙상블"
      }
    };
    
    return titles[language as keyof typeof titles]?.[puzzleId as keyof typeof titles.zh] || "";
  };
  
  // Get card image URL based on puzzle ID
  const getCardImageUrl = (): string => {
    // For now, all cards use the same image as specified in the requirements
    return "https://github.com/user-attachments/assets/511c952d-32f2-4bbb-879b-472e1e8d02d2";
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Pressable 
      style={[
        styles.container,
        !isUnlocked && styles.lockedContainer
      ]}
      onPress={() => isUnlocked && onPress(puzzleId)}
      disabled={!isUnlocked}
    >
      <View style={styles.card}>
        <Image 
          source={{ uri: getCardImageUrl() }}
          style={styles.image}
          resizeMode="cover"
        />
        {!isUnlocked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedText}>
              {language === 'zh' ? "未解鎖" : 
               language === 'en' ? "Locked" :
               language === 'ja' ? "ロック中" :
               "잠김"}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {getCardTitle()}
      </Text>
      {isUnlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>
            {language === 'zh' ? "已解鎖" : 
             language === 'en' ? "Unlocked" :
             language === 'ja' ? "解除済み" :
             "잠금 해제됨"}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedContainer: {
    opacity: 0.7,
  },
  card: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    padding: 8,
    textAlign: 'center',
    height: 60,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unlockedText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});