import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, Linking, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';

export default function WishStarBoxScreen() {
  const router = useRouter();
  const { settings, totalPoints, puzzles } = useAppStore();
  const language = settings.language;
  
  // Content for each language
  const content = {
    zh: {
      title: '星願寶盒',
      description: '收集完成的星願卡片將會在這裡展示。每張卡片都代表著一個願望的實現和一段故事的完成。',
      cardTitle: '星願卡片',
      backButton: '返回',
      lockedMessage: '需要更多點數解鎖',
      downloadHint: '長按圖片可下載作為桌布',
      completeMessage: '完成拼圖以解鎖圖片',
      cards: [
        { id: 1, name: '露比（Ruby）｜心星瓶的收集者', requiredPoints: 0, imageUrl: 'https://github.com/user-attachments/assets/a782e7dd-9f42-45e9-8019-2ff0d172061d' },
        { id: 2, name: '菲拉（Fila）｜星星花園的花語師', requiredPoints: 10000, imageUrl: 'https://github.com/user-attachments/assets/d7c4053f-64be-44ff-a9f4-bf2e9498e2ed' },
        { id: 3, name: '莫娜（Mona）｜幸福收藏的夢光旅人', requiredPoints: 50000, imageUrl: 'https://github.com/user-attachments/assets/bfd328cd-3f2c-4e5a-a843-9e34e974a770' },
        { id: 4, name: '星語的召喚', requiredPoints: 70000, imageUrl: 'https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437' },
        { id: 5, name: '星語花園的試煉', requiredPoints: 90000, imageUrl: 'https://github.com/user-attachments/assets/1218fd57-086d-47c5-b392-781733e77afd' },
        { id: 6, name: '回憶中的幸福微光', requiredPoints: 120000, imageUrl: 'https://github.com/user-attachments/assets/2cfa3079-414e-480e-be0b-8dcd5dbcc210' },
        { id: 7, name: '星光停止的那一天', requiredPoints: 140000, imageUrl: 'https://github.com/user-attachments/assets/c18a5485-3a1e-48f2-ae79-5451fe86605c' },
        { id: 8, name: '遺失的心語之光', requiredPoints: 160000, imageUrl: 'https://github.com/user-attachments/assets/ca4a5e68-c266-4fac-bbed-a249dcc020bd' },
        { id: 9, name: '光之迴響與星願合奏', requiredPoints: 180000, imageUrl: 'https://github.com/user-attachments/assets/011b1872-56ff-4788-bb97-3c6e678c37b9' }
      ]
    },
    en: {
      title: 'Wish Star Box',
      description: 'Completed wish star cards will be displayed here. Each card represents the fulfillment of a wish and the completion of a story.',
      cardTitle: 'Wish Star Card',
      backButton: 'Back',
      lockedMessage: 'Need more points to unlock',
      downloadHint: 'Long press image to download as wallpaper',
      completeMessage: 'Complete puzzle to unlock image',
      cards: [
        { id: 1, name: 'Ruby | Collector of the Heart Star Jar', requiredPoints: 0, imageUrl: 'https://github.com/user-attachments/assets/a782e7dd-9f42-45e9-8019-2ff0d172061d' },
        { id: 2, name: 'Fila | Florist of the Starry Garden', requiredPoints: 10000, imageUrl: 'https://github.com/user-attachments/assets/d7c4053f-64be-44ff-a9f4-bf2e9498e2ed' },
        { id: 3, name: 'Mona | Dream Light Traveler of Happiness Collection', requiredPoints: 50000, imageUrl: 'https://github.com/user-attachments/assets/bfd328cd-3f2c-4e5a-a843-9e34e974a770' },
        { id: 4, name: 'The Call of Star Language', requiredPoints: 70000, imageUrl: 'https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437' },
        { id: 5, name: 'The Trial of the Star Garden', requiredPoints: 90000, imageUrl: 'https://github.com/user-attachments/assets/1218fd57-086d-47c5-b392-781733e77afd' },
        { id: 6, name: 'The Glimmer of Happiness in Memories', requiredPoints: 120000, imageUrl: 'https://github.com/user-attachments/assets/2cfa3079-414e-480e-be0b-8dcd5dbcc210' },
        { id: 7, name: 'The Day the Starlight Stopped', requiredPoints: 140000, imageUrl: 'https://github.com/user-attachments/assets/c18a5485-3a1e-48f2-ae79-5451fe86605c' },
        { id: 8, name: 'The Lost Light of Heart Language', requiredPoints: 160000, imageUrl: 'https://github.com/user-attachments/assets/ca4a5e68-c266-4fac-bbed-a249dcc020bd' },
        { id: 9, name: 'The Echo of Light and the Star Wish Ensemble', requiredPoints: 180000, imageUrl: 'https://github.com/user-attachments/assets/011b1872-56ff-4788-bb97-3c6e678c37b9' }
      ]
    },
    ja: {
      title: '星の願い宝箱',
      description: '完成した星の願いカードがここに表示されます。各カードは願いの成就と物語の完成を表しています。',
      cardTitle: '星の願いカード',
      backButton: '戻る',
      lockedMessage: 'ロック解除にはポイントが必要です',
      downloadHint: '画像を長押しして壁紙としてダウンロード',
      completeMessage: 'パズルを完成させて画像を解除',
      cards: [
        { id: 1, name: 'ルビー（Ruby）｜心の星の瓶の収集者', requiredPoints: 0, imageUrl: 'https://github.com/user-attachments/assets/a782e7dd-9f42-45e9-8019-2ff0d172061d' },
        { id: 2, name: 'フィラ（Fila）｜星の庭の花言葉師', requiredPoints: 10000, imageUrl: 'https://github.com/user-attachments/assets/d7c4053f-64be-44ff-a9f4-bf2e9498e2ed' },
        { id: 3, name: 'モナ（Mona）｜幸福収集の夢光旅人', requiredPoints: 50000, imageUrl: 'https://github.com/user-attachments/assets/bfd328cd-3f2c-4e5a-a843-9e34e974a770' },
        { id: 4, name: '星の言葉の呼びかけ', requiredPoints: 70000, imageUrl: 'https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437' },
        { id: 5, name: '星の庭の試練', requiredPoints: 90000, imageUrl: 'https://github.com/user-attachments/assets/1218fd57-086d-47c5-b392-781733e77afd' },
        { id: 6, name: '思い出の中の幸せの光', requiredPoints: 120000, imageUrl: 'https://github.com/user-attachments/assets/2cfa3079-414e-480e-be0b-8dcd5dbcc210' },
        { id: 7, name: '星の光が止まった日', requiredPoints: 140000, imageUrl: 'https://github.com/user-attachments/assets/c18a5485-3a1e-48f2-ae79-5451fe86605c' },
        { id: 8, name: '失われた心の言葉の光', requiredPoints: 160000, imageUrl: 'https://github.com/user-attachments/assets/ca4a5e68-c266-4fac-bbed-a249dcc020bd' },
        { id: 9, name: '光のこだまと星の願いのアンサンブル', requiredPoints: 180000, imageUrl: 'https://github.com/user-attachments/assets/011b1872-56ff-4788-bb97-3c6e678c37b9' }
      ]
    },
    ko: {
      title: '별 소원 상자',
      description: '완성된 별 소원 카드가 여기에 표시됩니다. 각 카드는 소원의 성취와 이야기의 완성을 나타냅니다.',
      cardTitle: '별 소원 카드',
      backButton: '뒤로',
      lockedMessage: '잠금 해제에 더 많은 포인트가 필요합니다',
      downloadHint: '이미지를 길게 눌러 배경화면으로 다운로드',
      completeMessage: '퍼즐을 완성하여 이미지 잠금 해제',
      cards: [
        { id: 1, name: '루비 (Ruby) | 마음별 병의 수집가', requiredPoints: 0, imageUrl: 'https://github.com/user-attachments/assets/a782e7dd-9f42-45e9-8019-2ff0d172061d' },
        { id: 2, name: '필라 (Fila) | 별빛 정원의 꽃말사', requiredPoints: 10000, imageUrl: 'https://github.com/user-attachments/assets/d7c4053f-64be-44ff-a9f4-bf2e9498e2ed' },
        { id: 3, name: '모나 (Mona) | 행복 수집의 꿈빛 여행자', requiredPoints: 50000, imageUrl: 'https://github.com/user-attachments/assets/bfd328cd-3f2c-4e5a-a843-9e34e974a770' },
        { id: 4, name: '별말의 부름', requiredPoints: 70000, imageUrl: 'https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437' },
        { id: 5, name: '별빛 정원의 시련', requiredPoints: 90000, imageUrl: 'https://github.com/user-attachments/assets/1218fd57-086d-47c5-b392-781733e77afd' },
        { id: 6, name: '기억 속의 행복한 빛', requiredPoints: 120000, imageUrl: 'https://github.com/user-attachments/assets/2cfa3079-414e-480e-be0b-8dcd5dbcc210' },
        { id: 7, name: '별빛이 멈춘 날', requiredPoints: 140000, imageUrl: 'https://github.com/user-attachments/assets/c18a5485-3a1e-48f2-ae79-5451fe86605c' },
        { id: 8, name: '잃어버린 마음 언어의 빛', requiredPoints: 160000, imageUrl: 'https://github.com/user-attachments/assets/ca4a5e68-c266-4fac-bbed-a249dcc020bd' },
        { id: 9, name: '빛의 메아리와 별 소원의 앙상블', requiredPoints: 180000, imageUrl: 'https://github.com/user-attachments/assets/011b1872-56ff-4788-bb97-3c6e678c37b9' }
      ]
    }
  };
  
  const currentContent = content[language] || content.en;
  
  // Check if a puzzle has been started (at least one piece unlocked)
  const isPuzzleStarted = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    
    // A puzzle is considered started if at least one piece is unlocked
    return puzzle.pieces.some(piece => piece.unlocked);
  };
  
  // Check if a puzzle is completely unlocked (all 10 pieces)
  const isPuzzleComplete = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    return puzzle.pieces.every(piece => piece.unlocked);
  };
  
  // Calculate completion percentage for a puzzle
  const getPuzzleCompletionPercentage = (puzzleId: number): number => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return 0;
    
    const unlockedPieces = puzzle.pieces.filter(piece => piece.unlocked).length;
    return (unlockedPieces / puzzle.pieces.length) * 100;
  };
  
  // Handle long press on image to "download" as wallpaper
  const handleImageLongPress = (imageUrl: string) => {
    if (Platform.OS === 'web') {
      // For web, open the image in a new tab
      window.open(imageUrl, '_blank');
    } else {
      // For mobile, try to open the URL
      Linking.openURL(imageUrl).catch(err => {
        console.error('Error opening URL:', err);
      });
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: currentContent.title,
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentContent.title}</Text>
          <Text style={styles.description}>{currentContent.description}</Text>
          <Text style={styles.downloadHint}>{currentContent.downloadHint}</Text>
        </View>
        
        <View style={styles.cardsContainer}>
          {currentContent.cards.map((card) => {
            const started = isPuzzleStarted(card.id);
            const completed = isPuzzleComplete(card.id);
            const completionPercentage = getPuzzleCompletionPercentage(card.id);
            
            return (
              <View 
                key={card.id} 
                style={[
                  styles.card,
                  !started && styles.lockedCard
                ]}
              >
                {/* Only show the image if the puzzle is completely unlocked */}
                {completed ? (
                  <Pressable
                    onLongPress={() => handleImageLongPress(card.imageUrl)}
                    delayLongPress={500}
                  >
                    <Image 
                      source={{ uri: card.imageUrl }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : started ? (
                  <View style={styles.inProgressContainer}>
                    <Text style={styles.inProgressText}>
                      {Math.round(completionPercentage)}%
                    </Text>
                    <Text style={styles.inProgressSubtext}>
                      {currentContent.completeMessage}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.lockedImageContainer}>
                    <Text style={styles.lockedImageText}>
                      {language === 'zh' ? '解鎖拼圖以查看' : 
                       language === 'en' ? 'Unlock puzzle to view' :
                       language === 'ja' ? 'パズルを解除して表示' :
                       '퍼즐을 해제하여 보기'}
                    </Text>
                  </View>
                )}
                
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{currentContent.cardTitle}</Text>
                  <Text style={styles.cardName}>{card.name}</Text>
                  
                  {!started && (
                    <View style={styles.lockedOverlay}>
                      <Text style={styles.lockedText}>
                        {currentContent.lockedMessage}
                      </Text>
                    </View>
                  )}
                  
                  {started && !completed && (
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${completionPercentage}%` }
                        ]} 
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{currentContent.backButton}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  downloadHint: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockedCard: {
    opacity: 0.7,
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: `${colors.primary}20`,
  },
  inProgressContainer: {
    width: '100%',
    height: 150,
    backgroundColor: `${colors.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inProgressText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inProgressSubtext: {
    color: colors.textLight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  lockedImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: `${colors.textLight}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedImageText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
  cardContent: {
    padding: 12,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
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
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  lockedText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  progressBar: {
    marginTop: 8,
    height: 4,
    backgroundColor: `${colors.textLight}30`,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  backButton: {
    marginVertical: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});