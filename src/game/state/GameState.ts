import { contentBundle } from '../content';
import type { BranchKind, Shift } from '../content/types';

export interface GameSettings {
  textSpeed: 'slow' | 'normal' | 'fast';
  fontScale: number;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
}

export interface NPCProgress {
  affinity: number;
  completedDeliveries: number;
  activeBranch: BranchKind;
  queuedBranch: BranchKind | null;
}

export interface GameState {
  schemaVersion: 2;
  savedAt: string;
  currentChapter: string;
  currentDay: string;
  currentShift: Shift;
  inventory: Record<string, number>;
  unlockedFlowerIds: string[];
  completedOrderIds: string[];
  relationshipScores: Record<string, number>;
  npcProgress: Record<string, NPCProgress>;
  flags: Record<string, boolean | number | string>;
  journalEntryIds: string[];
  settings: GameSettings;
  currentOrderId?: string;
  activeDialogueId?: string;
}

const initialFlowers = ['hoa-cuc-trang'];

export function createInitialGameState(): GameState {
  return {
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    currentChapter: 'thang-mot',
    currentDay: 'day-1',
    currentShift: 'living',
    inventory: Object.fromEntries(initialFlowers.map((id) => [id, 30])),
    unlockedFlowerIds: [...initialFlowers],
    completedOrderIds: [],
    relationshipScores: {},
    npcProgress: Object.fromEntries(contentBundle.customers.map(({ id }) => [id, {
      affinity: 50,
      completedDeliveries: 0,
      activeBranch: 'neutral',
      queuedBranch: null,
    }])),
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
