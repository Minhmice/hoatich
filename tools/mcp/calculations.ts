import { contentBundle } from '../../src/game/content';
import { getCardChoices, getFeatures, getOrderArrangement } from '../../src/game/content/progression';
import type { BouquetConfiguration, BouquetFinish, Effect, FlowerDefinition, OrderDefinition, Outcome } from '../../src/game/content/types';
import { type BouquetItem, evaluateBouquet } from '../../src/game/bouquet/evaluateBouquet';
import { generateSlots } from '../../src/game/bouquet/slotLayout';
import { GameSession, type DeliveryResult } from '../../src/game/GameSession';
import { createInitialGameState, type GameState } from '../../src/game/state/GameState';
import { validateSave } from '../../src/game/save/migrations';
import { KnowledgeError } from './contracts';

export interface BouquetFlowerInput {
  flowerId: string;
  quantity: number;
}

export interface EvaluateBouquetContext {
  flags: Record<string, boolean | number | string>;
  inventory?: Record<string, number>;
  unlockedFlowerIds?: string[];
}

export interface EvaluateBouquetInput {
  orderId: string;
  flowers: BouquetFlowerInput[];
  context: EvaluateBouquetContext;
  configuration?: BouquetConfiguration;
  finish?: BouquetFinish;
}

export interface EvaluateBouquetResult {
  orderId: string;
  outcome: Outcome;
  reasonIds: string[];
  matchedRuleIds: string[];
  effects: Effect[];
  resultDialogueId: string;
  metadataChecked: boolean;
  feasibility: {
    inventory: { status: 'feasible' | 'insufficient' | 'not_checked'; details?: Record<string, { required: number; available: number }> };
    unlocks: { status: 'feasible' | 'locked' | 'not_checked'; lockedFlowerIds?: string[] };
  };
  flowers: BouquetFlowerInput[];
}

export type SimulationAction =
  | { type: 'advance_dialogue'; choiceId?: string }
  | { type: 'deliver'; flowers: BouquetFlowerInput[]; configuration?: BouquetConfiguration; finish?: BouquetFinish }
  | { type: 'retry_missed' }
  | { type: 'advance_shift' };

export interface SimulateScenarioInput {
  initialState: 'initial' | GameState | Record<string, unknown>;
  actions: SimulationAction[];
}

export interface ActionTraceEntry {
  actionIndex: number;
  action: SimulationAction;
  dialogueBefore?: { id: string; speakerId: string };
  choicesBefore: Array<{ id: string; text: string }>;
  dialogueAfter?: { id: string; speakerId: string };
  choicesAfter: Array<{ id: string; text: string }>;
  currentOrderId?: string;
  deliveryResult?: DeliveryResult;
  effectsApplied: Effect[];
  stateDiff: Record<string, { before: unknown; after: unknown }>;
}

export interface PreparationTraceEntry {
  type: 'preparation';
  activeDialogueId?: string;
  effectsApplied: Effect[];
  orderStarted?: string;
}

export interface SimulateScenarioResult {
  status: 'completed' | 'error';
  simulation: 'isolated';
  finalState: GameState;
  stateDiff: Record<string, { before: unknown; after: unknown }>;
  trace: Array<ActionTraceEntry | PreparationTraceEntry>;
  failedActionIndex?: number;
  error?: {
    code: string;
    message: string;
  };
}

const knownFlowerMap: Record<string, FlowerDefinition> = Object.fromEntries(
  contentBundle.flowers.map((f) => [f.id, f]),
);

const knownOrderMap: Record<string, OrderDefinition> = Object.fromEntries(
  contentBundle.orders.map((o) => [o.id, o]),
);

const knownFlagMap: Record<string, true> = Object.fromEntries(
  contentBundle.flags.map((id) => [id, true]),
);

const allowedActionTypeMap: Record<string, true> = {
  advance_dialogue: true,
  deliver: true,
  retry_missed: true,
  advance_shift: true,
};

function assertObject(value: unknown, message = 'Input must be an object'): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new KnowledgeError('INVALID_INPUT', message);
  }
}

function aggregateFlowers(flowers: unknown): BouquetFlowerInput[] {
  if (!Array.isArray(flowers) || flowers.length === 0) {
    throw new KnowledgeError('INVALID_INPUT', 'flowers must be a non-empty array');
  }
  if (flowers.length > 100) {
    throw new KnowledgeError('LIMIT_EXCEEDED', 'flowers array exceeds maximum limit of 100 items');
  }

  const counts: Record<string, number> = {};

  for (const item of flowers) {
    assertObject(item, 'Each flower item must be an object');
    const flowerId = item.flowerId;
    const quantity = item.quantity;

    if (typeof flowerId !== 'string' || flowerId.length === 0 || flowerId.length > 256) {
      throw new KnowledgeError('INVALID_INPUT', 'flowerId must be a non-empty string <= 256 chars');
    }
    if (!knownFlowerMap[flowerId]) {
      throw new KnowledgeError('NOT_FOUND', `Flower "${flowerId}" not found`);
    }

    if (
      typeof quantity !== 'number' ||
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > 100
    ) {
      throw new KnowledgeError(
        'INVALID_INPUT',
        `Flower quantity for "${flowerId}" must be a positive integer between 1 and 100`,
      );
    }

    counts[flowerId] = (counts[flowerId] ?? 0) + quantity;
  }

  let totalStems = 0;
  const result: BouquetFlowerInput[] = [];
  for (const [flowerId, quantity] of Object.entries(counts)) {
    totalStems += quantity;
    result.push({ flowerId, quantity });
  }

  if (totalStems > 100) {
    throw new KnowledgeError('LIMIT_EXCEEDED', `Total flower stems (${totalStems}) exceed 100`);
  }

  return result;
}

function validateFlags(flags: unknown): Record<string, boolean | number | string> {
  assertObject(flags, 'context.flags is required and must be an object');

  const result: Record<string, boolean | number | string> = {};

  for (const [key, value] of Object.entries(flags)) {
    if (!knownFlagMap[key]) {
      throw new KnowledgeError('NOT_FOUND', `Unknown flag: "${key}"`);
    }

    if (typeof value === 'boolean') {
      result[key] = value;
    } else if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new KnowledgeError('INVALID_INPUT', `Flag "${key}" value must be a finite number`);
      }
      result[key] = value;
    } else if (typeof value === 'string') {
      if (value.length > 1024) {
        throw new KnowledgeError('LIMIT_EXCEEDED', `Flag "${key}" string value exceeds 1024 characters`);
      }
      result[key] = value;
    } else {
      throw new KnowledgeError('INVALID_INPUT', `Flag "${key}" has invalid value type`);
    }
  }

  return result;
}

export function evaluateInput(input: unknown): EvaluateBouquetResult {
  assertObject(input, 'Input must be an object');

  const orderId = input.orderId;
  if (typeof orderId !== 'string' || orderId.length === 0 || orderId.length > 256) {
    throw new KnowledgeError('INVALID_INPUT', 'orderId must be a non-empty string <= 256 chars');
  }

  const order = knownOrderMap[orderId];
  if (!order) {
    throw new KnowledgeError('NOT_FOUND', `Order "${orderId}" not found`);
  }

  const aggregatedFlowers = aggregateFlowers(input.flowers);

  assertObject(input.context, 'context is required and must be an object');
  const contextObj = input.context;
  const validatedFlags = validateFlags(contextObj.flags);

  // Inventory feasibility
  let inventoryStatus: 'feasible' | 'insufficient' | 'not_checked' = 'not_checked';
  let inventoryDetails: Record<string, { required: number; available: number }> | undefined;

  if (contextObj.inventory !== undefined) {
    assertObject(contextObj.inventory, 'context.inventory must be an object');
    const invMap = contextObj.inventory;
    let allFeasible = true;
    inventoryDetails = {};

    for (const { flowerId, quantity } of aggregatedFlowers) {
      const availRaw = invMap[flowerId] ?? 0;
      const avail = typeof availRaw === 'number' && Number.isFinite(availRaw) ? Math.max(0, Math.floor(availRaw)) : 0;
      inventoryDetails[flowerId] = { required: quantity, available: avail };
      if (avail < quantity) {
        allFeasible = false;
      }
    }
    inventoryStatus = allFeasible ? 'feasible' : 'insufficient';
  }

  // Unlocks feasibility
  let unlocksStatus: 'feasible' | 'locked' | 'not_checked' = 'not_checked';
  let lockedFlowers: string[] | undefined;

  if (contextObj.unlockedFlowerIds !== undefined) {
    if (!Array.isArray(contextObj.unlockedFlowerIds)) {
      throw new KnowledgeError('INVALID_INPUT', 'context.unlockedFlowerIds must be an array');
    }
    const unlockedMap: Record<string, true> = {};
    for (const item of contextObj.unlockedFlowerIds) {
      if (typeof item === 'string') unlockedMap[item] = true;
    }

    const missing: string[] = [];
    for (const { flowerId } of aggregatedFlowers) {
      if (!unlockedMap[flowerId]) {
        missing.push(flowerId);
      }
    }
    if (missing.length > 0) {
      unlocksStatus = 'locked';
      lockedFlowers = missing;
    } else {
      unlocksStatus = 'feasible';
    }
  }

  // Convert to BouquetItem[]
  const bouquetItems: BouquetItem[] = [];
  let layer = 0;
  for (const { flowerId, quantity } of aggregatedFlowers) {
    for (let i = 0; i < quantity; i++) {
      bouquetItems.push({
        id: `stem-${flowerId}-${layer}`,
        flowerId,
        position: { x: 0, y: 0 },
        rotation: 0,
        layer,
        slotIndex: layer,
        pose: 'center',
      });
      layer++;
    }
  }

  if ((input.configuration === undefined) !== (input.finish === undefined)) throw new KnowledgeError('INVALID_INPUT', 'configuration and finish must be supplied together');
  let evaluation;
  if (input.configuration !== undefined && input.finish !== undefined) {
    assertObject(input.configuration, 'configuration must be an object');
    assertObject(input.finish, 'finish must be an object');
    const configuration = input.configuration;
    const finish = input.finish;
    const stemCount = configuration.stemCount;
    if (!['bouquet', 'vase', 'jar'].includes(String(configuration.vessel)) || typeof stemCount !== 'number' || !Number.isInteger(stemCount) || stemCount < 1 || stemCount > 24 || stemCount !== bouquetItems.length) throw new KnowledgeError('INVALID_INPUT', 'configuration vessel/stemCount is invalid or does not match flowers');
    const paper = finish.paper;
    const ribbon = finish.ribbon;
    const bowStep = finish.bowStep;
    const cardId = finish.cardId;
    if (!['none', 'kraft', 'cream'].includes(String(paper)) || !['none', 'sage', 'rose'].includes(String(ribbon)) || typeof bowStep !== 'number' || ![0, 1, 2, 3].includes(bowStep) || (ribbon !== 'none' && bowStep !== 3) || (cardId !== null && typeof cardId !== 'string')) throw new KnowledgeError('INVALID_INPUT', 'finish metadata is invalid');
    if (finish.cardId !== null && !getCardChoices(order.id).some((card) => card.id === finish.cardId)) throw new KnowledgeError('INVALID_INPUT', 'cardId is not an authored choice for this order');
    const features = getFeatures(order.dayId);
    if ((!features.paper && finish.paper !== 'none') || (!features.ribbon && (finish.ribbon !== 'none' || finish.bowStep !== 0)) || (!features.cards && finish.cardId !== null)) throw new KnowledgeError('INVALID_INPUT', 'finish feature is not unlocked on order day');
    evaluation = evaluateBouquet(order, { configuration: configuration as unknown as BouquetConfiguration, items: bouquetItems, finish: finish as unknown as BouquetFinish }, { flags: validatedFlags });
  } else {
    evaluation = evaluateBouquet(order, bouquetItems, { flags: validatedFlags });
  }

  return {
    orderId: order.id,
    outcome: evaluation.outcome,
    reasonIds: [...evaluation.reasonIds],
    matchedRuleIds: [...evaluation.matchedRuleIds],
    effects: evaluation.effects.map((e) => ({ ...e })),
    resultDialogueId: order.resultDialogueIds[evaluation.outcome],
    metadataChecked: evaluation.metadataChecked,
    feasibility: {
      inventory: {
        status: inventoryStatus,
        ...(inventoryDetails ? { details: inventoryDetails } : {}),
      },
      unlocks: {
        status: unlocksStatus,
        ...(lockedFlowers ? { lockedFlowerIds: [...lockedFlowers] } : {}),
      },
    },
    flowers: aggregatedFlowers.map((f) => ({ ...f })),
  };
}

function computeStateDiff(before: GameState, after: GameState): Record<string, { before: unknown; after: unknown }> {
  const diff: Record<string, { before: unknown; after: unknown }> = {};

  const scalarKeys = ['currentChapter', 'currentDay', 'currentShift', 'currentOrderId', 'activeDialogueId'] as const;
  for (const key of scalarKeys) {
    if (before[key] !== after[key]) {
      diff[key] = { before: before[key], after: after[key] };
    }
  }

  const arrayKeys = ['unlockedFlowerIds', 'completedOrderIds', 'journalEntryIds'] as const;
  for (const key of arrayKeys) {
    const bArr = before[key] ?? [];
    const aArr = after[key] ?? [];
    if (JSON.stringify(bArr) !== JSON.stringify(aArr)) {
      diff[key] = { before: [...bArr], after: [...aArr] };
    }
  }

  const recordKeys = ['inventory', 'flags', 'relationshipScores', 'npcProgress'] as const;
  for (const key of recordKeys) {
    const bRec = before[key] ?? {};
    const aRec = after[key] ?? {};
    if (JSON.stringify(bRec) !== JSON.stringify(aRec)) {
      diff[key] = { before: { ...bRec }, after: { ...aRec } };
    }
  }

  return diff;
}

function tryAutoStartOrder(session: GameSession): OrderDefinition | undefined {
  if (!session.isDemoComplete && !session.currentOrder && !session.dialogue) {
    try {
      return session.startOrder();
    } catch {
      // All orders in current shift completed or no orders available
      return undefined;
    }
  }
  return undefined;
}

function parseSimulationAction(rawAction: unknown): SimulationAction {
  assertObject(rawAction, 'Each action must be an object');
  const type = rawAction.type;
  if (typeof type !== 'string' || !allowedActionTypeMap[type]) {
    throw new KnowledgeError('INVALID_INPUT', `Unknown or invalid action type: "${String(type)}"`);
  }

  if (type === 'advance_dialogue') {
    const choiceId = rawAction.choiceId;
    if (choiceId !== undefined && (typeof choiceId !== 'string' || choiceId.length === 0 || choiceId.length > 256)) {
      throw new KnowledgeError('INVALID_INPUT', 'choiceId must be a non-empty string <= 256 chars');
    }
    return { type: 'advance_dialogue', choiceId };
  }

  if (type === 'deliver') {
    const rawRecord = rawAction as Record<string, unknown>;
    const flowers = aggregateFlowers(rawRecord.flowers);
    const configuration = rawRecord.configuration as BouquetConfiguration | undefined;
    const finish = rawRecord.finish as BouquetFinish | undefined;
    if (configuration !== undefined) {
      assertObject(configuration, 'configuration must be an object');
      if (
        !['bouquet', 'vase', 'jar'].includes(String(configuration.vessel)) ||
        typeof configuration.stemCount !== 'number' ||
        !Number.isInteger(configuration.stemCount) ||
        configuration.stemCount < 1 ||
        configuration.stemCount > 24
      ) {
        throw new KnowledgeError('INVALID_INPUT', 'configuration vessel/stemCount is invalid');
      }
    }
    if (finish !== undefined) {
      assertObject(finish, 'finish must be an object');
      if (
        !['none', 'kraft', 'cream'].includes(String(finish.paper)) ||
        !['none', 'sage', 'rose'].includes(String(finish.ribbon)) ||
        ![0, 1, 2, 3].includes(Number(finish.bowStep)) ||
        (finish.cardId !== null && typeof finish.cardId !== 'string')
      ) {
        throw new KnowledgeError('INVALID_INPUT', 'finish metadata is invalid');
      }
    }
    return { type: 'deliver', flowers, configuration, finish };
  }

  if (type === 'retry_missed') {
    return { type: 'retry_missed' };
  }

  return { type: 'advance_shift' };
}

export function simulateInput(input: unknown): SimulateScenarioResult {
  assertObject(input, 'Input must be an object');

  if (!Array.isArray(input.actions)) {
    throw new KnowledgeError('INVALID_INPUT', 'actions must be an array');
  }

  if (input.actions.length > 50) {
    throw new KnowledgeError('LIMIT_EXCEEDED', 'Simulation allows maximum 50 actions');
  }

  const parsedActions = input.actions.map(parseSimulationAction);

  let baseState: GameState;

  if (input.initialState === 'initial') {
    const initial = createInitialGameState();
    initial.savedAt = '2026-01-01T00:00:00.000Z'; // deterministic ISO preset
    baseState = structuredClone(initial);
  } else if (input.initialState && typeof input.initialState === 'object' && !Array.isArray(input.initialState)) {
    const cloned = structuredClone(input.initialState) as GameState;
    try {
      validateSave(cloned);
      baseState = cloned;
    } catch (err) {
      throw new KnowledgeError('INVALID_STATE', err instanceof Error ? err.message : 'Invalid GameState provided');
    }
  } else {
    throw new KnowledgeError('INVALID_STATE', 'initialState must be "initial" or a valid GameState object');
  }

  // Session constructor shallow-copies; baseState is already deep-cloned
  const session = new GameSession(baseState, undefined);

  // Preparation trace
  const trace: Array<ActionTraceEntry | PreparationTraceEntry> = [];
  const prepAppliedEffects: Effect[] = [];

  if (baseState.activeDialogueId && baseState.activeDialogueId !== 'dlg-intro') {
    const node = contentBundle.dialogue.find((d) => d.id === baseState.activeDialogueId);
    if (node?.effects && !baseState.flags[`dlg_effect_applied_${node.id}`]) {
      prepAppliedEffects.push(...node.effects);
    }
  }

  const initialOrderStarted = tryAutoStartOrder(session);

  trace.push({
    type: 'preparation',
    activeDialogueId: session.dialogue?.id,
    effectsApplied: prepAppliedEffects,
    ...(initialOrderStarted ? { orderStarted: initialOrderStarted.id } : {}),
  });

  const stateAfterPreparation = structuredClone(session.state);

  // Execute actions
  for (let i = 0; i < parsedActions.length; i++) {
    const action = parsedActions[i]!;

    try {
      const dialogueBefore = session.dialogue
        ? { id: session.dialogue.id, speakerId: session.dialogue.speakerId }
        : undefined;
      const choicesBefore = session.currentChoices.map((c) => ({ id: c.id, text: c.text }));
      const stateBefore = structuredClone(session.state);

      let deliveryResult: DeliveryResult | undefined;
      let effectsApplied: Effect[] = [];

      switch (action.type) {
        case 'advance_dialogue': {
          if (!session.dialogue) {
            throw new KnowledgeError('ACTION_NOT_ALLOWED', 'No active dialogue to advance');
          }

          const choices = session.currentChoices;
          if (choices.length > 0) {
            if (!action.choiceId) {
              throw new KnowledgeError(
                'ACTION_NOT_ALLOWED',
                `A choiceId is required for dialogue "${session.dialogue.id}"`,
              );
            }
            if (!choices.some((c) => c.id === action.choiceId)) {
              throw new KnowledgeError(
                'ACTION_NOT_ALLOWED',
                `Choice "${action.choiceId}" is not valid or available for dialogue "${session.dialogue.id}"`,
              );
            }
          } else {
            if (action.choiceId) {
              throw new KnowledgeError(
                'ACTION_NOT_ALLOWED',
                `Dialogue "${session.dialogue.id}" does not accept choices`,
              );
            }
          }

          const result = session.advanceDialogue(action.choiceId);
          effectsApplied = result.effectsApplied;
          tryAutoStartOrder(session);
          break;
        }

        case 'deliver': {
          if (!session.canCompose) {
            throw new KnowledgeError(
              'ACTION_NOT_ALLOWED',
              'Cannot deliver: composition is blocked (dialogue active or no active order)',
            );
          }

          // Check unlocks
          for (const item of action.flowers) {
            if (!session.state.unlockedFlowerIds.includes(item.flowerId)) {
              throw new KnowledgeError('ACTION_NOT_ALLOWED', `Flower "${item.flowerId}" is not unlocked`);
            }
          }

          // Check inventory
          for (const item of action.flowers) {
            const stock = session.state.inventory[item.flowerId] ?? 0;
            if (stock < item.quantity) {
              throw new KnowledgeError(
                'ACTION_NOT_ALLOWED',
                `Insufficient inventory for "${item.flowerId}": required ${item.quantity}, available ${stock}`,
              );
            }
          }

          const totalStems = action.flowers.reduce((sum, item) => sum + item.quantity, 0);
          const currentOrder = session.currentOrder!;
          const arrangement = getOrderArrangement(currentOrder.id);
          const configuration: BouquetConfiguration = action.configuration ?? {
            vessel: arrangement.suggestedVessel,
            stemCount: totalStems,
          };
          const finish: BouquetFinish = action.finish ?? {
            paper: 'none',
            ribbon: 'none',
            bowStep: 0,
            cardId: null,
          };

          const slots = generateSlots(configuration.vessel, configuration.stemCount);
          const bouquetItems: BouquetItem[] = [];
          let layer = 0;
          for (const { flowerId, quantity } of action.flowers) {
            for (let q = 0; q < quantity; q++) {
              const slot = slots[layer] ?? { position: { x: 0, y: 0 }, rotation: 0, layer, pose: 'center' };
              bouquetItems.push({
                id: `sim-stem-${flowerId}-${layer}`,
                flowerId,
                position: { ...slot.position },
                rotation: slot.rotation,
                layer: slot.layer,
                slotIndex: layer,
                pose: slot.pose,
              });
              layer++;
            }
          }
          deliveryResult = session.deliver({ configuration, items: bouquetItems, finish });
          effectsApplied = deliveryResult.effects;
          tryAutoStartOrder(session);
          break;
        }

        case 'retry_missed': {
          if (!session.currentOrder) {
            throw new KnowledgeError('ACTION_NOT_ALLOWED', 'Cannot retry_missed: no active order');
          }
          if (session.lastDeliveryResult?.outcome !== 'missed') {
            throw new KnowledgeError(
              'ACTION_NOT_ALLOWED',
              'Cannot retry_missed: previous delivery was not missed or no delivery has occurred',
            );
          }
          session.retryMissed();
          break;
        }

        case 'advance_shift': {
          if (session.dialogue) {
            throw new KnowledgeError('ACTION_NOT_ALLOWED', 'Cannot advance_shift while dialogue is active');
          }
          if (!session.isShiftComplete) {
            throw new KnowledgeError(
              'ACTION_NOT_ALLOWED',
              'Cannot advance_shift: all orders in the current shift must be completed first',
            );
          }
          session.advanceShift();
          tryAutoStartOrder(session);
          break;
        }
      }

      const dialogueAfter = session.dialogue
        ? { id: session.dialogue.id, speakerId: session.dialogue.speakerId }
        : undefined;
      const choicesAfter = session.currentChoices.map((c) => ({ id: c.id, text: c.text }));
      const stateDiff = computeStateDiff(stateBefore, session.state);

      trace.push({
        actionIndex: i,
        action,
        dialogueBefore,
        choicesBefore,
        dialogueAfter,
        choicesAfter,
        currentOrderId: session.state.currentOrderId,
        deliveryResult,
        effectsApplied,
        stateDiff,
      });
    } catch (err) {
      const code = err instanceof KnowledgeError ? err.code : 'ACTION_NOT_ALLOWED';
      const message = err instanceof Error ? err.message : String(err);

      return {
        status: 'error',
        simulation: 'isolated',
        failedActionIndex: i,
        error: { code, message },
        trace,
        finalState: session.state,
        stateDiff: computeStateDiff(stateAfterPreparation, session.state),
      };
    }
  }

  return {
    status: 'completed',
    simulation: 'isolated',
    finalState: session.state,
    stateDiff: computeStateDiff(stateAfterPreparation, session.state),
    trace,
  };
}
