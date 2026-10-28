import { describe, expect, it } from 'vitest';
import { contentBundle } from '../../src/game/content';
import { createInitialGameState, type GameState } from '../../src/game/state/GameState';
import {
  evaluateInput,
  simulateInput,
  type ActionTraceEntry,
  type EvaluateBouquetResult,
  type SimulateScenarioResult,
} from '../../tools/mcp/calculations';

describe('evaluateInput', () => {
  const orderBacBa = contentBundle.orders.find((o) => o.id === 'order-01-bac-ba');
  if (!orderBacBa) throw new Error('Order order-01-bac-ba not found in content');

  it('computes resonant outcome with reasons, effects, and matched rules', () => {
    const result = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-thuy-tien', quantity: 1 },
      ],
      context: {
        flags: {
          flag_knows_bac_ba_wife_memory: true,
        },
      },
    }) as EvaluateBouquetResult;

    expect(result.orderId).toBe(orderBacBa.id);
    expect(result.outcome).toBe('resonant');
    expect(result.matchedRuleIds).toContain('rule-bacba-thuytien');
    expect(result.resultDialogueId).toBe(orderBacBa.resultDialogueIds.resonant);
    expect(result.effects.length).toBeGreaterThan(0);
    expect(result.feasibility.inventory.status).toBe('not_checked');
    expect(result.feasibility.unlocks.status).toBe('not_checked');
  });

  it('computes accepted outcome when explicit requirements met without resonance condition', () => {
    const result = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
      ],
      context: { flags: {} },
    }) as EvaluateBouquetResult;

    expect(result.outcome).toBe('accepted');
    expect(result.matchedRuleIds).toEqual([]);
    expect(result.resultDialogueId).toBe(orderBacBa.resultDialogueIds.accepted);
  });

  it('computes missed outcome when taboo dead flower is present', () => {
    const result = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-hoang-tuyen', quantity: 1 },
      ],
      context: { flags: {} },
    }) as EvaluateBouquetResult;

    expect(result.outcome).toBe('missed');
    expect(result.resultDialogueId).toBe(orderBacBa.resultDialogueIds.missed);
    expect(result.reasonIds.some((r) => r.includes('taboo'))).toBe(true);
  });

  it('computes missed outcome when required flower is absent', () => {
    const result = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-hong-do', quantity: 1 },
      ],
      context: { flags: {} },
    }) as EvaluateBouquetResult;

    expect(result.outcome).toBe('missed');
    expect(result.resultDialogueId).toBe(orderBacBa.resultDialogueIds.missed);
  });

  it('aggregates duplicate flower entries before evaluating rules', () => {
    const result = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-thuy-tien', quantity: 1 },
      ],
      context: {
        flags: {
          flag_knows_bac_ba_wife_memory: true,
        },
        inventory: {
          'hoa-cuc-trang': 2,
          'hoa-thuy-tien': 1,
        },
      },
    }) as EvaluateBouquetResult;

    expect(result.outcome).toBe('resonant');
    expect(result.feasibility.inventory.status).toBe('feasible');
    expect(result.feasibility.inventory.details?.['hoa-cuc-trang']?.required).toBe(2);
  });

  it('evaluates inventory feasibility independently without altering rule outcome', () => {
    const sufficient = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 2 }],
      context: {
        flags: {},
        inventory: { 'hoa-cuc-trang': 5 },
      },
    }) as EvaluateBouquetResult;
    expect(sufficient.feasibility.inventory.status).toBe('feasible');

    const insufficient = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-thuy-tien', quantity: 1 },
      ],
      context: {
        flags: {
          flag_knows_bac_ba_wife_memory: true,
        },
        inventory: { 'hoa-cuc-trang': 1, 'hoa-thuy-tien': 0 },
      },
    }) as EvaluateBouquetResult;
    expect(insufficient.outcome).toBe('resonant');
    expect(insufficient.feasibility.inventory.status).toBe('insufficient');
    expect(insufficient.feasibility.inventory.details?.['hoa-thuy-tien']?.available).toBe(0);
  });

  it('evaluates unlock feasibility independently', () => {
    const unlocked = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
      context: {
        flags: {},
        unlockedFlowerIds: ['hoa-cuc-trang'],
      },
    }) as EvaluateBouquetResult;
    expect(unlocked.feasibility.unlocks.status).toBe('feasible');

    const locked = evaluateInput({
      orderId: orderBacBa.id,
      flowers: [
        { flowerId: 'hoa-cuc-trang', quantity: 1 },
        { flowerId: 'hoa-hoang-tuyen', quantity: 1 },
      ],
      context: {
        flags: {},
        unlockedFlowerIds: ['hoa-cuc-trang'],
      },
    }) as EvaluateBouquetResult;
    expect(locked.feasibility.unlocks.status).toBe('locked');
    expect(locked.feasibility.unlocks.lockedFlowerIds).toContain('hoa-hoang-tuyen');
  });

  it('rejects unknown order ID with NOT_FOUND', () => {
    expect(() =>
      evaluateInput({
        orderId: 'non-existent-order',
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'NOT_FOUND' }));
  });

  it('rejects unknown flower ID with NOT_FOUND', () => {
    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-khong-ton-tai', quantity: 1 }],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'NOT_FOUND' }));
  });

  it('rejects non-integer, negative, zero or non-finite flower quantities with INVALID_INPUT', () => {
    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 0 }],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));

    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 2.5 }],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));

    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: Number.NaN }],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));
  });

  it('rejects total flower quantity exceeding 100 with LIMIT_EXCEEDED', () => {
    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [
          { flowerId: 'hoa-cuc-trang', quantity: 60 },
          { flowerId: 'hoa-thuy-tien', quantity: 41 },
        ],
        context: { flags: {} },
      }),
    ).toThrowError(expect.objectContaining({ code: 'LIMIT_EXCEEDED' }));
  });

  it('rejects missing flags or unknown flags with NOT_FOUND/INVALID_INPUT', () => {
    const invalidContext = {} as { flags: Record<string, boolean> };
    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
        context: invalidContext,
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));

    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
        context: { flags: { unknown_flag_xyz: true } },
      }),
    ).toThrowError(expect.objectContaining({ code: 'NOT_FOUND' }));

    expect(() =>
      evaluateInput({
        orderId: orderBacBa.id,
        flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
        context: { flags: { flag_intro_seen: Number.NaN } },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));
  });
});

describe('simulateInput', () => {
  it('runs initial preset with deterministic savedAt and intro progression', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('completed');
    expect(result.simulation).toBe('isolated');
    expect(result.finalState.flags.flag_intro_seen).toBe(true);
    expect(result.finalState.currentOrderId).toBe('order-01-bac-ba');
    expect(result.finalState.activeDialogueId).toBe('dlg-bacba-01');
    expect(result.trace).toHaveLength(2); // preparation + action 0
    const actionEntry = result.trace[1] as ActionTraceEntry;
    expect(actionEntry.action.type).toBe('advance_dialogue');
  });

  it('plays through direct dialogue, delivers bouquet, triggers result dialogue and auto-starts next order', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
        { type: 'advance_dialogue', choiceId: 'choice-order-01-bac-ba-direct' },
        { type: 'advance_dialogue' },
        {
          type: 'deliver',
          flowers: [
            { flowerId: 'hoa-cuc-trang', quantity: 3 },
          ],
        },
        { type: 'advance_dialogue' }, // advance result dialogue -> clears result, auto-starts order-02-co-lien
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('completed');
    expect(result.finalState.completedOrderIds).toContain('order-01-bac-ba');
    expect(result.finalState.currentOrderId).toBe('order-02-co-lien');
    expect(result.finalState.activeDialogueId).toBe('dlg-colien-01');
    expect(result.finalState.inventory['hoa-cuc-trang']).toBe(27); // started with 30, delivered 3
  });

  it('completes missed delivery exactly-once and rejects retry_missed', () => {
    const state = createInitialGameState();
    state.currentDay = 'day-2';
    state.currentShift = 'living';
    state.flags.flag_intro_seen = true;
    state.unlockedFlowerIds = ['hoa-cuc-trang', 'hoa-hong-do'];
    state.inventory['hoa-cuc-trang'] = 30;
    state.inventory['hoa-hong-do'] = 30;
    state.currentOrderId = 'order-02-01-bac-ba';
    state.activeDialogueId = undefined;

    const result = simulateInput({
      initialState: state,
      actions: [
        {
          type: 'deliver',
          flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 3 }],
        },
        { type: 'retry_missed' },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('error');
    expect(result.failedActionIndex).toBe(1);
    expect(result.error?.code).toBe('ACTION_NOT_ALLOWED');
    expect(result.finalState.completedOrderIds).toContain('order-02-01-bac-ba');
    expect(result.finalState.inventory['hoa-cuc-trang']).toBe(27);
  });

  it('rejects delivery when composition is blocked by active dialogue', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
        // Now at dlg-bacba-01, dialogue is active -> cannot compose
        {
          type: 'deliver',
          flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 1 }],
        },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('error');
    expect(result.failedActionIndex).toBe(1);
    expect(result.error?.code).toBe('ACTION_NOT_ALLOWED');
    expect(result.trace.filter((t) => 'action' in t)).toHaveLength(1); // Only step 0 action succeeded
    expect(result.finalState.activeDialogueId).toBe('dlg-bacba-01');
  });

  it('rejects delivery with locked flowers or insufficient inventory', () => {
    const resultLocked = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
        { type: 'advance_dialogue', choiceId: 'choice-order-01-bac-ba-direct' },
        { type: 'advance_dialogue' },
        {
          type: 'deliver',
          flowers: [{ flowerId: 'hoa-hoang-tuyen', quantity: 1 }], // locked at game start
        },
      ],
    }) as SimulateScenarioResult;

    expect(resultLocked.status).toBe('error');
    expect(resultLocked.failedActionIndex).toBe(3);
    expect(resultLocked.error?.code).toBe('ACTION_NOT_ALLOWED');

    const resultInsufficient = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
        { type: 'advance_dialogue', choiceId: 'choice-order-01-bac-ba-direct' },
        { type: 'advance_dialogue' },
        {
          type: 'deliver',
          flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 50 }], // only 30 in inventory
        },
      ],
    }) as SimulateScenarioResult;

    expect(resultInsufficient.status).toBe('error');
    expect(resultInsufficient.failedActionIndex).toBe(3);
    expect(resultInsufficient.error?.code).toBe('ACTION_NOT_ALLOWED');
  });

  it('rejects retry_missed when no delivery was missed', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'retry_missed' },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('error');
    expect(result.failedActionIndex).toBe(0);
    expect(result.error?.code).toBe('ACTION_NOT_ALLOWED');
  });

  it('validates dialogue choices: rejects invalid choiceId and missing choiceId when choices exist', () => {
    const resultMissingChoice = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue' }, // intro requires choice-intro-start
      ],
    }) as SimulateScenarioResult;

    expect(resultMissingChoice.status).toBe('error');
    expect(resultMissingChoice.failedActionIndex).toBe(0);
    expect(resultMissingChoice.error?.code).toBe('ACTION_NOT_ALLOWED');

    const resultInvalidChoice = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'non-existent-choice' },
      ],
    }) as SimulateScenarioResult;

    expect(resultInvalidChoice.status).toBe('error');
    expect(resultInvalidChoice.failedActionIndex).toBe(0);
    expect(resultInvalidChoice.error?.code).toBe('ACTION_NOT_ALLOWED');
  });

  it('rejects advance_shift when shift is not complete or dialogue is active', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_shift' },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('error');
    expect(result.failedActionIndex).toBe(0);
    expect(result.error?.code).toBe('ACTION_NOT_ALLOWED');
  });

  it('deep-clones input state so caller state is never mutated', () => {
    const baseState = createInitialGameState();
    const originalJson = JSON.stringify(baseState);

    simulateInput({
      initialState: baseState,
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
      ],
    });

    expect(JSON.stringify(baseState)).toBe(originalJson);
  });

  it('rejects more than 50 actions with LIMIT_EXCEEDED', () => {
    const tooManyActions = Array.from({ length: 51 }, () => ({
      type: 'advance_dialogue' as const,
    }));

    expect(() =>
      simulateInput({
        initialState: 'initial',
        actions: tooManyActions,
      }),
    ).toThrowError(expect.objectContaining({ code: 'LIMIT_EXCEEDED' }));
  });

  it('rejects invalid action types with INVALID_INPUT', () => {
    const invalidAction = { type: 'dispatch_arbitrary' } as unknown as { type: 'advance_dialogue' };
    expect(() =>
      simulateInput({
        initialState: 'initial',
        actions: [invalidAction],
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_INPUT' }));
  });

  it('rejects invalid initialState structure with INVALID_STATE', () => {
    const brokenState = { broken: 'not a valid game state' } as unknown as GameState;
    expect(() =>
      simulateInput({
        initialState: brokenState,
        actions: [],
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_STATE' }));
  });

  it('computes stateDiff containing npcProgress changes during scenario delivery', () => {
    const result = simulateInput({
      initialState: 'initial',
      actions: [
        { type: 'advance_dialogue', choiceId: 'choice-intro-start' },
        { type: 'advance_dialogue', choiceId: 'choice-order-01-bac-ba-direct' },
        { type: 'advance_dialogue' },
        {
          type: 'deliver',
          flowers: [{ flowerId: 'hoa-cuc-trang', quantity: 3 }],
          configuration: { vessel: 'bouquet', stemCount: 3 },
          finish: { paper: 'none', ribbon: 'none', bowStep: 0, cardId: null },
        },
      ],
    }) as SimulateScenarioResult;

    expect(result.status).toBe('completed');
    const deliverTrace = result.trace.find(
      (t): t is ActionTraceEntry => 'action' in t && t.action.type === 'deliver',
    );
    expect(deliverTrace).toBeDefined();
    expect(deliverTrace?.stateDiff['npcProgress']).toBeDefined();
  });
});
