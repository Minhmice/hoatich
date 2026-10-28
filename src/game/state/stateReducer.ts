import { chapterIds, contentBundle, dayIds } from '../content';
import type { Effect, Shift } from '../content/types';
import type { GameSettings, GameState } from './GameState';

export type GameEvent =
  | { type: 'completeOrder'; orderId: string; bouquetFlowerIds: string[]; effects: Effect[]; outcome?: 'missed' | 'accepted' | 'resonant' }
  | { type: 'effect'; effect: Effect }
  | { type: 'advanceShift'; shift: Shift; dayId?: string }
  | { type: 'settings'; settings: Partial<GameSettings> }
  | { type: 'checkpoint'; orderId?: string; dialogueId?: string };

const flowers: Record<string, true> = Object.fromEntries(contentBundle.flowers.map(({ id }) => [id, true]));
const orders: Record<string, true> = Object.fromEntries(contentBundle.orders.map(({ id }) => [id, true]));
const customers: Record<string, true> = Object.fromEntries(contentBundle.customers.map(({ id }) => [id, true]));
const dialogues: Record<string, true> = Object.fromEntries(contentBundle.dialogue.map(({ id }) => [id, true]));
const flags: Record<string, true> = Object.fromEntries(contentBundle.flags.map((id) => [id, true]));
const journals: Record<string, true> = Object.fromEntries(contentBundle.journal.map(({ id }) => [id, true]));

function assertInventory(state: GameState): void {
  for (const [flowerId, quantity] of Object.entries(state.inventory)) {
    if (!flowers[flowerId]) throw new Error(`Unknown flower ID in inventory: ${flowerId}`);
    if (!Number.isFinite(quantity) || quantity < 0) throw new Error(`Inventory quantity cannot be negative: ${flowerId}`);
  }
}

function assertState(state: GameState): void {
  assertInventory(state);
  if (!chapterIds[state.currentChapter]) throw new Error(`Unknown chapter ID: ${state.currentChapter}`);
  if (!dayIds[state.currentDay]) throw new Error(`Unknown day ID: ${state.currentDay}`);
  if (state.currentShift !== 'living' && state.currentShift !== 'dead') throw new Error(`Unknown shift: ${state.currentShift}`);
  for (const flowerId of state.unlockedFlowerIds) if (!flowers[flowerId]) throw new Error(`Unknown unlocked flower ID: ${flowerId}`);
  for (const orderId of state.completedOrderIds) if (!orders[orderId]) throw new Error(`Unknown completed order ID: ${orderId}`);
  for (const customerId of Object.keys(state.relationshipScores)) if (!customers[customerId]) throw new Error(`Unknown relationship customer ID: ${customerId}`);
  for (const [customerId, score] of Object.entries(state.relationshipScores)) if (!Number.isFinite(score)) throw new Error(`Relationship score must be finite: ${customerId}`);
  for (const [customerId, progress] of Object.entries(state.npcProgress)) {
    if (!customers[customerId]) throw new Error(`Unknown NPC progress customer ID: ${customerId}`);
    if (!Number.isFinite(progress.affinity) || progress.affinity < 0 || progress.affinity > 100) throw new Error(`NPC affinity out of range: ${customerId}`);
    if (!Number.isInteger(progress.completedDeliveries) || progress.completedDeliveries < 0) throw new Error(`NPC completed delivery count invalid: ${customerId}`);
    if (!['neutral', 'good', 'strained'].includes(progress.activeBranch) || (progress.queuedBranch !== null && !['neutral', 'good', 'strained'].includes(progress.queuedBranch))) throw new Error(`NPC branch invalid: ${customerId}`);
  }
  for (const flag of Object.keys(state.flags)) if (!flags[flag]) throw new Error(`Unknown flag ID: ${flag}`);
  for (const entryId of state.journalEntryIds) if (!journals[entryId]) throw new Error(`Unknown journal entry ID: ${entryId}`);
  if (state.currentOrderId !== undefined && !orders[state.currentOrderId]) throw new Error(`Unknown order ID: ${state.currentOrderId}`);
  if (state.activeDialogueId !== undefined && !dialogues[state.activeDialogueId]) throw new Error(`Unknown dialogue ID: ${state.activeDialogueId}`);
  validateSettings(state.settings);
}

function assertKnownEffect(effect: Effect): void {
  if (effect.type === 'unlockFlower' && !flowers[effect.flowerId]) throw new Error(`Unknown flower ID: ${effect.flowerId}`);
  if (effect.type === 'relationship' && !customers[effect.customerId]) throw new Error(`Unknown customer ID: ${effect.customerId}`);
  if (effect.type === 'journal' && !journals[effect.entryId]) throw new Error(`Unknown journal entry ID: ${effect.entryId}`);
  if (effect.type === 'setFlag' && !flags[effect.flag]) throw new Error(`Unknown flag ID: ${effect.flag}`);
  if (effect.type === 'relationship' && !Number.isFinite(effect.amount)) throw new Error('Relationship amount must be finite');
}

export function applyEffects(state: GameState, effects: Effect[]): GameState {
  assertState(state);
  let next: GameState = {
    ...state,
    inventory: { ...state.inventory },
    npcProgress: Object.fromEntries(Object.entries(state.npcProgress).map(([id, progress]) => [id, { ...progress }])),
    unlockedFlowerIds: [...state.unlockedFlowerIds],
    relationshipScores: { ...state.relationshipScores },
    flags: { ...state.flags },
    journalEntryIds: [...state.journalEntryIds],
    settings: { ...state.settings },
  };
  for (const effect of effects) {
    assertKnownEffect(effect);
    switch (effect.type) {
      case 'setFlag':
        next.flags[effect.flag] = effect.value;
        break;
      case 'relationship': {
        const current = next.npcProgress[effect.customerId]?.affinity ?? next.relationshipScores[effect.customerId] ?? 50;
        const updated = Math.max(0, Math.min(100, current + effect.amount));
        next.relationshipScores[effect.customerId] = updated;
        if (next.npcProgress[effect.customerId]) {
          next.npcProgress[effect.customerId].affinity = updated;
        }
        break;
      }
      case 'unlockFlower':
        if (!next.unlockedFlowerIds.includes(effect.flowerId)) {
          next.unlockedFlowerIds.push(effect.flowerId);
          next.inventory[effect.flowerId] = 12;
        }
        break;
      case 'journal':
        if (!next.journalEntryIds.includes(effect.entryId)) next.journalEntryIds.push(effect.entryId);
        break;
    }
  }
  return next;
}

function validateSettings(settings: Partial<GameSettings>): void {
  if (settings.textSpeed !== undefined && !['slow', 'normal', 'fast'].includes(settings.textSpeed)) throw new Error('Invalid text speed');
  for (const key of ['musicVolume', 'sfxVolume'] as const) {
    const value = settings[key];
    if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 1)) throw new Error(`${key} must be finite and in range 0..1`);
  }
  if (settings.fontScale !== undefined && (!Number.isFinite(settings.fontScale) || settings.fontScale <= 0 || settings.fontScale > 3)) throw new Error('fontScale must be finite and in range');
  if (settings.reducedMotion !== undefined && typeof settings.reducedMotion !== 'boolean') throw new Error('reducedMotion must be boolean');
}

export function reduceGameState(state: GameState, event: GameEvent): GameState {
  assertState(state);
  if (event.type === 'completeOrder') {
    if (!orders[event.orderId]) throw new Error(`Unknown order ID: ${event.orderId}`);
    for (const flowerId of event.bouquetFlowerIds) if (!flowers[flowerId]) throw new Error(`Unknown flower ID: ${flowerId}`);
    for (const effect of event.effects) assertKnownEffect(effect);
    if (state.completedOrderIds.includes(event.orderId)) return state;
    const counts: Record<string, number> = {};
    for (const flowerId of event.bouquetFlowerIds) counts[flowerId] = (counts[flowerId] ?? 0) + 1;
    const inventory = { ...state.inventory };
    for (const [flowerId, count] of Object.entries(counts)) {
      const available = inventory[flowerId] ?? 0;
      if (available < count) throw new Error(`Insufficient inventory for ${flowerId}: need ${count}, available ${available}`);
      inventory[flowerId] = available - count;
    }
    const next = applyEffects({ ...state, inventory }, event.effects);
    const order = contentBundle.orders.find((entry) => entry.id === event.orderId)!;
    const progress = next.npcProgress[order.customerId];
    const hasRelationshipEffect = event.effects.some((e) => e.type === 'relationship' && e.customerId === order.customerId);
    const delta = event.outcome === 'resonant' ? 15 : event.outcome === 'accepted' ? 8 : -12;
    const affinity = hasRelationshipEffect
      ? progress.affinity
      : Math.max(0, Math.min(100, progress.affinity + delta));
    const completedDeliveries = progress.completedDeliveries + 1;
    const queuedBranch = progress.queuedBranch ?? (completedDeliveries >= 3 && affinity >= 70
      ? 'good'
      : completedDeliveries >= 3 && affinity <= 30 ? 'strained' : null);
    next.npcProgress[order.customerId] = { ...progress, affinity, completedDeliveries, queuedBranch };
    next.relationshipScores[order.customerId] = affinity;
    return { ...next, completedOrderIds: [...state.completedOrderIds, event.orderId], currentOrderId: undefined, activeDialogueId: undefined };
  }
  if (event.type === 'effect') return applyEffects(state, [event.effect]);
  if (event.type === 'advanceShift') {
    if (event.shift !== 'living' && event.shift !== 'dead') throw new Error(`Unknown shift: ${event.shift}`);
    if (event.dayId !== undefined && !dayIds[event.dayId]) throw new Error(`Unknown day ID: ${event.dayId}`);
    const inventory = { ...state.inventory };
    for (const flowerId of state.unlockedFlowerIds) inventory[flowerId] = Math.max(inventory[flowerId] ?? 0, 30);
    const unlockForDay: Record<string, string> = {
      'day-1': 'hoa-cuc-trang',
      'day-2': 'hoa-hong-do',
      'day-3': 'hoa-huong-duong',
      'day-4': 'hoa-sen-hong',
      'day-5': 'hoa-thuy-tien',
      'day-6': 'hoa-luu-ly',
    };
    const newlyUnlocked = event.dayId ? unlockForDay[event.dayId] : undefined;
    const unlockedFlowerIds = newlyUnlocked ? [...new Set([...state.unlockedFlowerIds, newlyUnlocked])] : state.unlockedFlowerIds;
    if (newlyUnlocked) inventory[newlyUnlocked] = 30;
    const npcProgress = event.dayId && event.shift === 'living'
      ? Object.fromEntries(Object.entries(state.npcProgress).map(([id, progress]) => [id, progress.queuedBranch
        ? { ...progress, activeBranch: progress.queuedBranch, queuedBranch: null }
        : progress]))
      : state.npcProgress;
    return {
      ...state,
      inventory,
      unlockedFlowerIds,
      npcProgress,
      currentShift: event.shift,
      ...(event.dayId === undefined ? {} : { currentDay: event.dayId }),
    };
  }
  if (event.type === 'settings') {
    validateSettings(event.settings);
    return { ...state, settings: { ...state.settings, ...event.settings } };
  }
  if (event.orderId !== undefined && !orders[event.orderId]) throw new Error(`Unknown order ID: ${event.orderId}`);
  if (event.dialogueId !== undefined && !dialogues[event.dialogueId]) throw new Error(`Unknown dialogue ID: ${event.dialogueId}`);
  return { ...state, currentOrderId: event.orderId, activeDialogueId: event.dialogueId };
}