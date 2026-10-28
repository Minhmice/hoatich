import { describe, expect, it } from 'vitest';
import { createInitialGameState, type GameState } from '../../src/game/state/GameState';
import { reduceGameState } from '../../src/game/state/stateReducer';
import { GameSession } from '../../src/game/GameSession';

describe('affinity progression state', () => {
  it('starts at 50, clamps deltas, queues branch after three deliveries, activates next day only', () => {
    let state = createInitialGameState();
    expect(state.npcProgress['bac-ba'].affinity).toBe(50);

    for (const orderId of ['order-01-bac-ba', 'order-02-01-bac-ba', 'order-03-01-bac-ba']) {
      state = reduceGameState(state, {
        type: 'completeOrder',
        orderId,
        bouquetFlowerIds: [],
        effects: [],
        outcome: 'resonant',
      });
    }

    expect(state.npcProgress['bac-ba'].affinity).toBe(95);
    expect(state.npcProgress['bac-ba'].queuedBranch).toBe('good');
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');

    // Dead shift does not activate branch
    state = reduceGameState(state, { type: 'advanceShift', shift: 'dead' });
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');

    // Living shift on next day activates queued branch
    state = reduceGameState(state, { type: 'advanceShift', shift: 'living', dayId: 'day-2' });
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('good');
    expect(state.npcProgress['bac-ba'].queuedBranch).toBeNull();
  });

  it('qualifies strained branch when affinity <= 30 after three deliveries and activates next day living only', () => {
    let state = createInitialGameState();
    expect(state.npcProgress['bac-ba'].affinity).toBe(50);

    for (const orderId of ['order-01-bac-ba', 'order-02-01-bac-ba', 'order-03-01-bac-ba']) {
      state = reduceGameState(state, {
        type: 'completeOrder',
        orderId,
        bouquetFlowerIds: [],
        effects: [],
        outcome: 'missed',
      });
    }

    // 50 - 12 * 3 = 14 (<= 30)
    expect(state.npcProgress['bac-ba'].affinity).toBe(14);
    expect(state.npcProgress['bac-ba'].queuedBranch).toBe('strained');
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');

    // Dead shift does not activate branch
    state = reduceGameState(state, { type: 'advanceShift', shift: 'dead' });
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');

    // Living shift on next day activates queued strained branch
    state = reduceGameState(state, { type: 'advanceShift', shift: 'living', dayId: 'day-2' });
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('strained');
    expect(state.npcProgress['bac-ba'].queuedBranch).toBeNull();
  });

  it('retains neutral branch when affinity stays between 31 and 69 after three deliveries', () => {
    let state = createInitialGameState();
    expect(state.npcProgress['bac-ba'].affinity).toBe(50);

    // 1 accepted (+8), 1 missed (-12), 1 accepted (+8) -> 54
    const outcomes: Array<'accepted' | 'missed'> = ['accepted', 'missed', 'accepted'];
    const orderIds = ['order-01-bac-ba', 'order-02-01-bac-ba', 'order-03-01-bac-ba'];

    for (let i = 0; i < 3; i++) {
      state = reduceGameState(state, {
        type: 'completeOrder',
        orderId: orderIds[i],
        bouquetFlowerIds: [],
        effects: [],
        outcome: outcomes[i],
      });
    }

    expect(state.npcProgress['bac-ba'].affinity).toBe(54);
    expect(state.npcProgress['bac-ba'].queuedBranch).toBeNull();
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');

    state = reduceGameState(state, { type: 'advanceShift', shift: 'living', dayId: 'day-2' });
    expect(state.npcProgress['bac-ba'].activeBranch).toBe('neutral');
  });

  it('clamps affinity strictly to bounds 0 and 100', () => {
    const downOrderIds = [
      'order-01-bac-ba',
      'order-02-01-bac-ba',
      'order-03-01-bac-ba',
      'order-04-01-bac-ba',
      'order-05-01-bac-ba',
    ];

    let stateDown = createInitialGameState();
    // Drive down to 0 using distinct orders
    for (const orderId of downOrderIds) {
      stateDown = reduceGameState(stateDown, {
        type: 'completeOrder',
        orderId,
        bouquetFlowerIds: [],
        effects: [],
        outcome: 'missed',
      });
    }
    expect(stateDown.npcProgress['bac-ba'].affinity).toBe(0);
    expect(stateDown.relationshipScores['bac-ba']).toBe(0);

    const upOrderIds = [
      'order-01-bac-ba',
      'order-02-01-bac-ba',
      'order-03-01-bac-ba',
      'order-04-01-bac-ba',
    ];

    let stateUp = createInitialGameState();
    // Drive up to 100 using distinct orders: 50 + 15 * 4 = 110 -> clamped to 100
    for (const orderId of upOrderIds) {
      stateUp = reduceGameState(stateUp, {
        type: 'completeOrder',
        orderId,
        bouquetFlowerIds: [],
        effects: [],
        outcome: 'resonant',
      });
    }
    expect(stateUp.npcProgress['bac-ba'].affinity).toBe(100);
    expect(stateUp.relationshipScores['bac-ba']).toBe(100);
  });

  it('prevents Day 4 branch softlock: isShiftComplete only checks active branch orders for the shift', () => {
    const state = createInitialGameState();
    state.currentDay = 'day-4';
    state.currentShift = 'living';
    state.npcProgress['bac-ba'].activeBranch = 'good';
    state.npcProgress['co-lien'].activeBranch = 'strained';

    const session = new GameSession(state);

    const shiftOrders = session.getOrdersForCurrentShift();
    // 3 living orders for Day 4 matching active branches for bac-ba, co-lien, and chu-tu
    expect(shiftOrders).toHaveLength(3);
    expect(shiftOrders[0].id).toBe('order-04-01-bac-ba-good');
    expect(shiftOrders[1].id).toBe('order-04-02-co-lien-strained');
    expect(shiftOrders[2].id).toBe('order-04-03-chu-tu');

    expect(session.isShiftComplete).toBe(false);

    // Mark active orders completed
    state.completedOrderIds.push('order-04-01-bac-ba-good');
    expect(session.isShiftComplete).toBe(false);

    state.completedOrderIds.push('order-04-02-co-lien-strained');
    expect(session.isShiftComplete).toBe(false);

    state.completedOrderIds.push('order-04-03-chu-tu');
    // Now shift is complete even though unselected branch alternative orders are not completed
    expect(session.isShiftComplete).toBe(true);
    expect(() => session.advanceShift()).not.toThrow();
    expect(session.state.currentShift).toBe('dead');
  });

  it('ensures delivery effects are idempotent and cannot be applied twice on reload', () => {
    let state = createInitialGameState();
    state = reduceGameState(state, {
      type: 'completeOrder',
      orderId: 'order-01-bac-ba',
      bouquetFlowerIds: ['hoa-cuc-trang'],
      effects: [
        { type: 'relationship', customerId: 'bac-ba', amount: 8 },
        { type: 'unlockFlower', flowerId: 'hoa-hong-do' },
      ],
      outcome: 'accepted',
    });

    const stockAfterFirst = state.inventory['hoa-cuc-trang'];
    const affinityAfterFirst = state.npcProgress['bac-ba'].affinity;

    // Simulate duplicate event delivery (e.g., from network/save retry)
    state = reduceGameState(state, {
      type: 'completeOrder',
      orderId: 'order-01-bac-ba',
      bouquetFlowerIds: ['hoa-cuc-trang'],
      effects: [
        { type: 'relationship', customerId: 'bac-ba', amount: 8 },
        { type: 'unlockFlower', flowerId: 'hoa-hong-do' },
      ],
      outcome: 'accepted',
    });

    expect(state.inventory['hoa-cuc-trang']).toBe(stockAfterFirst);
    expect(state.npcProgress['bac-ba'].affinity).toBe(affinityAfterFirst);
    expect(state.completedOrderIds.filter((id) => id === 'order-01-bac-ba')).toHaveLength(1);
  });

  it('preserves historical completed branch when relationship branch changes after Day 4, allowing full demo completion', () => {
    const state = createInitialGameState();
    state.completedOrderIds = [
      'order-01-bac-ba',
      'order-02-co-lien',
      'order-03-linh-hon',
      'order-02-01-bac-ba',
      'order-02-02-co-lien',
      'order-04-chu-tu',
      'order-02-04-linh-hon',
      'order-03-01-bac-ba',
      'order-03-02-co-lien',
      'order-03-03-chu-tu',
      'order-03-04-linh-hon',
      'order-04-01-bac-ba',
      'order-04-02-co-lien',
      'order-04-03-chu-tu',
      'order-04-04-linh-hon',
    ];
    state.currentDay = 'day-4';
    state.currentShift = 'dead';
    state.npcProgress['co-lien'].affinity = 85;
    state.npcProgress['co-lien'].completedDeliveries = 4;
    state.npcProgress['co-lien'].activeBranch = 'neutral';
    state.npcProgress['co-lien'].queuedBranch = 'good';

    const session = new GameSession(state);

    session.advanceShift();
    expect(session.state.currentDay).toBe('day-5');
    expect(session.state.currentShift).toBe('living');
    expect(session.state.npcProgress['co-lien'].activeBranch).toBe('good');

    const playable = session.getPlayableOrders();
    const playableIds = playable.map((o) => o.id);
    expect(playableIds).toContain('order-04-02-co-lien');
    expect(playableIds).not.toContain('order-04-02-co-lien-good');
    expect(playableIds).toContain('order-05-02-co-lien-good');
    expect(playableIds).not.toContain('order-05-02-co-lien');

    const completedState: GameState = {
      ...session.state,
      completedOrderIds: playableIds,
      activeDialogueId: undefined,
    };
    const completedSession = new GameSession(completedState);

    expect(completedSession.complete).toBe(true);
    expect(completedSession.isDemoComplete).toBe(true);
  });
});
