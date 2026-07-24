import { AppLanguage } from '@/constants/translations';
import { IconName } from '@/constants/iconColors';

export type AffirmationStats = {
  id: number;
  count: number;
};

export type StatsData = {
  daily: Record<string, AffirmationStats[]>;
  monthly: Record<string, AffirmationStats[]>;
  yearly: Record<string, AffirmationStats[]>;
};

export type PuzzlePiece = {
  id: number;
  unlocked: boolean;
};

export type Puzzle = {
  id: number;
  name: {
    zh: string;
    en: string;
    ja: string;
    ko: string;
  };
  pieces: PuzzlePiece[];
  target: number;
  reward: string;
  imageUrl: string;
};

export type UserSettings = {
  language: AppLanguage;
  sound: boolean;
  vibration: boolean;
};