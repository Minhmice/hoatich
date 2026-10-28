import { chapterIds, contentBundle, dayIds } from '../content';
import type { GameSettings, GameState, NPCProgress } from '../state/GameState';

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

type BranchKind = NPCProgress['activeBranch'];

function validateNpcProgress(value: unknown, relationships: Record<string, number>): Record<string, NPCProgress> {
  if (value === undefined) throw new Error('npcProgress is required in schema 2');
  const source = object(value, 'npcProgress');
  const output: Record<string, NPCProgress> = {};
  const valid = (branch: unknown): branch is BranchKind => branch === 'neutral' || branch === 'good' || branch === 'strained';
  for (const customerId of Object.keys(customerIds)) {
    if (source[customerId] === undefined) throw new Error(`npcProgress.${customerId} is missing`);
    const entry = object(source[customerId], `npcProgress.${customerId}`);
    const affinity = finite(entry.affinity, `npcProgress.${customerId}.affinity`);
    if (affinity < 0 || affinity > 100) throw new Error(`npcProgress.${customerId}.affinity out of range`);
    const deliveries = finite(entry.completedDeliveries, `npcProgress.${customerId}.completedDeliveries`);
    if (!Number.isInteger(deliveries) || deliveries < 0) throw new Error(`npcProgress.${customerId}.completedDeliveries must be nonnegative integer`);
    if (!valid(entry.activeBranch) || (entry.queuedBranch !== null && !valid(entry.queuedBranch))) throw new Error(`npcProgress.${customerId} branch is invalid`);
    if (relationships[customerId] !== undefined && relationships[customerId] !== affinity) {
      throw new Error(`relationshipScores.${customerId} does not match npcProgress affinity`);
    }
    relationships[customerId] = affinity;
    output[customerId] = {
      affinity,
      completedDeliveries: deliveries,
      activeBranch: entry.activeBranch,
      queuedBranch: entry.queuedBranch,
    };
  }
  for (const id of Object.keys(source)) if (!customerIds[id]) throw new Error(`npcProgress contains unknown customer ID: ${id}`);
  return output;
}

function legacyNpcProgress(value: unknown, legacyRelationships: Record<string, number>): Record<string, NPCProgress> {
  const source = value === undefined ? {} : object(value, 'npcProgress');
  const output: Record<string, NPCProgress> = {};
  const valid = (branch: unknown): branch is BranchKind => branch === 'neutral' || branch === 'good' || branch === 'strained';
  for (const customerId of Object.keys(customerIds)) {
    const entry = source[customerId] === undefined ? {} : object(source[customerId], `npcProgress.${customerId}`);
    const affinityRaw = legacyRelationships[customerId] ?? entry.affinity ?? 50;
    const deliveriesRaw = entry.completedDeliveries ?? 0;
    const active = entry.activeBranch ?? 'neutral';
    const queued = entry.queuedBranch ?? null;
    if (!Number.isFinite(affinityRaw) || typeof affinityRaw !== 'number') throw new Error(`npcProgress.${customerId}.affinity must be finite`);
    if (!Number.isInteger(deliveriesRaw) || typeof deliveriesRaw !== 'number' || deliveriesRaw < 0) throw new Error(`npcProgress.${customerId}.completedDeliveries must be nonnegative integer`);
    if (!valid(active) || (queued !== null && !valid(queued))) throw new Error(`npcProgress.${customerId} branch is invalid`);
    output[customerId] = {
      affinity: Math.max(0, Math.min(100, affinityRaw)),
      completedDeliveries: deliveriesRaw,
      activeBranch: active,
      queuedBranch: queued,
    };
  }
  for (const id of Object.keys(source)) if (!customerIds[id]) throw new Error(`npcProgress contains unknown customer ID: ${id}`);
  return output;
}

function validate(input: Record<string, unknown>): GameState {
  if (input.schemaVersion !== 2) throw new Error('Unsupported save schema version');
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
  const npcProgress = validateNpcProgress(input.npcProgress, relationships);
  const rawFlags = object(input.flags, 'flags');
  const flags: Record<string, boolean | number | string> = {};
  for (const [id, value] of Object.entries(rawFlags)) {
    const legacyDialogueEffect = id.startsWith('dlg_effect_applied_') && Boolean(dialogueIds[id.slice('dlg_effect_applied_'.length)]);
    const detailFlag = id.startsWith('flag_heard_detail_') && orderIds[id.slice('flag_heard_detail_'.length)];
    if (!flagIds[id] && !legacyDialogueEffect && !detailFlag) throw new Error(`flags contains unknown ID: ${id}`);
    if (typeof value !== 'boolean' && typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) throw new Error(`flags.${id} is invalid`);
    flags[id] = value;
  }

  const state: GameState = {
    schemaVersion: 2,
    savedAt: string(input.savedAt, 'savedAt'),
    currentChapter,
    currentDay,
    currentShift,
    inventory,
    unlockedFlowerIds,
    completedOrderIds,
    relationshipScores: relationships,
    npcProgress,
    flags,
    journalEntryIds,
    settings: settings(input.settings),
  };
  if (input.currentOrderId !== undefined) state.currentOrderId = string(input.currentOrderId, 'currentOrderId');
  if (state.currentOrderId !== undefined && !orderIds[state.currentOrderId]) throw new Error('currentOrderId is unknown');
  if (input.activeDialogueId !== undefined) {
    const dialogueId = string(input.activeDialogueId, 'activeDialogueId');
    if (!dialogueIds[dialogueId]) throw new Error(`Unknown activeDialogueId: ${dialogueId}`);
    state.activeDialogueId = dialogueId;
  }
  return state;
}

export function migrateSave(input: unknown): GameState {
  const source = object(input, 'save');
  const version = source.schemaVersion === undefined ? 0 : source.schemaVersion;
  if (version !== 0 && version !== 1 && version !== 2) throw new Error(`Unsupported save schema version: ${String(version)}`);
  if (version === 2) return validate(source);
  const migrated: Record<string, unknown> = { ...source, schemaVersion: 2 };
  if (migrated.currentChapter === 'chuong-1') migrated.currentChapter = 'thang-mot';
  if (migrated.currentShift === undefined) migrated.currentShift = 'living';
  if (migrated.settings === undefined) migrated.settings = { ...defaultSettings };
  if (migrated.unlockedFlowerIds === undefined) {
    const inventory = object(migrated.inventory, 'inventory');
    const inventoryIds = Object.keys(inventory).filter((id) => flowerIds[id]);
    migrated.unlockedFlowerIds = inventoryIds.length > 0 ? [...new Set(inventoryIds)] : [...starterFlowerIds];
  }
  for (const key of ['completedOrderIds', 'journalEntryIds'] as const) if (migrated[key] === undefined) migrated[key] = [];
  if (migrated.relationshipScores === undefined) migrated.relationshipScores = {};
  if (migrated.flags === undefined) migrated.flags = {};
  const relScores = recordNumbers(migrated.relationshipScores, 'relationshipScores', customerIds);
  const npcProg = legacyNpcProgress(migrated.npcProgress, relScores);
  migrated.npcProgress = npcProg;
  migrated.relationshipScores = Object.fromEntries(
    Object.keys(customerIds).map((id) => [id, npcProg[id].affinity]),
  );
  if (migrated.activeDialogueId !== undefined) {
    const dialogueId = String(migrated.activeDialogueId);
    if (!dialogueIds[dialogueId]) {
      if (migrated.currentOrderId && typeof migrated.currentOrderId === 'string' && orderIds[migrated.currentOrderId]) {
        const activeOrder = contentBundle.orders.find((order) => order.id === migrated.currentOrderId);
        const completedIds = Array.isArray(migrated.completedOrderIds) ? migrated.completedOrderIds : [];
        if (activeOrder) {
          migrated.activeDialogueId = completedIds.includes(activeOrder.id)
            ? activeOrder.resultDialogueIds.accepted
            : activeOrder.openingDialogueId;
        } else {
          delete migrated.activeDialogueId;
        }
      } else {
        delete migrated.activeDialogueId;
      }
    }
  }
  return validate(migrated);
}

export function validateSave(state: GameState): GameState {
  return validate(state as unknown as Record<string, unknown>);
}
