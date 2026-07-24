import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { Puzzle } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/constants/translations';

type PuzzlePreviewProps = {
  puzzle: Puzzle;
};

export const PuzzlePreview: React.FC<PuzzlePreviewProps> = ({ puzzle }) => {
  const { settings, totalPoints } = useAppStore();
  const language = settings.language;
  
  // Calculate progress percentage
  const progress = Math.min(totalPoints / puzzle.target, 1);
  const unlockedCount = puzzle.pieces.filter(piece => piece.unlocked).length;
  
  // Get puzzle-specific colors
  const getPuzzleColor = (puzzleId: number) => {
    switch (puzzleId) {
      case 1:
        return '#D8BFD8'; // Light purple for Ruby
      case 2:
        return '#FFCCD5'; // Light pink for Fila
      case 3:
        return '#ADD8E6'; // Light blue for Mona
      case 4:
        return '#FFD700'; // Gold for Star Language Call
      case 5:
        return '#98FB98'; // Pale green for Star Garden Trial
      case 6:
        return '#FFA07A'; // Light salmon for Happiness Glimmer
      case 7:
        return '#B0C4DE'; // Light steel blue for Starlight Stopped
      case 8:
        return '#E6E6FA'; // Lavender for Lost Light
      case 9:
        return '#FFDAB9'; // Peach puff for Echo of Light
      default:
        return colors.primary;
    }
  };
  
  const puzzleColor = getPuzzleColor(puzzle.id);
  
  // Calculate position for each piece to show the correct part of the image
  const getImageStyle = (pieceId: number) => {
    // Grid layout: 3x4 (12 pieces total, but we only use 10)
    const rows = 3;
    const cols = 4;
    
    // Calculate row and column for this piece (0-indexed)
    // Skip the last two positions in the grid (bottom-right corner)
    let position = pieceId - 1; // Convert to 0-indexed
    if (position >= 10) position = 9; // Safety check
    
    // Skip the last two positions in the bottom row
    if (position >= 10) {
      position -= 2;
    }
    
    const row = Math.floor(position / cols);
    const col = position % cols;
    
    // Calculate the percentage offsets
    const leftOffset = -(col * 100) + '%';
    const topOffset = -(row * 100) + '%';
    
    return {
      position: 'absolute',
      width: cols * 100 + '%', // Image is cols times wider than the piece
      height: rows * 100 + '%', // Image is rows times taller than the piece
      left: leftOffset,
      top: topOffset,
    };
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{puzzle.name[language]}</Text>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: puzzleColor }]} />
        <Text style={styles.progressText}>
          {totalPoints}/{puzzle.target} ({unlockedCount}/10 {translations.game.unlockNext[language]}{unlockedCount + 1})
        </Text>
      </View>
      
      <View style={styles.piecesContainer}>
        {puzzle.pieces.map((piece) => (
          <View 
            key={piece.id} 
            style={[
              styles.piece, 
              piece.unlocked ? { backgroundColor: puzzleColor } : styles.lockedPiece
            ]}
            testID={`puzzle-${puzzle.id}-${piece.id}`}
          >
            {piece.unlocked && (
              <View style={styles.pieceImageContainer}>
                <Image
                  source={{ uri: puzzle.imageUrl }}
                  style={[styles.pieceImage, getImageStyle(piece.id)]}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  progressContainer: {
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
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
  piecesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  piece: {
    width: '18%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  lockedPiece: {
    backgroundColor: `${colors.textLight}40`,
  },
  pieceImageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  pieceImage: {
    position: 'absolute',
    width: '400%', // 4 columns
    height: '300%', // 3 rows
  },
});