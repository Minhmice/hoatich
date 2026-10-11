import { contentBundle } from '../content';
import type { Shift } from '../content/types';

export interface GameSettings {
  textSpeed: 'slow' | 'normal' | 'fast';
  fontScale: number;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
}

export interface GameState {
  schemaVersion: 1;
  savedAt: string;
  currentChapter: string;
  currentDay: string;
  currentShift: Shift;
  inventory: Record<string, number>;
  unlockedFlowerIds: string[];
  completedOrderIds: string[];
  relationshipScores: Record<string, number>;
  flags: Record<string, boolean | number | string>;
  journalEntryIds: string[];
  settings: GameSettings;
  currentOrderId?: string;
  activeDialogueId?: string;
}

const initialFlowers = contentBundle.flowers.filter((flower) => !flower.unlockFlag);

export function createInitialGameState(): GameState {
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    currentChapter: 'thang-mot',
    currentDay: 'day-1',
    currentShift: 'living',
    inventory: Object.fromEntries(initialFlowers.map(({ id }) => [id, 12])),
    unlockedFlowerIds: initialFlowers.map(({ id }) => id),
    completedOrderIds: [],
    relationshipScores: {},
    flags: {},
    journalEntryIds: [],
    settings: {
      textSpeed: 'normal',
      fontScale: 1,
      musicVolume: 1,
      sfxVolume: 1,
      reducedMotion: false,
    },
  };
}
