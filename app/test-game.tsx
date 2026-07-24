import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppStore, DAILY_POINTS_LIMIT } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { AppLanguage } from '@/constants/translations';

export default function TestGameScreen() {
  const router = useRouter();
  const { 
    settings, 
    updateSettings, 
    totalPoints, 
    dailyPoints, 
    carryOverPoints, 
    incrementCount, 
    puzzles 
  } = useAppStore();
  
  const [testStatus, setTestStatus] = useState<string>('Ready to test');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(settings.language);
  
  // Helper function to add a test result
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };
  
  // Helper function to check if a puzzle is unlocked
  const isPuzzleUnlocked = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    return puzzle.pieces.some(piece => piece.unlocked);
  };
  
  // Helper function to check if a puzzle is completely unlocked
  const isPuzzleComplete = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    return puzzle.pieces.every(piece => piece.unlocked);
  };
  
  // Helper function to get the number of unlocked pieces for a puzzle
  const getUnlockedPiecesCount = (puzzleId: number): number => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return 0;
    return puzzle.pieces.filter(piece => piece.unlocked).length;
  };
  
  // Test 1: Simulate clicks from 0 to target points
  const runClickSimulation = async (targetPoints: number) => {
    if (isRunningTest) return;
    
    setIsRunningTest(true);
    setTestStatus(`Running click simulation to ${targetPoints} points...`);
    addTestResult(`Starting click simulation to ${targetPoints} points`);
    
    const startingPoints = totalPoints;
    addTestResult(`Starting points: ${startingPoints}`);
    
    // Use a fixed affirmation ID for testing
    const testAffirmationId = 1;
    
    // Simulate clicks in batches to avoid UI freezing
    const batchSize = 100;
    const totalBatches = Math.ceil((targetPoints - startingPoints) / batchSize);
    
    for (let batch = 0; batch < totalBatches; batch++) {
      // Update progress
      setTestProgress(Math.min(100, Math.round((batch / totalBatches) * 100)));
      
      // Determine how many clicks to simulate in this batch
      const clicksInBatch = Math.min(
        batchSize, 
        targetPoints - startingPoints - (batch * batchSize)
      );
      
      if (clicksInBatch <= 0) break;
      
      // Simulate clicks
      for (let i = 0; i < clicksInBatch; i++) {
        incrementCount(testAffirmationId, 1);
      }
      
      // Log progress at regular intervals
      if (batch % 10 === 0 || batch === totalBatches - 1) {
        addTestResult(`Progress: ${totalPoints} points (${Math.round((totalPoints / targetPoints) * 100)}%)`);
        
        // Check puzzle unlocking status
        puzzles.forEach(puzzle => {
          const unlockedPieces = getUnlockedPiecesCount(puzzle.id);
          addTestResult(`Puzzle ${puzzle.id}: ${unlockedPieces}/10 pieces unlocked`);
        });
      }
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    addTestResult(`Click simulation completed. Final points: ${totalPoints}`);
    setTestStatus('Click simulation completed');
    setTestProgress(100);
    setIsRunningTest(false);
  };
  
  // Test 2: Test language switching
  const testLanguageSwitching = async () => {
    if (isRunningTest) return;
    
    setIsRunningTest(true);
    setTestStatus('Testing language switching...');
    addTestResult('Starting language switching test');
    
    const languages: AppLanguage[] = ['zh', 'en', 'ja', 'ko'];
    
    for (const lang of languages) {
      addTestResult(`Switching to language: ${lang}`);
      updateSettings({ language: lang });
      setSelectedLanguage(lang);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify language was updated
      if (settings.language === lang) {
        addTestResult(`✅ Language successfully switched to ${lang}`);
      } else {
        addTestResult(`❌ Failed to switch language to ${lang}`);
      }
    }
    
    addTestResult('Language switching test completed');
    setTestStatus('Language switching test completed');
    setIsRunningTest(false);
  };
  
  // Test 3: Verify puzzle unlocking at specific thresholds
  const testPuzzleUnlocking = () => {
    if (isRunningTest) return;
    
    setTestStatus('Verifying puzzle unlocking...');
    addTestResult('Starting puzzle unlocking verification');
    
    // Define expected unlocking thresholds
    const puzzleThresholds = [
      { id: 1, threshold: 0 },      // Always unlocked
      { id: 2, threshold: 10000 },
      { id: 3, threshold: 30000 },
      { id: 4, threshold: 50000 },
      { id: 5, threshold: 70000 },
      { id: 6, threshold: 90000 },
      { id: 7, threshold: 120000 },
      { id: 8, threshold: 140000 },
      { id: 9, threshold: 160000 }
    ];
    
    // Check each puzzle's unlocking status
    puzzleThresholds.forEach(({ id, threshold }) => {
      const shouldBeUnlocked = totalPoints >= threshold;
      const isUnlocked = isPuzzleUnlocked(id);
      
      if (shouldBeUnlocked && isUnlocked) {
        addTestResult(`✅ Puzzle ${id} correctly unlocked (${getUnlockedPiecesCount(id)}/10 pieces)`);
      } else if (shouldBeUnlocked && !isUnlocked) {
        addTestResult(`❌ Puzzle ${id} should be unlocked but isn't`);
      } else if (!shouldBeUnlocked && isUnlocked) {
        addTestResult(`❌ Puzzle ${id} is unlocked but shouldn't be`);
      } else {
        addTestResult(`✅ Puzzle ${id} correctly locked`);
      }
    });
    
    addTestResult('Puzzle unlocking verification completed');
    setTestStatus('Puzzle unlocking verification completed');
  };
  
  // Test 4: Verify persistence by navigating to other screens and back
  const testPersistence = async () => {
    if (isRunningTest) return;
    
    setIsRunningTest(true);
    setTestStatus('Testing persistence...');
    addTestResult('Starting persistence test');
    
    // Record current state
    const initialPoints = totalPoints;
    const initialUnlockedPuzzles = puzzles.map(p => ({
      id: p.id,
      unlockedPieces: getUnlockedPiecesCount(p.id)
    }));
    
    // Navigate to game screen
    addTestResult('Navigating to game screen...');
    router.push('/(tabs)/game');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back
    addTestResult('Navigating back to test screen...');
    router.back();
    
    // Wait for state to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify state persisted
    if (totalPoints === initialPoints) {
      addTestResult(`✅ Points persisted correctly: ${totalPoints}`);
    } else {
      addTestResult(`❌ Points did not persist. Expected: ${initialPoints}, Got: ${totalPoints}`);
    }
    
    // Check puzzle unlocking persistence
    let allPuzzlesPersisted = true;
    initialUnlockedPuzzles.forEach(({ id, unlockedPieces }) => {
      const currentUnlockedPieces = getUnlockedPiecesCount(id);
      if (currentUnlockedPieces === unlockedPieces) {
        addTestResult(`✅ Puzzle ${id} pieces persisted correctly: ${currentUnlockedPieces}/10`);
      } else {
        addTestResult(`❌ Puzzle ${id} pieces did not persist. Expected: ${unlockedPieces}, Got: ${currentUnlockedPieces}`);
        allPuzzlesPersisted = false;
      }
    });
    
    // Navigate to story page
    addTestResult('Navigating to story page...');
    router.push('/wishonia-story');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back
    addTestResult('Navigating back to test screen...');
    router.back();
    
    // Wait for state to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to wish star box
    addTestResult('Navigating to wish star box...');
    router.push('/wish-star-box');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back
    addTestResult('Navigating back to test screen...');
    router.back();
    
    // Final verification
    if (totalPoints === initialPoints && allPuzzlesPersisted) {
      addTestResult('✅ All game state persisted correctly across navigation');
    } else {
      addTestResult('❌ Some game state did not persist correctly across navigation');
    }
    
    addTestResult('Persistence test completed');
    setTestStatus('Persistence test completed');
    setIsRunningTest(false);
  };
  
  // Run all tests in sequence
  const runAllTests = async () => {
    if (isRunningTest) return;
    
    setTestResults([]);
    setTestStatus('Running all tests...');
    addTestResult('Starting all tests');
    
    // Test 1: Click simulation to 180000 points
    await runClickSimulation(180000);
    
    // Test 2: Language switching
    await testLanguageSwitching();
    
    // Test 3: Puzzle unlocking verification
    testPuzzleUnlocking();
    
    // Test 4: Persistence test
    await testPersistence();
    
    addTestResult('All tests completed');
    setTestStatus('All tests completed');
  };
  
  // Display current game state
  const renderGameState = () => {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>Current Game State</Text>
        
        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Total Points:</Text>
          <Text style={styles.stateValue}>{totalPoints}</Text>
        </View>
        
        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Daily Points:</Text>
          <Text style={styles.stateValue}>{dailyPoints}/{DAILY_POINTS_LIMIT}</Text>
        </View>
        
        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Carry Over Points:</Text>
          <Text style={styles.stateValue}>{carryOverPoints}</Text>
        </View>
        
        <View style={styles.stateRow}>
          <Text style={styles.stateLabel}>Language:</Text>
          <Text style={styles.stateValue}>{settings.language}</Text>
        </View>
        
        <Text style={styles.stateSubtitle}>Puzzle Unlocking Status:</Text>
        {puzzles.map(puzzle => (
          <View key={puzzle.id} style={styles.puzzleRow}>
            <Text style={styles.puzzleLabel}>Puzzle {puzzle.id}:</Text>
            <Text style={styles.puzzleValue}>
              {getUnlockedPiecesCount(puzzle.id)}/10 pieces unlocked
              {isPuzzleComplete(puzzle.id) ? ' (Complete)' : ''}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Game Logic Testing' }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Game Logic Testing</Text>
          <Text style={styles.subtitle}>Test the game's logic and functionality</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusValue}>{testStatus}</Text>
          
          {isRunningTest && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${testProgress}%` }]} />
              <Text style={styles.progressText}>{testProgress}%</Text>
            </View>
          )}
        </View>
        
        {renderGameState()}
        
        <View style={styles.testButtonsContainer}>
          <Text style={styles.sectionTitle}>Test Controls</Text>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={() => runClickSimulation(10000)}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Simulate to 10K Points</Text>
          </Pressable>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={() => runClickSimulation(50000)}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Simulate to 50K Points</Text>
          </Pressable>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={() => runClickSimulation(180000)}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Simulate to 180K Points</Text>
          </Pressable>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={testLanguageSwitching}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Test Language Switching</Text>
          </Pressable>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={testPuzzleUnlocking}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Verify Puzzle Unlocking</Text>
          </Pressable>
          
          <Pressable
            style={[styles.testButton, isRunningTest && styles.disabledButton]}
            onPress={testPersistence}
            disabled={isRunningTest}
          >
            <Text style={styles.testButtonText}>Test Persistence</Text>
          </Pressable>
          
          <Pressable
            style={[styles.runAllButton, isRunningTest && styles.disabledButton]}
            onPress={runAllTests}
            disabled={isRunningTest}
          >
            <Text style={styles.runAllButtonText}>Run All Tests</Text>
          </Pressable>
        </View>
        
        <View style={styles.languageSwitcherContainer}>
          <Text style={styles.sectionTitle}>Manual Language Switching</Text>
          <View style={styles.languageButtons}>
            {(['zh', 'en', 'ja', 'ko'] as AppLanguage[]).map(lang => (
              <Pressable
                key={lang}
                style={[
                  styles.languageButton,
                  selectedLanguage === lang && styles.activeLanguageButton
                ]}
                onPress={() => {
                  updateSettings({ language: lang });
                  setSelectedLanguage(lang);
                }}
              >
                <Text 
                  style={[
                    styles.languageButtonText,
                    selectedLanguage === lang && styles.activeLanguageButtonText
                  ]}
                >
                  {lang === 'zh' ? '繁體中文' : 
                   lang === 'en' ? 'English' : 
                   lang === 'ja' ? '日本語' : '한국어'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.navigationContainer}>
          <Text style={styles.sectionTitle}>Navigation Testing</Text>
          <View style={styles.navigationButtons}>
            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/(tabs)/game')}
            >
              <Text style={styles.navButtonText}>Game Screen</Text>
            </Pressable>
            
            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/wishonia-story')}
            >
              <Text style={styles.navButtonText}>Story Screen</Text>
            </Pressable>
            
            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/wish-star-box')}
            >
              <Text style={styles.navButtonText}>Wish Star Box</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results</Text>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No test results yet. Run a test to see results.</Text>
          ) : (
            testResults.map((result, index) => (
              <Text 
                key={index} 
                style={[
                  styles.resultItem,
                  result.includes('✅') && styles.successResult,
                  result.includes('❌') && styles.errorResult
                ]}
              >
                {result}
              </Text>
            ))
          )}
        </View>
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
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.background,
    opacity: 0.8,
  },
  statusContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  progressContainer: {
    height: 24,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stateContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  stateSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stateLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  stateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  puzzleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  puzzleLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  puzzleValue: {
    fontSize: 14,
    color: colors.text,
  },
  testButtonsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: `${colors.primary}20`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  runAllButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  runAllButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  languageSwitcherContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageButton: {
    width: '48%',
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  activeLanguageButton: {
    backgroundColor: colors.primary,
  },
  languageButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  activeLanguageButtonText: {
    color: colors.background,
  },
  navigationContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  navButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  resultsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  noResults: {
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  resultItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  successResult: {
    backgroundColor: `${colors.success}20`,
  },
  errorResult: {
    backgroundColor: '#FFD2D2',
  },
});