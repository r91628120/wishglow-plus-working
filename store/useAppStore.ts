import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLanguage } from '@/constants/translations';
import { StatsData, UserSettings, Puzzle } from '@/types';
import { affirmations } from '@/constants/affirmations';

// Daily points limit constant - defined once at the top level
const DAILY_POINTS_LIMIT = 3000;

interface AppState {
  // User settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Affirmation counts
  todayCounts: Record<number, number>;
  incrementCount: (id: number, amount?: number) => void;
  
  // Stats
  stats: StatsData;
  
  // Game data
  totalPoints: number;
  dailyPoints: number;
  carryOverPoints: number; // Points carried over from previous day
  lastPointsDate: string;
  lastResetTimestamp: number; // New field to track the exact timestamp of the last reset
  puzzles: Puzzle[];
  unlockPuzzlePiece: (puzzleId: number, pieceId: number) => void;
  
  // Selected affirmation
  selectedAffirmationId: number | null;
  setSelectedAffirmationId: (id: number | null) => void;
}

// Get today's date in YYYY-MM-DD format based on local timezone
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current month in YYYY-MM format
const getCurrentMonthString = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Get current year in YYYY format
const getCurrentYearString = () => {
  return `${new Date().getFullYear()}`;
};

// Check if it's a new day (past midnight) compared to the last reset timestamp
const isPastMidnight = (lastResetTimestamp: number): boolean => {
  if (!lastResetTimestamp) return true;
  
  const now = new Date();
  const lastReset = new Date(lastResetTimestamp);
  
  // Check if the current date is different from the last reset date
  // This specifically checks if we've crossed midnight in the local timezone
  return (
    now.getFullYear() !== lastReset.getFullYear() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getDate() !== lastReset.getDate()
  );
};

// Get the timestamp for the next midnight (00:00) in local time
const getNextMidnightTimestamp = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
};

// Initialize stats for today if they don't exist
const initializeTodayStats = (): StatsData => {
  const today = getTodayString();
  const currentMonth = getCurrentMonthString();
  const currentYear = getCurrentYearString();
  
  const newStats: StatsData = {
    daily: {},
    monthly: {},
    yearly: {}
  };
  
  newStats.daily[today] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
  newStats.monthly[currentMonth] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
  newStats.yearly[currentYear] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
  
  return newStats;
};

// Initialize puzzles
const initializePuzzles = (): Puzzle[] => {
  return [
    {
      id: 1,
      name: {
        zh: "露比（Ruby）｜心星瓶的收集者",
        en: "Ruby | Collector of the Heart Star Jar",
        ja: "ルビー（Ruby）｜心の星の瓶の収集者",
        ko: "루비 (Ruby) | 마음별 병의 수집가"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 10000,
      reward: "許願時光的新星瓶",
      imageUrl: "https://github.com/user-attachments/assets/511c952d-32f2-4bbb-879b-472e1e8d02d2"
    },
    {
      id: 2,
      name: {
        zh: "菲拉（Fila）｜星星花園的花語師",
        en: "Fila | Florist of the Starry Garden",
        ja: "フィラ（Fila）｜星の庭の花言葉師",
        ko: "필라 (Fila) | 별빛 정원의 꽃말사"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 30000,
      reward: "咕溜咕溜星星花園",
      imageUrl: "https://github.com/user-attachments/assets/299eee8a-ab98-4a27-8326-440c8e76ea11"
    },
    {
      id: 3,
      name: {
        zh: "莫娜（Mona）｜幸福收藏的夢光旅人",
        en: "Mona | Dream Light Traveler of Happiness Collection",
        ja: "モナ（Mona）｜幸福収集の夢光旅人",
        ko: "모나 (Mona) | 행복 수집의 꿈빛 여행자"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 50000,
      reward: "收藏幸福的小星瓶",
      imageUrl: "https://github.com/user-attachments/assets/f44fcd6b-d436-4e30-a2b3-06ef625385f2"
    },
    {
      id: 4,
      name: {
        zh: "星語的召喚",
        en: "The Call of Star Language",
        ja: "星の言葉の呼びかけ",
        ko: "별말의 부름"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 70000,
      reward: "拼圖4",
      imageUrl: "https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437"
    },
    {
      id: 5,
      name: {
        zh: "星語花園的試煉",
        en: "The Trial of the Star Garden",
        ja: "星の庭の試練",
        ko: "별빛 정원의 시련"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 90000,
      reward: "拼圖5",
      imageUrl: "https://github.com/user-attachments/assets/bb21c3ca-4920-4537-b47e-bd83aefdaa4b"
    },
    {
      id: 6,
      name: {
        zh: "回憶中的幸福微光",
        en: "The Glimmer of Happiness in Memories",
        ja: "思い出の中の幸せの光",
        ko: "기억 속의 행복한 빛"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 120000,
      reward: "拼圖6",
      imageUrl: "https://github.com/user-attachments/assets/af2e654d-fc82-4cb9-b470-c2106f9c1e2e"
    },
    {
      id: 7,
      name: {
        zh: "星光停止的那一天",
        en: "The Day the Starlight Stopped",
        ja: "星の光が止まった日",
        ko: "별빛이 멈춘 날"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 140000,
      reward: "拼圖7",
      imageUrl: "https://github.com/user-attachments/assets/083dbff3-8127-480f-af35-622d10afd673"
    },
    {
      id: 8,
      name: {
        zh: "遺失的心語之光",
        en: "The Lost Light of Heart Language",
        ja: "失われた心の言葉の光",
        ko: "잃어버린 마음 언어의 빛"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 160000,
      reward: "拼圖8",
      imageUrl: "https://github.com/user-attachments/assets/1a07352e-3898-4563-915d-b4bcbbac3c02"
    },
    {
      id: 9,
      name: {
        zh: "光之迴響與星願合奏",
        en: "The Echo of Light and the Star Wish Ensemble",
        ja: "光のこだまと星の願いのアンサンブル",
        ko: "빛의 메아리와 별 소원의 앙상블"
      },
      pieces: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, unlocked: false })),
      target: 180000,
      reward: "拼圖9",
      imageUrl: "https://github.com/user-attachments/assets/47d96e38-c703-4748-818f-976cf4a28eae"
    }
  ];
};

// Default state to use when hydration fails or for initialization
const getDefaultState = (): Omit<AppState, 'updateSettings' | 'incrementCount' | 'unlockPuzzlePiece' | 'setSelectedAffirmationId'> => ({
  settings: {
    language: 'zh' as AppLanguage,
    sound: true,
    vibration: true,
  },
  todayCounts: Object.fromEntries(affirmations.map(aff => [aff.id, 0])),
  stats: initializeTodayStats(),
  totalPoints: 0,
  dailyPoints: 0,
  carryOverPoints: 0, // Initialize carry-over points
  lastPointsDate: getTodayString(),
  lastResetTimestamp: Date.now(), // Initialize with current timestamp
  puzzles: initializePuzzles(),
  selectedAffirmationId: null,
});

// Create a safe storage wrapper
const createSafeStorage = () => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(name);
      } catch (error) {
        console.warn('Storage getItem error:', error);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(name, value);
      } catch (error) {
        console.warn('Storage setItem error:', error);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(name);
      } catch (error) {
        console.warn('Storage removeItem error:', error);
      }
    }
  };
};

// Export the daily points limit for use in other components
export { DAILY_POINTS_LIMIT };

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initialize with default state
      ...getDefaultState(),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      incrementCount: (id, amount = 1) => {
        try {
          const { todayCounts, stats, totalPoints, dailyPoints, carryOverPoints, lastPointsDate, lastResetTimestamp } = get();
          const now = new Date();
          const today = getTodayString();
          const currentMonth = getCurrentMonthString();
          const currentYear = getCurrentYearString();
          
          // Check if we need to reset daily points (past midnight)
          let newDailyPoints = dailyPoints;
          let newCarryOverPoints = carryOverPoints;
          let newLastResetTimestamp = lastResetTimestamp;
          
          // Check if we've passed midnight since the last reset
          if (isPastMidnight(lastResetTimestamp)) {
            // It's a new day, apply any carry-over points from yesterday
            newDailyPoints = newCarryOverPoints;
            newCarryOverPoints = 0;
            newLastResetTimestamp = now.getTime();
          }
          
          // Check if we've reached the daily limit (3000 points)
          if (newDailyPoints >= DAILY_POINTS_LIMIT) {
            // Store excess points as carry-over for next day
            newCarryOverPoints += amount;
            // Skip incrementing today's count if daily limit reached
            set({
              carryOverPoints: newCarryOverPoints,
              lastPointsDate: today,
              lastResetTimestamp: newLastResetTimestamp
            });
            return;
          }
          
          // Calculate how many points we can add without exceeding the daily limit
          const pointsToAdd = Math.min(amount, DAILY_POINTS_LIMIT - newDailyPoints);
          const excessPoints = Math.max(0, amount - pointsToAdd);
          
          if (pointsToAdd <= 0) {
            // If we can't add any points today, add them all to carry-over
            set({
              carryOverPoints: newCarryOverPoints + amount,
              lastPointsDate: today,
              lastResetTimestamp: newLastResetTimestamp
            });
            return;
          }
          
          // Update today counts
          const newTodayCounts = { ...todayCounts };
          newTodayCounts[id] = (newTodayCounts[id] || 0) + pointsToAdd;
          
          // Update stats - create a deep copy to avoid reference issues
          const newStats = JSON.parse(JSON.stringify(stats)) as StatsData;
          
          // Ensure all required objects exist
          if (!newStats.daily) newStats.daily = {};
          if (!newStats.monthly) newStats.monthly = {};
          if (!newStats.yearly) newStats.yearly = {};
          
          if (!newStats.daily[today]) {
            newStats.daily[today] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
          }
          
          if (!newStats.monthly[currentMonth]) {
            newStats.monthly[currentMonth] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
          }
          
          if (!newStats.yearly[currentYear]) {
            newStats.yearly[currentYear] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
          }
          
          // Update daily stats
          const dailyStatIndex = newStats.daily[today].findIndex(stat => stat.id === id);
          if (dailyStatIndex !== -1) {
            newStats.daily[today][dailyStatIndex].count += pointsToAdd;
          }
          
          // Update monthly stats
          const monthlyStatIndex = newStats.monthly[currentMonth].findIndex(stat => stat.id === id);
          if (monthlyStatIndex !== -1) {
            newStats.monthly[currentMonth][monthlyStatIndex].count += pointsToAdd;
          }
          
          // Update yearly stats
          const yearlyStatIndex = newStats.yearly[currentYear].findIndex(stat => stat.id === id);
          if (yearlyStatIndex !== -1) {
            newStats.yearly[currentYear][yearlyStatIndex].count += pointsToAdd;
          }
          
          // Update total points and daily points
          const newTotalPoints = totalPoints + pointsToAdd;
          newDailyPoints += pointsToAdd;
          
          // Add excess points to carry-over
          if (excessPoints > 0) {
            newCarryOverPoints += excessPoints;
          }
          
          // Check if we should unlock a puzzle piece (every 1000 points)
          const shouldUnlockPiece = Math.floor(newTotalPoints / 1000) > Math.floor(totalPoints / 1000);
          
          if (shouldUnlockPiece) {
            // 修改解锁逻辑，按照顺序从拼图1到拼图9解锁
            const puzzles = get().puzzles;
            
            // 找到第一个有未解锁碎片的拼图
            let targetPuzzleIndex = -1;
            for (let i = 0; i < puzzles.length; i++) {
              const puzzle = puzzles[i];
              if (puzzle.pieces.some(piece => !piece.unlocked)) {
                targetPuzzleIndex = i;
                break;
              }
            }
            
            if (targetPuzzleIndex !== -1) {
              const targetPuzzle = puzzles[targetPuzzleIndex];
              
              // 找出该拼图中所有未解锁的碎片
              const unlockedPieces = targetPuzzle.pieces.filter(piece => !piece.unlocked);
              
              if (unlockedPieces.length > 0) {
                // 随机选择一个未解锁的碎片
                const randomPiece = unlockedPieces[Math.floor(Math.random() * unlockedPieces.length)];
                
                // 解锁该碎片
                setTimeout(() => {
                  get().unlockPuzzlePiece(targetPuzzle.id, randomPiece.id);
                }, 0);
              }
            }
          }
          
          set({ 
            todayCounts: newTodayCounts, 
            stats: newStats,
            totalPoints: newTotalPoints,
            dailyPoints: newDailyPoints,
            carryOverPoints: newCarryOverPoints,
            lastPointsDate: today,
            lastResetTimestamp: newLastResetTimestamp
          });
        } catch (error) {
          console.warn('Error incrementing count:', error);
        }
      },
      
      unlockPuzzlePiece: (puzzleId, pieceId) => set((state) => {
        try {
          const newPuzzles = JSON.parse(JSON.stringify(state.puzzles));
          const puzzleIndex = newPuzzles.findIndex((p: Puzzle) => p.id === puzzleId);
          
          if (puzzleIndex !== -1) {
            const pieceIndex = newPuzzles[puzzleIndex].pieces.findIndex((piece: any) => piece.id === pieceId);
            
            if (pieceIndex !== -1) {
              newPuzzles[puzzleIndex].pieces[pieceIndex].unlocked = true;
            }
          }
          
          return { puzzles: newPuzzles };
        } catch (error) {
          console.warn('Error unlocking puzzle piece:', error);
          return { puzzles: state.puzzles };
        }
      }),
      
      setSelectedAffirmationId: (id) => set({ selectedAffirmationId: id }),
    }),
    {
      name: 'wishglow-storage-v10', // Changed storage key to force reset with new puzzles
      storage: createJSONStorage(() => createSafeStorage()),
      version: 9, // Increased version to trigger migration
      migrate: (persistedState: any, version: number): AppState => {
        // Migration function to handle version changes
        if (version < 9) {
          console.log('Migrating from version', version, 'to 9');
          
          // Get default puzzles structure
          const defaultPuzzles = initializePuzzles();
          
          // If we have persisted puzzles, merge them with default structure
          // This preserves unlocked pieces while ensuring all puzzles have correct metadata
          if (persistedState.puzzles && Array.isArray(persistedState.puzzles)) {
            const mergedPuzzles = defaultPuzzles.map((defaultPuzzle) => {
              // Find matching puzzle in persisted state
              const persistedPuzzle = persistedState.puzzles.find(
                (p: any) => p && p.id === defaultPuzzle.id
              );
              
              // If we found a matching puzzle with pieces, merge the unlocked state
              if (persistedPuzzle && persistedPuzzle.pieces && Array.isArray(persistedPuzzle.pieces)) {
                return {
                  ...defaultPuzzle,
                  pieces: defaultPuzzle.pieces.map((defaultPiece) => {
                    // Find matching piece in persisted puzzle
                    const persistedPiece = persistedPuzzle.pieces.find(
                      (p: any) => p && p.id === defaultPiece.id
                    );
                    
                    // If we found a matching piece, use its unlocked state, otherwise use default
                    return {
                      ...defaultPiece,
                      unlocked: persistedPiece ? !!persistedPiece.unlocked : defaultPiece.unlocked
                    };
                  })
                };
              }
              
              // If no matching puzzle or no pieces, use default
              return defaultPuzzle;
            });
            
            persistedState.puzzles = mergedPuzzles;
          } else {
            // If no puzzles in persisted state, use default
            persistedState.puzzles = defaultPuzzles;
          }
          
          // Update other fields as needed
          const updatedState = {
            ...persistedState,
            dailyPoints: persistedState.dailyPoints || 0,
            carryOverPoints: persistedState.carryOverPoints || 0,
            lastPointsDate: persistedState.lastPointsDate || getTodayString(),
            lastResetTimestamp: persistedState.lastResetTimestamp || Date.now(),
          };
          
          return updatedState as AppState;
        }
        
        // For future migrations
        console.warn(`Migration from version ${version} not implemented, using persisted state`);
        
        // Get the current methods from the store to avoid losing them
        const currentState = useAppStore.getState();
        
        return {
          ...persistedState,
          // Keep any methods from being lost during migration
          updateSettings: currentState.updateSettings,
          incrementCount: currentState.incrementCount,
          unlockPuzzlePiece: currentState.unlockPuzzlePiece,
          setSelectedAffirmationId: currentState.setSelectedAffirmationId,
        } as AppState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Hydration complete');
          
          // CRITICAL FIX: Don't overwrite puzzles with default values
          // Instead, merge metadata while preserving unlocked state
          const defaultPuzzles = initializePuzzles();
          
          if (state.puzzles && Array.isArray(state.puzzles)) {
            // Merge default puzzle metadata with persisted unlocked state
            state.puzzles = state.puzzles.map((persistedPuzzle, index) => {
              // Get corresponding default puzzle
              const defaultPuzzle = defaultPuzzles[index];
              
              // If persisted puzzle exists and has pieces, merge with default
              if (persistedPuzzle && persistedPuzzle.pieces && Array.isArray(persistedPuzzle.pieces)) {
                return {
                  ...defaultPuzzle, // Use default metadata (name, target, imageUrl, etc.)
                  pieces: persistedPuzzle.pieces.map((persistedPiece, pieceIndex) => {
                    // Get corresponding default piece
                    const defaultPiece = defaultPuzzle.pieces[pieceIndex];
                    
                    // Preserve unlocked state from persisted piece
                    return {
                      ...defaultPiece,
                      unlocked: persistedPiece ? !!persistedPiece.unlocked : false
                    };
                  })
                };
              }
              
              // If persisted puzzle doesn't exist or has no pieces, use default
              return defaultPuzzle;
            });
          }
          
          // Check if we need to reset daily points (past midnight)
          if (isPastMidnight(state.lastResetTimestamp)) {
            // It's a new day, apply any carry-over points from yesterday
            state.dailyPoints = state.carryOverPoints || 0;
            state.carryOverPoints = 0;
            state.lastPointsDate = getTodayString();
            state.lastResetTimestamp = Date.now();
            
            // Reset today's counts to zero for all affirmations
            state.todayCounts = Object.fromEntries(affirmations.map(aff => [aff.id, 0]));
            
            // Initialize today's stats
            const today = getTodayString();
            if (!state.stats.daily) state.stats.daily = {};
            state.stats.daily[today] = affirmations.map(aff => ({ id: aff.id, count: 0 }));
          } else {
            // Initialize today's counts after rehydration
            const today = getTodayString();
            if (state.stats?.daily?.[today]) {
              const todayCounts = Object.fromEntries(
                state.stats.daily[today].map((stat: { id: number; count: number }) => [stat.id, stat.count])
              );
              state.todayCounts = todayCounts;
            } else {
              state.todayCounts = Object.fromEntries(affirmations.map(aff => [aff.id, 0]));
            }
          }
        } else {
          console.warn('Hydration failed, using default state');
          
          // Get the current methods from the store to avoid losing them
          const currentState = useAppStore.getState();
          
          // Initialize with default values if hydration fails
          useAppStore.setState({
            ...getDefaultState(),
            // Keep any methods from being lost during setState
            updateSettings: currentState.updateSettings,
            incrementCount: currentState.incrementCount,
            unlockPuzzlePiece: currentState.unlockPuzzlePiece,
            setSelectedAffirmationId: currentState.setSelectedAffirmationId,
          });
        }
      }
    }
  )
);

// Helper function to clear storage (useful for debugging)
export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem('wishglow-storage');
    await AsyncStorage.removeItem('wishglow-storage-v2');
    await AsyncStorage.removeItem('wishglow-storage-v3');
    await AsyncStorage.removeItem('wishglow-storage-v4');
    await AsyncStorage.removeItem('wishglow-storage-v5');
    await AsyncStorage.removeItem('wishglow-storage-v6');
    await AsyncStorage.removeItem('wishglow-storage-v7');
    await AsyncStorage.removeItem('wishglow-storage-v8');
    await AsyncStorage.removeItem('wishglow-storage-v9');
    await AsyncStorage.removeItem('wishglow-storage-v10');
    console.log('Storage cleared');
  } catch (error) {
    console.warn('Error clearing storage:', error);
  }
};