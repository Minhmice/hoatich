import { describe, expect, it } from 'vitest';
import { BouquetModel } from '../../src/game/bouquet/BouquetModel';
import { GameSession, INTRO_DIALOGUE_ID } from '../../src/game/GameSession';
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

describe('Vertical Slice Integration: GameSession & 4-Order Narrative Loop', () => {
  it('runs the full vertical slice: intro, dialogue choices, bouquet composition, 3 outcomes, reload persistence, shift and day cycle, and demo completion', async () => {
    const saveRepo = new MemorySaveRepository();
    const session = new GameSession(undefined, saveRepo);

    // --- 1. Initial State & Intro Greeting ---
    expect(session.state.currentDay).toBe('day-1');
    expect(session.state.currentShift).toBe('living');
    expect(session.state.completedOrderIds).toHaveLength(0);
    expect(session.state.flags.flag_intro_seen).toBeUndefined();

    // Initial greeting presents aunt's shop creed and night perception
    expect(session.dialogue?.id).toBe(INTRO_DIALOGUE_ID);
    expect(session.dialogue?.speakerId).toBe('player');

    // Advance intro: unlocks creed into journal and automatically starts first order
    const introStep = session.advanceDialogue('choice-intro-start');
    expect(introStep.isFinished).toBe(false);
    expect(session.state.flags.flag_intro_seen).toBe(true);
    expect(session.state.journalEntryIds).toContain('journal_aunt_shop_creed');
    expect(session.currentOrder?.id).toBe('order-01-bac-ba');

    // --- 2. Order 1: Bác Ba (Day 1 - Living shift, deceased recipient) ---
    expect(session.dialogue?.id).toBe('dlg-bacba-01');
    // Inquire about wife memory (sets flag_knows_bac_ba_wife_memory)
    session.advanceDialogue('choice-bacba-01-memory');
    expect(session.state.flags.flag_knows_bac_ba_wife_memory).toBe(true);

    // Walk through advice to ready node
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);
    expect(session.currentOrder?.id).toBe('order-01-bac-ba');

    // 2A. Test MISSED outcome (taboo: dead flower in living shift order, or wrong flowers)
    const missedBouquet = new BouquetModel();
    // Add hoa-hong-do instead of required hoa-cuc-trang
    missedBouquet.add('hoa-hong-do');
    const missedResult = session.deliver(missedBouquet);
    expect(missedResult.outcome).toBe('missed');
    expect(session.dialogue?.id).toBe('dlg-bacba-result-missed');
    // On missed, inventory is not consumed and order is not completed so player can retry
    expect(session.state.completedOrderIds).not.toContain('order-01-bac-ba');
    expect(session.state.inventory['hoa-hong-do']).toBe(12);

    // Player retries order
    session.retryMissed();
    expect(session.dialogue?.id).toBe('dlg-bacba-01');

    // Fast-forward to ready node
    session.advanceDialogue('choice-bacba-01-memory');
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    // 2B. Test RESONANT outcome (hoa-cuc-trang + hoa-thuy-tien with memory flag)
    const resonantBouquet1 = new BouquetModel();
    resonantBouquet1.add('hoa-cuc-trang');
    resonantBouquet1.add('hoa-thuy-tien');

    const result1 = session.deliver(resonantBouquet1);
    expect(result1.outcome).toBe('resonant');
    expect(result1.matchedRuleIds).toContain('rule-bacba-thuytien');
    expect(session.state.completedOrderIds).toContain('order-01-bac-ba');
    expect(session.state.inventory['hoa-cuc-trang']).toBe(11);
    expect(session.state.inventory['hoa-thuy-tien']).toBe(11);
    expect(session.state.relationshipScores['bac-ba']).toBeGreaterThanOrEqual(15);
    expect(session.dialogue?.id).toBe('dlg-bacba-result-resonant');

    // Dismiss result dialogue
    session.advanceDialogue();
    expect(session.currentOrder).toBeUndefined();

    // Shift cannot advance yet because Order 2 in Day 1 Living is still required
    expect(session.isShiftComplete).toBe(false);
    expect(() => session.advanceShift()).toThrow(/Chưa hoàn thành/);

    // --- 3. Order 2: Cô Liên (Day 1 - Living shift, living recipient) ---
    const order2 = session.startOrder('order-02-co-lien');
    expect(order2.id).toBe('order-02-co-lien');
    expect(session.dialogue?.id).toBe('dlg-colien-01');

    // Choose direct order path
    session.advanceDialogue('choice-colien-01-bright');
    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    // Deliver ACCEPTED bouquet (hoa-huong-duong meets explicit requirement)
    const acceptedBouquet2 = new BouquetModel();
    acceptedBouquet2.add('hoa-huong-duong');
    const result2 = session.deliver(acceptedBouquet2);
    expect(result2.outcome).toBe('accepted');
    expect(session.state.completedOrderIds).toContain('order-02-co-lien');
    expect(session.state.inventory['hoa-huong-duong']).toBe(11);
    expect(session.dialogue?.id).toBe('dlg-colien-result-accepted');

    // Dismiss result dialogue
    session.advanceDialogue();
    expect(session.currentOrder).toBeUndefined();

    // Now Day 1 Living shift is complete!
    expect(session.isShiftComplete).toBe(true);

    // Advance shift to 'dead'
    const shiftTransition1 = session.advanceShift();
    expect(shiftTransition1.shift).toBe('dead');
    expect(session.state.currentShift).toBe('dead');
    expect(session.state.currentDay).toBe('day-1');

    // --- 4. Order 3: Hồn Thi Sĩ (Day 1 - Dead shift, deceased recipient) ---
    const order3 = session.startOrder('order-03-linh-hon');
    expect(order3.id).toBe('order-03-linh-hon');
    expect(session.dialogue?.id).toBe('dlg-spirit-01');

    // Backstory choice unlocks poem truth flag
    session.advanceDialogue('choice-spirit-01-story');
    expect(session.state.flags.flag_knows_spirit_poem_truth).toBe(true);
    advanceUntilCanCompose(session);
    expect(session.state.unlockedFlowerIds).toContain('hoa-hoang-tuyen');
    expect(session.state.unlockedFlowerIds).toContain('hoa-da-ngan');
    expect(session.state.journalEntryIds).toContain('journal_aunt_hoang_tuyen');
    expect(session.state.journalEntryIds).toContain('journal_aunt_da_ngan');
    expect(session.state.inventory['hoa-hoang-tuyen']).toBe(12);
    expect(session.state.inventory['hoa-da-ngan']).toBe(12);
    expect(session.canCompose).toBe(true);

    // --- 4B. Reload / Persistence Check: No Duplication Rewards or Stock Inflation ---
    const reloaded = new GameSession(session.state, saveRepo);
    expect(reloaded.state.inventory['hoa-hoang-tuyen']).toBe(12);
    expect(reloaded.state.inventory['hoa-da-ngan']).toBe(12);
    expect(reloaded.state.unlockedFlowerIds.filter((id) => id === 'hoa-hoang-tuyen')).toHaveLength(1);
    expect(reloaded.currentOrder?.id).toBe('order-03-linh-hon');
    expect(reloaded.canCompose).toBe(true);

    // Deliver RESONANT bouquet with both unlocked fictional flowers
    const resonantBouquet3 = new BouquetModel();
    resonantBouquet3.add('hoa-hoang-tuyen');
    resonantBouquet3.add('hoa-da-ngan');

    const result3 = reloaded.deliver(resonantBouquet3);
    expect(result3.outcome).toBe('resonant');
    expect(result3.matchedRuleIds).toContain('rule-spirit-dangan');
    expect(reloaded.state.completedOrderIds).toContain('order-03-linh-hon');
    expect(reloaded.state.inventory['hoa-hoang-tuyen']).toBe(11);
    expect(reloaded.state.inventory['hoa-da-ngan']).toBe(11);
    expect(reloaded.dialogue?.id).toBe('dlg-spirit-result-resonant');

    reloaded.advanceDialogue();
    expect(reloaded.isShiftComplete).toBe(true);

    // Advance shift from dead: advances to Day 2 in living shift!
    const shiftTransition2 = reloaded.advanceShift();
    expect(shiftTransition2.shift).toBe('living');
    expect(shiftTransition2.dayId).toBe('day-2');
    expect(reloaded.state.currentDay).toBe('day-2');
    expect(reloaded.state.currentShift).toBe('living');

    // --- 5. Order 4: Chú Tư Xe Ôm (Day 2 - Living shift, living recipient) ---
    const order4 = reloaded.startOrder('order-04-chu-tu');
    expect(order4.id).toBe('order-04-chu-tu');
    expect(reloaded.dialogue?.id).toBe('dlg-chutu-01');

    // Discover wife favorite story
    reloaded.advanceDialogue('choice-chutu-01-secret');
    expect(reloaded.state.flags.flag_knows_chu_tu_wife_favorite).toBe(true);

    advanceUntilCanCompose(reloaded);
    expect(reloaded.canCompose).toBe(true);

    // Deliver RESONANT bouquet (hoa-hong-do + hoa-huong-duong)
    const resonantBouquet4 = new BouquetModel();
    resonantBouquet4.add('hoa-hong-do');
    resonantBouquet4.add('hoa-huong-duong');

    const result4 = reloaded.deliver(resonantBouquet4);
    expect(result4.outcome).toBe('resonant');
    expect(result4.matchedRuleIds).toContain('rule-chutu-huongduong');
    expect(reloaded.state.completedOrderIds).toContain('order-04-chu-tu');
    expect(reloaded.complete).toBe(true);
    expect(reloaded.isDemoComplete).toBe(false);
    expect(reloaded.dialogue?.id).toBe(result4.resultDialogueId);

    // Checkpoint reload mid-reaction preserves reaction dialogue and isDemoComplete is false
    const loadRes = await saveRepo.load();
    const reloadedMidReaction = new GameSession(loadRes.status === 'loaded' ? loadRes.state : undefined, saveRepo);
    expect(reloadedMidReaction.complete).toBe(true);
    expect(reloadedMidReaction.isDemoComplete).toBe(false);
    expect(reloadedMidReaction.dialogue?.id).toBe(result4.resultDialogueId);

    reloaded.advanceDialogue(); // dismiss result dialogue

    // --- 6. Demo Complete ---
    expect(reloaded.isDemoComplete).toBe(true);
    expect(reloaded.complete).toBe(true);
    expect(reloaded.progress).toEqual({ completed: 4, total: 4 });
    // --- 7. Reset Game (New Game Confirm) ---
    await reloaded.resetGame();
    expect(reloaded.state.completedOrderIds).toHaveLength(0);
    expect(reloaded.state.currentDay).toBe('day-1');
    expect(reloaded.state.currentShift).toBe('living');
    expect(reloaded.progress).toEqual({ completed: 0, total: 4 });
  });

  it('restocks consumed flowers across shifts so order 1 using 12 roses does not block day 2', async () => {
    const session = new GameSession();
    session.advanceDialogue('choice-intro-start');

    advanceUntilCanCompose(session);
    expect(session.canCompose).toBe(true);

    // Compose order 1 with 1 hoa-cuc-trang and ALL 12 hoa-hong-do
    const order1Bouquet = new BouquetModel();
    order1Bouquet.add('hoa-cuc-trang');
    for (let i = 0; i < 12; i++) {
      order1Bouquet.add('hoa-hong-do');
    }
    const result1 = session.deliver(order1Bouquet);
    expect(result1.outcome).toBe('accepted');
    expect(session.state.inventory['hoa-hong-do']).toBe(0);

    session.advanceDialogue(); // dismiss result

    // Complete order 2 (Co Lien)
    session.startOrder();
    advanceUntilCanCompose(session);
    const order2Bouquet = new BouquetModel();
    order2Bouquet.add('hoa-huong-duong');
    session.deliver(order2Bouquet);
    session.advanceDialogue();

    expect(session.isShiftComplete).toBe(true);

    // Advance shift from day-1 living to day-1 dead
    session.advanceShift();
    expect(session.state.currentShift).toBe('dead');
    expect(session.state.inventory['hoa-hong-do']).toBe(12);

    // Complete order 3 (Aunt Spirit in dead shift)
    session.startOrder('order-03-linh-hon');
    session.advanceDialogue('choice-spirit-01-story');
    advanceUntilCanCompose(session);
    const order3Bouquet = new BouquetModel();
    order3Bouquet.add('hoa-hoang-tuyen');
    order3Bouquet.add('hoa-da-ngan');
    session.deliver(order3Bouquet);
    session.advanceDialogue();
    // Advance shift from day-1 dead to day-2 living
    session.advanceShift();
    expect(session.state.currentDay).toBe('day-2');
    expect(session.state.currentShift).toBe('living');
    expect(session.state.inventory['hoa-hong-do']).toBe(12);

    // Order 4 (Chu Tu) requires hoa-hong-do
    session.startOrder();
    advanceUntilCanCompose(session);
    const order4Bouquet = new BouquetModel();
    order4Bouquet.add('hoa-hong-do');
    const result4 = session.deliver(order4Bouquet);
    expect(result4.outcome).toBe('accepted');
    expect(session.state.completedOrderIds).toContain('order-04-chu-tu');
  });
});
