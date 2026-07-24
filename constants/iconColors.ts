// Define the type for icon names to ensure type safety
export type IconName = 'sparkles' | 'coins' | 'trophy' | 'shield' | 'flower' | 'heart' | 'leaf' | 'feather' | 'handshake' | 'zap';

// Color palette for affirmation icons with index signature to allow string indexing
export const iconColors: Record<IconName, string> = {
  sparkles: '#FFD700', // Gold
  coins: '#FFA500',    // Orange
  trophy: '#4CAF50',   // Green
  shield: '#2196F3',   // Blue
  flower: '#FF69B4',   // Hot Pink
  heart: '#FF4081',    // Pink
  leaf: '#8BC34A',     // Light Green
  feather: '#BB8FCE',  // Lighter Purple
  handshake: '#A1887F', // Lighter Brown
  zap: '#FF5722',      // Deep Orange
};

// Helper function to safely get icon color with fallback
export const getIconColor = (icon: string, fallback: string = '#8A6FE8'): string => {
  return iconColors[icon as IconName] || fallback;
};