import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, Modal, Share, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import * as FileSystem from 'expo-file-system';
import { triggerSuccessHaptic } from '@/utils/haptics';

export default function StarWishBoxScreen() {
  const router = useRouter();
  const { settings, puzzles, totalPoints } = useAppStore();
  const language = settings.language;
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Check if a puzzle is completed (all 10 pieces unlocked)
  const isPuzzleCompleted = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    return puzzle.pieces.every(piece => piece.unlocked);
  };

  // Check if a puzzle should be visible based on points
  const isPuzzleVisible = (puzzleId: number): boolean => {
    const thresholds = {
      1: 0,
      2: 10000,
      3: 30000,
      4: 70000,
      5: 90000,
      6: 120000,
      7: 140000,
      8: 160000,
      9: 180000
    };
    
    return totalPoints >= thresholds[puzzleId as keyof typeof thresholds];
  };

  // Get card title based on language and puzzle ID
  const getCardTitle = (puzzleId: number): string => {
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

  // Get card image URL based on puzzle ID
  const getCardImageUrl = (puzzleId: number): string => {
    // For now, all cards use the same image as specified in the requirements
    return "https://github.com/user-attachments/assets/511c952d-32f2-4bbb-879b-472e1e8d02d2";
  };

  // Handle card press
  const handleCardPress = (puzzleId: number) => {
    if (isPuzzleCompleted(puzzleId)) {
      triggerSuccessHaptic(settings.vibration).catch(() => {});
      setSelectedCard(puzzleId);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (selectedCard === null) return;
    
    if (Platform.OS === 'web') {
      Alert.alert(
        language === 'zh' ? "網頁版提示" : 
        language === 'en' ? "Web Version Notice" :
        language === 'ja' ? "ウェブ版のお知らせ" :
        "웹 버전 알림",
        
        language === 'zh' ? "在網頁版中無法下載圖片。請長按圖片並選擇「儲存圖片」。" : 
        language === 'en' ? "Cannot download images in web version. Please long-press the image and select 'Save Image'." :
        language === 'ja' ? "ウェブ版では画像をダウンロードできません。画像を長押しして「画像を保存」を選択してください。" :
        "웹 버전에서는 이미지를 다운로드할 수 없습니다. 이미지를 길게 누르고 '이미지 저장'을 선택하세요."
      );
      return;
    }
    
    try {
      // Download image
      const imageUrl = getCardImageUrl(selectedCard);
      const fileUri = FileSystem.documentDirectory + `star-wish-card-${selectedCard}.jpg`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl,
        fileUri,
        {}
      );
      
      const downloadResult = await downloadResumable.downloadAsync();
      
      if (downloadResult && downloadResult.uri) {
        // On native platforms, we would normally save to media library here
        // But since expo-media-library is not installed, we'll just show a success message
        Alert.alert(
          language === 'zh' ? "下載成功" : 
          language === 'en' ? "Download Successful" :
          language === 'ja' ? "ダウンロード成功" :
          "다운로드 성공",
          
          language === 'zh' ? "星願卡片已下載。請到「檔案」應用程式查看。" : 
          language === 'en' ? "Star Wish Card has been downloaded. Please check your Files app." :
          language === 'ja' ? "星の願いカードがダウンロードされました。「ファイル」アプリで確認してください。" :
          "별 소원 카드가 다운로드되었습니다. 파일 앱에서 확인하세요."
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        language === 'zh' ? "下載失敗" : 
        language === 'en' ? "Download Failed" :
        language === 'ja' ? "ダウンロード失敗" :
        "다운로드 실패",
        
        language === 'zh' ? "無法下載星願卡片。請稍後再試。" : 
        language === 'en' ? "Could not download Star Wish Card. Please try again later." :
        language === 'ja' ? "星の願いカードをダウンロードできませんでした。後でもう一度お試しください。" :
        "별 소원 카드를 다운로드할 수 없습니다. 나중에 다시 시도해주세요."
      );
    }
  };

  // Handle share
  const handleShare = async () => {
    if (selectedCard === null) return;
    
    try {
      const imageUrl = getCardImageUrl(selectedCard);
      const title = getCardTitle(selectedCard);
      
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
    <>
      <Stack.Screen 
        options={{ 
          title: language === 'zh' ? "星願寶盒" : 
                 language === 'en' ? "Star Wish Box" :
                 language === 'ja' ? "星の願い宝箱" :
                 "별 소원 보물상자",
          headerRight: () => <LanguageSwitcher />
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: "https://github.com/user-attachments/assets/a7bfefea-7cc5-4a9c-ad6a-fa0472e16f48" }}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>
            {language === 'zh' ? "星願寶盒" : 
             language === 'en' ? "Star Wish Box" :
             language === 'ja' ? "星の願い宝箱" :
             "별 소원 보물상자"}
          </Text>
          <Text style={styles.headerDescription}>
            {language === 'zh' ? "完成拼圖解鎖星願卡片，收集美麗回憶" : 
             language === 'en' ? "Complete puzzles to unlock Star Wish Cards and collect beautiful memories" :
             language === 'ja' ? "パズルを完成させて星の願いカードをアンロックし、美しい思い出を集めましょう" :
             "퍼즐을 완성하여 별 소원 카드를 잠금 해제하고 아름다운 추억을 수집하세요"}
          </Text>
        </View>
        
        <View style={styles.cardsGrid}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map(puzzleId => (
            <Pressable 
              key={`card-${puzzleId}`}
              style={[
                styles.cardContainer,
                !isPuzzleVisible(puzzleId) && styles.hiddenCard
              ]}
              onPress={() => handleCardPress(puzzleId)}
              disabled={!isPuzzleCompleted(puzzleId) || !isPuzzleVisible(puzzleId)}
            >
              <View style={styles.card}>
                <Image 
                  source={{ uri: getCardImageUrl(puzzleId) }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                {(!isPuzzleCompleted(puzzleId) && isPuzzleVisible(puzzleId)) && (
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
              <Text style={styles.cardTitle} numberOfLines={2}>
                {getCardTitle(puzzleId)}
              </Text>
              {isPuzzleCompleted(puzzleId) && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>
                    {language === 'zh' ? "已解鎖" : 
                     language === 'en' ? "Unlocked" :
                     language === 'ja' ? "解除済み" :
                     "잠금 해제됨"}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {language === 'zh' ? "完成拼圖後，星願卡片將永久解鎖。您可以下載作為桌布或分享給朋友！" : 
             language === 'en' ? "After completing a puzzle, the Star Wish Card will be permanently unlocked. You can download it as a wallpaper or share it with friends!" :
             language === 'ja' ? "パズルを完成させると、星の願いカードが永久にアンロックされます。壁紙としてダウンロードしたり、友達とシェアしたりできます！" :
             "퍼즐을 완성하면 별 소원 카드가 영구적으로 잠금 해제됩니다. 배경화면으로 다운로드하거나 친구들과 공유할 수 있습니다!"}
          </Text>
        </View>
      </ScrollView>
      
      {/* Modal for selected card */}
      <Modal
        visible={selectedCard !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCard ? getCardTitle(selectedCard) : ""}</Text>
            
            <Image 
              source={{ uri: selectedCard ? getCardImageUrl(selectedCard) : "" }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            
            <Text style={styles.congratsText}>{getCongratulationText()}</Text>
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleDownload}>
                <Text style={styles.modalButtonText}>{getDownloadText()}</Text>
              </Pressable>
              
              <Pressable style={styles.modalButton} onPress={handleShare}>
                <Text style={styles.modalButtonText}>{getShareText()}</Text>
              </Pressable>
            </View>
            
            <Pressable 
              style={styles.closeButton} 
              onPress={() => setSelectedCard(null)}
            >
              <Text style={styles.closeButtonText}>{getCloseText()}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  headerImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cardContainer: {
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
  hiddenCard: {
    opacity: 0.3,
  },
  card: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    padding: 8,
    textAlign: 'center',
    height: 60,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
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
