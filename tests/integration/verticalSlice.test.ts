import { describe, expect, it } from 'vitest';
import { BouquetModel } from '../../src/game/bouquet/BouquetModel';
import { GameSession, INTRO_DIALOGUE_ID } from '../../src/game/GameSession';
import { createInitialGameState } from '../../src/game/state/GameState';
import { getCardChoices, getFeatures, getOrderArrangement } from '../../src/game/content/progression';
import type { BouquetSubmission } from '../../src/game/content/types';
import type { GameState } from '../../src/game/state/GameState';
import type { LoadResult, SaveRepository } from '../../src/game/save/SaveRepository';

class MemorySaveRepository implements SaveRepository {
  private savedState: GameState | null = null;

  async load(): Promise<LoadResult> {
    if (!this.savedState) return { status: 'empty' };
    return { status: 'loaded', state: JSON.parse(JSON.stringify(this.savedState)), recovered: false };
  }

  async save(state: GameState): Promise<void> {
    this.savedState = JSON.parse(JSON.stringify(state));
  }

  async clear(): Promise<void> {
    this.savedState = null;
  }
}

class FailingSaveRepository extends MemorySaveRepository {
  override async save(): Promise<void> {
    throw new Error('quota exceeded');
  }
}

function advanceUntilCanCompose(session: GameSession, maxSteps = 15): void {
  for (let i = 0; i < maxSteps; i++) {
    if (session.canCompose || !session.currentOrder) break;
    const choices = session.currentChoices;
    if (choices.length > 0) {
      session.advanceDialogue(choices[0].id);
    } else {
      session.advanceDialogue();
    }
  }
}

function makeValidSubmission(session: GameSession, orderId: string): BouquetSubmission {
  const order = session.currentOrder;
  if (!order || order.id !== orderId) {
    throw new Error(`Order ${orderId} is not active in session`);
  }
  const arrangement = getOrderArrangement(order.id);
  const dayFeatures = getFeatures(order.dayId);
  const model = new BouquetModel({
    vessel: arrangement.suggestedVessel,
    stemCount: arrangement.minStems,
  });

  for (const req of order.explicitRequirements) {
    if (req.kind === 'flower') {
      for (let i = 0; i < (req.min ?? 1); i++) {
        if (model.items.length < arrangement.minStems) {
          model.add(req.value);
        }
      }
    }
  }
  const filler = order.explicitRequirements.find((r) => r.kind === 'flower')?.value || session.state.unlockedFlowerIds[0];
  while (model.items.length < arrangement.minStems) {
    model.add(filler);
  }

  if (order.requiredFinish?.paper && dayFeatures.paper) {
    model.setPaper(order.requiredFinish.paper);
  }
  if (order.requiredFinish?.ribbon && dayFeatures.ribbon) {
    model.setRibbon(order.requiredFinish.ribbon);
    model.advanceBow();
    model.advanceBow();
    model.advanceBow();
  }
  if (order.requiredFinish?.requireCard && dayFeatures.cards) {
    const choices = getCardChoices(order.id);
    const targetTone = order.requiredFinish.targetTone;
    const matchingCard = choices.find((c) => c.tone === targetTone) || choices[0];
    model.setCard(matchingCard.id);
  }
  return model.submission;
}

describe('GameSession persistence failures', () => {
  it('reports background save failures', async () => {
    const reported: unknown[] = [];
    const session = new GameSession(undefined, new FailingSaveRepository(), (error) => reported.push(error));
    session.advanceDialogue('choice-intro-start');
    await Promise.resolve();
    await Promise.resolve();
    expect(reported).toHaveLength(1);
    expect(reported[0]).toBeInstanceOf(Error);
  });

  it('preserves prior state when reset persistence rejects', async () => {
    const memoryRepo = new MemorySaveRepository();
    const session = new GameSession(undefined, memoryRepo);
    session.advanceDialogue('choice-intro-start');
    const order1 = session.currentOrder!;
    expect(session.state.flags.flag_intro_seen).toBe(true);
    const priorState = session.state;

    const failingRepo = new FailingSaveRepository();
    const sessionWithFailingRepo = new GameSession(priorState, failingRepo);
    await expect(sessionWithFailingRepo.resetGame()).rejects.toThrow('quota exceeded');
    expect(sessionWithFailingRepo.state.flags.flag_intro_seen).toBe(true);
    expect(sessionWithFailingRepo.state.currentOrderId).toBe(order1.id);
  });
});

describe('Strict BouquetSubmission invariants & exact-once stock', () => {
  it('enforces strict BouquetSubmission validation contracts', () => {
    const session = new GameSession();
    session.advanceDialogue('choice-intro-start');
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    // Non-object submission
    expect(() => session.deliver(null as unknown as BouquetSubmission)).toThrow(/Invalid bouquet submission/);

    // Unconfigured model submission attempt
    const unconfigured = new BouquetModel();
    expect(() => session.deliver(unconfigured as unknown as BouquetSubmission)).toThrow();

    // Incomplete stems submission attempt
    const incompleteModel = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
    incompleteModel.add('hoa-cuc-trang');
    expect(() => incompleteModel.submission).toThrow(/not full/);

    // Locked flower attempt
    const lockedFlowerModel = new BouquetModel({ vessel: 'bouquet', stemCount: 3 });
    lockedFlowerModel.add('hoa-luu-ly');
    lockedFlowerModel.add('hoa-luu-ly');
    lockedFlowerModel.add('hoa-luu-ly');
    expect(() => session.deliver(lockedFlowerModel.submission)).toThrow(/Flower is locked/);
    // Finish ribbon bow incomplete
    const modelWithRibbon = new BouquetModel({ vessel: 'bouquet', stemCount: 3 });
    modelWithRibbon.add('hoa-cuc-trang');
    modelWithRibbon.add('hoa-cuc-trang');
    modelWithRibbon.add('hoa-cuc-trang');
    modelWithRibbon.setRibbon('sage'); // bowStep = 0
    expect(() => session.deliver(modelWithRibbon.submission)).toThrow();
  });

  it('refuses delivery during ongoing dialogue and preserves state atomically', () => {
    const session = new GameSession();
    session.advanceDialogue('choice-intro-start');
    const order = session.currentOrder!;
    expect(order.id).toBe('order-01-bac-ba');
    expect(session.dialogue?.id).toBe(order.openingDialogueId);
    expect(session.canCompose).toBe(false);

    const initialInventory = { ...session.state.inventory };
    const initialCompleted = [...session.state.completedOrderIds];
    const initialAffinity = session.state.npcProgress['bac-ba'].affinity;

    // Prepare valid submission
    const validSubmission = makeValidSubmission(session, order.id);

    // 1. Attempt delivery during opening dialogue
    expect(() => session.deliver(validSubmission)).toThrow('Cannot deliver bouquet while dialogue is active.');
    expect(session.state.inventory).toEqual(initialInventory);
    expect(session.state.completedOrderIds).toEqual(initialCompleted);
    expect(session.state.npcProgress['bac-ba'].affinity).toBe(initialAffinity);

    // 2. Request order detail -> detail dialogue is active
    session.requestOrderDetail();
    expect(session.dialogue?.id).toBe('dlg-order-01-bac-ba-detail');
    expect(session.canCompose).toBe(false);
    expect(() => session.deliver(validSubmission)).toThrow('Cannot deliver bouquet while dialogue is active.');
    expect(session.state.inventory).toEqual(initialInventory);
    expect(session.state.completedOrderIds).toEqual(initialCompleted);

    // 3. Test delivery rejection during result dialogue
    const resultDialogueState: GameState = {
      ...session.state,
      activeDialogueId: order.resultDialogueIds.accepted,
    };
    const sessionWithResultDialogue = new GameSession(resultDialogueState);
    expect(sessionWithResultDialogue.canCompose).toBe(false);
    expect(() => sessionWithResultDialogue.deliver(validSubmission)).toThrow('Cannot deliver bouquet while dialogue is active.');
    expect(session.state.inventory).toEqual(initialInventory);
    expect(session.state.completedOrderIds).toEqual(initialCompleted);
    // Finish dialogue to reach compose state
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    // Deliver successfully
    const result = session.deliver(validSubmission);
    expect(result.outcome).toMatch(/accepted|resonant/);
    expect(session.state.completedOrderIds).toContain(order.id);
  });

  it('validates exact finish enums, bow steps, authored cards, and stem poses with zero state mutation', () => {
    const session = new GameSession();
    session.advanceDialogue('choice-intro-start');
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    const baseSubmission = makeValidSubmission(session, 'order-01-bac-ba');
    const initialInventory = { ...session.state.inventory };
    const initialCompleted = [...session.state.completedOrderIds];
    const initialAffinity = session.state.npcProgress['bac-ba'].affinity;

    // Invalid paper enum
    expect(() =>
      session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, paper: 'plastic' as unknown as 'kraft' },
      }),
    ).toThrow(/Invalid wrapping paper/);

    // Invalid ribbon enum
    expect(() =>
      session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, ribbon: 'silk' as unknown as 'sage' },
      }),
    ).toThrow(/Invalid ribbon/);

    // Invalid bowStep
    expect(() =>
      session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, bowStep: 5 as unknown as 0 },
      }),
    ).toThrow(/Invalid bowStep/);

    // bowStep > 0 when ribbon is none
    expect(() =>
      session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, ribbon: 'none', bowStep: 2 as unknown as 0 },
      }),
    ).toThrow(/Bow step must be 0 when ribbon is none/);

    // On Day 1 cards are not unlocked yet, so test that card delivery throws card not unlocked
    expect(() =>
      session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, cardId: 'unauthored-card-id' },
      }),
    ).toThrow('Cards are not unlocked yet.');

    // Construct Day 4 session where cards are unlocked to test card boundary validation
    const day4State: GameState = {
      ...session.state,
      currentDay: 'day-4',
    };
    const day4Session = new GameSession(day4State);

    // Non-authored card ID
    expect(() =>
      day4Session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, cardId: 'unauthored-card-id' },
      }),
    ).toThrow(/not an authored choice/);

    // Non-string card ID
    expect(() =>
      day4Session.deliver({
        ...baseSubmission,
        finish: { ...baseSubmission.finish, cardId: 12345 as unknown as string },
      }),
    ).toThrow(/Invalid card ID/);
    // Missing / invalid pose
    const missingPoseItems = baseSubmission.items.map((it, idx) =>
      idx === 0 ? ({ ...it, pose: undefined } as unknown as typeof it) : it,
    );
    expect(() =>
      session.deliver({
        ...baseSubmission,
        items: missingPoseItems,
      }),
    ).toThrow(/Invalid or missing pose/);

    const invalidPoseItems = baseSubmission.items.map((it, idx) =>
      idx === 0 ? ({ ...it, pose: 'diagonal' } as unknown as typeof it) : it,
    );
    expect(() =>
      session.deliver({
        ...baseSubmission,
        items: invalidPoseItems,
      }),
    ).toThrow(/Invalid or missing pose/);

    // Non-finite coordinates
    const invalidCoordItems = baseSubmission.items.map((it, idx) =>
      idx === 0 ? { ...it, position: { x: NaN, y: 0 } } : it,
    );
    expect(() =>
      session.deliver({
        ...baseSubmission,
        items: invalidCoordItems,
      }),
    ).toThrow(/finite coordinates/);

    // Duplicate stem item id
    const duplicateIdItems = baseSubmission.items.map((it) => ({ ...it, id: 'stem-dup-id' }));
    expect(() =>
      session.deliver({
        ...baseSubmission,
        items: duplicateIdItems,
      }),
    ).toThrow(/Duplicate stem item id/);

    // Verify zero state mutation across all rejections
    expect(session.state.inventory).toEqual(initialInventory);
    expect(session.state.completedOrderIds).toEqual(initialCompleted);
    expect(session.state.npcProgress['bac-ba'].affinity).toBe(initialAffinity);
  });

  it('charges inventory exactly once per bouquet flower and prevents duplicate delivery', () => {
    const session = new GameSession();
    session.advanceDialogue('choice-intro-start');
    advanceUntilCanCompose(session);

    const initialStock = session.state.inventory['hoa-cuc-trang'];
    expect(initialStock).toBe(30);

    const submission = makeValidSubmission(session, 'order-01-bac-ba');
    const stemCount = submission.items.length;
    expect(stemCount).toBe(3);

    const result = session.deliver(submission);
    expect(result.outcome).toBe('accepted');
    expect(session.state.inventory['hoa-cuc-trang']).toBe(initialStock - stemCount);
    expect(session.state.completedOrderIds).toContain('order-01-bac-ba');

    // Duplicate delivery on same order must throw
    expect(() => session.deliver(submission)).toThrow(/already been delivered/);
  });
});

describe('Vertical Slice Integration: Full 6-Day Loop & Branch Routing', () => {
  it('completes the good route across all 6 days to demo completion', async () => {
    const saveRepo = new MemorySaveRepository();
    const session = new GameSession(undefined, saveRepo);

    expect(session.state.currentDay).toBe('day-1');
    expect(session.state.currentShift).toBe('living');
    expect(session.dialogue?.id).toBe(INTRO_DIALOGUE_ID);

    session.advanceDialogue('choice-intro-start');
    expect(session.state.flags.flag_intro_seen).toBe(true);

    for (let day = 1; day <= 6; day++) {
      // Living shift orders
      const livingOrders = session.getOrdersForCurrentShift();
      for (const order of livingOrders) {
        if (session.currentOrder?.id !== order.id) {
          session.startOrder(order.id);
        }
        advanceUntilCanCompose(session);
        expect(session.canCompose).toBe(true);

        const sub = makeValidSubmission(session, order.id);
        const res = session.deliver(sub);
        expect(res.outcome).toMatch(/accepted|resonant/);
        session.advanceDialogue(); // dismiss result dialogue
      }

      expect(session.isShiftComplete).toBe(true);
      session.advanceShift(); // advance to dead

      // Dead shift orders
      const deadOrders = session.getOrdersForCurrentShift();
      for (const order of deadOrders) {
        if (session.currentOrder?.id !== order.id) {
          session.startOrder(order.id);
        }
        advanceUntilCanCompose(session);
        expect(session.canCompose).toBe(true);

        const sub = makeValidSubmission(session, order.id);
        const res = session.deliver(sub);
        expect(res.outcome).toMatch(/accepted|resonant/);
        session.advanceDialogue();
      }

      expect(session.isShiftComplete).toBe(true);

      if (day === 3) {
        // After Day 3, high affinity qualifies the good branch
        expect(session.state.npcProgress['bac-ba'].affinity).toBeGreaterThanOrEqual(70);
      }

      if (day < 6) {
        session.advanceShift(); // advance to next day living
      }
    }

    // Day 4 active branch must be good
    expect(session.state.npcProgress['bac-ba'].activeBranch).toBe('good');
    expect(session.state.completedOrderIds).toHaveLength(24);
    expect(session.complete).toBe(true);
    expect(session.isDemoComplete).toBe(true);

    // Reset game cleans up back to initial state
    await session.resetGame();
    expect(session.state.completedOrderIds).toHaveLength(0);
    expect(session.state.currentDay).toBe('day-1');
    expect(session.state.currentShift).toBe('living');
  });

  it('runs strained route from Day 4 and completes through Day 6', () => {
    const state = createInitialGameState();
    state.flags.flag_intro_seen = true;
    state.completedOrderIds = [
      'order-01-bac-ba', 'order-02-co-lien', 'order-01-chu-tu', 'order-03-linh-hon',
      'order-02-01-bac-ba', 'order-02-02-co-lien', 'order-04-chu-tu', 'order-02-04-linh-hon',
      'order-03-01-bac-ba', 'order-03-02-co-lien', 'order-03-03-chu-tu', 'order-03-04-linh-hon',
    ];
    state.currentDay = 'day-4';
    state.currentShift = 'living';
    state.unlockedFlowerIds = ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong', 'hoa-sen-hong'];
    for (const f of state.unlockedFlowerIds) state.inventory[f] = 30;

    for (const customerId of Object.keys(state.npcProgress)) {
      state.npcProgress[customerId].activeBranch = 'strained';
      state.npcProgress[customerId].completedDeliveries = 3;
      state.npcProgress[customerId].affinity = 15;
      state.relationshipScores[customerId] = 15;
    }

    const session = new GameSession(state);
    expect(session.state.npcProgress['bac-ba'].activeBranch).toBe('strained');

    for (let day = 4; day <= 6; day++) {
      const livingOrders = session.getOrdersForCurrentShift();
      for (const order of livingOrders) {
        expect(order.branch).toBe('strained');
        if (session.currentOrder?.id !== order.id) {
          session.startOrder(order.id);
        }
        advanceUntilCanCompose(session);
        const sub = makeValidSubmission(session, order.id);
        session.deliver(sub);
        session.advanceDialogue();
      }

      session.advanceShift();

      const deadOrders = session.getOrdersForCurrentShift();
      for (const order of deadOrders) {
        expect(order.branch).toBe('strained');
        if (session.currentOrder?.id !== order.id) {
          session.startOrder(order.id);
        }
        advanceUntilCanCompose(session);
        const sub = makeValidSubmission(session, order.id);
        session.deliver(sub);
        session.advanceDialogue();
      }

      if (day < 6) {
        session.advanceShift();
      }
    }

    expect(session.state.completedOrderIds).toHaveLength(24);
    expect(session.complete).toBe(true);
    expect(session.isDemoComplete).toBe(true);
  });
});
