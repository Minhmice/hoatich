import { chapterIds, contentBundle, dayIds } from '../content';
import type { GameSettings, GameState } from '../state/GameState';

const flowerIds: Record<string, true> = Object.fromEntries(contentBundle.flowers.map(({ id }) => [id, true]));
const starterFlowerIds = contentBundle.flowers.filter(({ unlockFlag }) => unlockFlag === undefined).map(({ id }) => id);
const orderIds: Record<string, true> = Object.fromEntries(contentBundle.orders.map(({ id }) => [id, true]));
const customerIds: Record<string, true> = Object.fromEntries(contentBundle.customers.map(({ id }) => [id, true]));
const dialogueIds: Record<string, true> = Object.fromEntries(contentBundle.dialogue.map(({ id }) => [id, true]));
const journalIds: Record<string, true> = Object.fromEntries(contentBundle.journal.map(({ id }) => [id, true]));
const flagIds: Record<string, true> = Object.fromEntries(contentBundle.flags.map((id) => [id, true]));

const defaultSettings: GameSettings = {
  textSpeed: 'normal',
  fontScale: 1,
  musicVolume: 1,
  sfxVolume: 1,
  reducedMotion: false,
};

function object(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
  return value as Record<string, unknown>;
}

function string(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`${name} must be a non-empty string`);
  return value;
}

function uniqueIds(value: unknown, name: string, known: Record<string, true>): string[] {
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || !known[id])) throw new Error(`${name} contains unknown ID`);
  if (new Set(value).size !== value.length) throw new Error(`${name} contains duplicate IDs`);
  return [...value];
}

function finite(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${name} must be finite`);
  return value;
}

function recordNumbers(value: unknown, name: string, known: Record<string, true>, integer = false): Record<string, number> {
  const source = object(value, name);
  const output: Record<string, number> = {};
  for (const [id, amount] of Object.entries(source)) {
    if (!known[id]) throw new Error(`${name} contains unknown ID: ${id}`);
    const n = finite(amount, `${name}.${id}`);
    if (integer && (!Number.isInteger(n) || n < 0)) throw new Error(`${name}.${id} must be a nonnegative integer`);
    output[id] = n;
  }
  return output;
}

function settings(value: unknown): GameSettings {
  const source = object(value, 'settings');
  const textSpeed = source.textSpeed;
  if (textSpeed !== 'slow' && textSpeed !== 'normal' && textSpeed !== 'fast') throw new Error('settings.textSpeed is invalid');
  const fontScale = finite(source.fontScale, 'settings.fontScale');
  const musicVolume = finite(source.musicVolume, 'settings.musicVolume');
  const sfxVolume = finite(source.sfxVolume, 'settings.sfxVolume');
  if (fontScale <= 0 || fontScale > 3) throw new Error('settings.fontScale is out of range');
  if (musicVolume < 0 || musicVolume > 1 || sfxVolume < 0 || sfxVolume > 1) throw new Error('settings volume is out of range');
  if (typeof source.reducedMotion !== 'boolean') throw new Error('settings.reducedMotion must be boolean');
  return { textSpeed, fontScale, musicVolume, sfxVolume, reducedMotion: source.reducedMotion };
}

function validate(input: Record<string, unknown>): GameState {
  if (input.schemaVersion !== 1) throw new Error('Unsupported save schema version');
  const currentShift = input.currentShift;
  if (currentShift !== 'living' && currentShift !== 'dead') throw new Error('currentShift is invalid');
  const currentChapter = string(input.currentChapter, 'currentChapter');
  if (!chapterIds[currentChapter]) throw new Error('currentChapter is invalid');
  const currentDay = string(input.currentDay, 'currentDay');
  if (!dayIds[currentDay]) throw new Error('currentDay is invalid');
  const inventory = recordNumbers(input.inventory, 'inventory', flowerIds, true);
  const unlockedFlowerIds = uniqueIds(input.unlockedFlowerIds, 'unlockedFlowerIds', flowerIds);
  const completedOrderIds = uniqueIds(input.completedOrderIds, 'completedOrderIds', orderIds);
  const journalEntryIds = uniqueIds(input.journalEntryIds, 'journalEntryIds', journalIds);
  const relationships = recordNumbers(input.relationshipScores, 'relationshipScores', customerIds);
  const rawFlags = object(input.flags, 'flags');
  const flags: Record<string, boolean | number | string> = {};
  for (const [id, value] of Object.entries(rawFlags)) {
    if (!flagIds[id]) throw new Error(`flags contains unknown ID: ${id}`);
    if (typeof value !== 'boolean' && typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) throw new Error(`flags.${id} is invalid`);
    flags[id] = value;
  }
  const state: GameState = {
    schemaVersion: 1,
    savedAt: string(input.savedAt, 'savedAt'),
    currentChapter,
    currentDay,
    currentShift,
    inventory,
    unlockedFlowerIds,
    completedOrderIds,
    relationshipScores: relationships,
    flags,
    journalEntryIds,
    settings: settings(input.settings),
  };
  if (input.currentOrderId !== undefined) state.currentOrderId = string(input.currentOrderId, 'currentOrderId');
  if (state.currentOrderId !== undefined && !orderIds[state.currentOrderId]) throw new Error('currentOrderId is unknown');
  if (input.activeDialogueId !== undefined) state.activeDialogueId = string(input.activeDialogueId, 'activeDialogueId');
  if (state.activeDialogueId !== undefined && !dialogueIds[state.activeDialogueId]) throw new Error('activeDialogueId is unknown');
  return state;
}

export function migrateSave(input: unknown): GameState {
  const source = object(input, 'save');
  const version = source.schemaVersion === undefined ? 0 : source.schemaVersion;
  if (version !== 0 && version !== 1) throw new Error(`Unsupported save schema version: ${String(version)}`);
  if (version === 1) return validate(source);
  const migrated: Record<string, unknown> = { ...source, schemaVersion: 1 };
  if (migrated.currentShift === undefined) migrated.currentShift = 'living';
  if (migrated.settings === undefined) migrated.settings = { ...defaultSettings };
  if (migrated.unlockedFlowerIds === undefined) {
    const inventory = object(migrated.inventory, 'inventory');
    migrated.unlockedFlowerIds = [...new Set([...starterFlowerIds, ...Object.keys(inventory).filter((id) => flowerIds[id])])];
  }
  for (const key of ['completedOrderIds', 'journalEntryIds'] as const) {
    if (migrated[key] === undefined) migrated[key] = [];
  }
  if (migrated.relationshipScores === undefined) migrated.relationshipScores = {};
  if (migrated.flags === undefined) migrated.flags = {};
  return validate(migrated);
}

export function validateSave(state: GameState): GameState {
  return validate(state as unknown as Record<string, unknown>);
}
