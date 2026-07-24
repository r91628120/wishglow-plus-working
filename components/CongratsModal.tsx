import React from 'react';
import { StyleSheet, View, Text, Modal, Image, Pressable, Share, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import * as Haptics from 'expo-haptics';

type CongratsModalProps = {
  visible: boolean;
  puzzleId: number | null;
  onClose: () => void;
  onDownload: () => void;
};

export const CongratsModal: React.FC<CongratsModalProps> = ({ 
  visible, 
  puzzleId, 
  onClose, 
  onDownload 
}) => {
  const { settings } = useAppStore();
  const language = settings.language;
  
  // Get card title based on language and puzzle ID
  const getCardTitle = (): string => {
    if (!puzzleId) return "";
    
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
  
  // Get congratulation text based on language
  const getCongratulationText = (): string => {
    switch (language) {
      case 'zh': return "恭喜您! 獲得一張星願卡片";
      case 'en': return "Congratulations! You've received a Star Wish Card";
      case 'ja': return "おめでとうございます！星の願いカードを獲得しました";
      case 'ko': return "축하합니다! 별 소원 카드를 획득했습니다";
      default: return "Congratulations! You've received a Star Wish Card";
    }
  };
  
  // Get download button text based on language
  const getDownloadText = (): string => {
    switch (language) {
      case 'zh': return "下載為桌布";
      case 'en': return "Download as Wallpaper";
      case 'ja': return "壁紙としてダウンロード";
      case 'ko': return "배경화면으로 다운로드";
      default: return "Download as Wallpaper";
    }
  };
  
  // Get share button text based on language
  const getShareText = (): string => {
    switch (language) {
      case 'zh': return "分享";
      case 'en': return "Share";
      case 'ja': return "シェア";
      case 'ko': return "공유";
      default: return "Share";
    }
  };
  
  // Get close button text based on language
  const getCloseText = (): string => {
    switch (language) {
      case 'zh': return "關閉";
      case 'en': return "Close";
      case 'ja': return "閉じる";
      case 'ko': return "닫기";
      default: return "Close";
    }
  };
  
  // Handle share
  const handleShare = async () => {
    if (!puzzleId) return;
    
    try {
      const imageUrl = getCardImageUrl();
      const title = getCardTitle();
      
      // Trigger haptic feedback if available
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      
      await Share.share({
        title: title,
        message: `${title} - ${getCongratulationText()} #WishGlow`,
        url: imageUrl
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{getCardTitle()}</Text>
          
          <Image 
            source={{ uri: getCardImageUrl() }}
            style={styles.modalImage}
            resizeMode="contain"
          />
          
          <Text style={styles.congratsText}>{getCongratulationText()}</Text>
          
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButton} onPress={onDownload}>
              <Text style={styles.modalButtonText}>{getDownloadText()}</Text>
            </Pressable>
            
            <Pressable style={styles.modalButton} onPress={handleShare}>
              <Text style={styles.modalButtonText}>{getShareText()}</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>{getCloseText()}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeButtonText: {
    color: colors.textLight,
  },
});