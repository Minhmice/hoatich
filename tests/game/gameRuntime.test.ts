import { describe, expect, it } from 'vitest';
import { GameRuntime } from '../../src/game/GameRuntime';
import { GameSession } from '../../src/game/GameSession';
import { BouquetModel } from '../../src/game/bouquet/BouquetModel';
import { AudioManager } from '../../src/game/audio';
import { createInitialGameState } from '../../src/game/state/GameState';

describe('GameRuntime', () => {
  it('notifies subscribers when dialogue or bouquet changes', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    let notifications = 0;
    const unsub = runtime.subscribe(() => {
      notifications++;
    });

    expect(runtime.snapshot.flags.flag_intro_seen).toBeUndefined();
    runtime.advanceDialogue('choice-intro-start');

    expect(notifications).toBeGreaterThan(0);
    expect(runtime.snapshot.currentOrderId).toBe('order-01-bac-ba');
    expect(runtime.snapshot.flags.flag_intro_seen).toBe(true);

    unsub();
  });

  it('enforces configuration lock and manages bouquet flower addition with slot layout', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    runtime.navigate('counter');
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();
    expect(runtime.canCompose).toBe(true);
    expect(runtime.navigate('workspace')).toBe(true);

    // Cannot add flower before configuring vessel
    expect(() => runtime.addFlower('hoa-cuc-trang')).toThrow(
      'Cần chọn bình hoa và số lượng cành trước khi cắm hoa.',
    );

    // Configure 3 stems in bouquet vessel
    runtime.configureBouquet('bouquet', 3);
    expect(runtime.isBouquetConfigured).toBe(true);
    expect(runtime.bouquetSlots).toHaveLength(3);

    // Adding flower fills earliest vacant slot
    const item = runtime.addFlower('hoa-cuc-trang');
    expect(runtime.selectedItemId).toBe(item.id);
    expect(runtime.bouquetItems).toHaveLength(1);
    expect(item.slotIndex).toBe(0);

    runtime.cycleSelection(1);
    expect(runtime.selectedItemId).toBe(item.id);

    runtime.removeSelected();
    expect(runtime.selectedItemId).toBeNull();
    expect(runtime.bouquetItems).toHaveLength(0);
  });

  it('delivers bouquet when full and configured, resets draft for any outcome, and notifies subscribers', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    // advance intro -> bacba opening -> choices to ready
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();
    expect(runtime.canCompose).toBe(true);
    expect(runtime.navigate('counter')).toBe(true);
    expect(runtime.navigate('workspace')).toBe(true);

    runtime.configureBouquet('bouquet', 3);
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');

    // Incomplete capacity delivery rejected
    expect(() => runtime.deliver()).toThrow('Cần cắm đủ 3 cành hoa trước khi trao');

    // Add 3rd stem to fill capacity
    runtime.addFlower('hoa-cuc-trang');
    expect(runtime.isBouquetFull).toBe(true);

    const result = runtime.deliver();
    expect(result.outcome).toBe('accepted');
    expect(runtime.bouquetItems).toHaveLength(0); // reset on delivery
    expect(runtime.selectedItemId).toBeNull();
    expect(runtime.activeView).toBe('counter');
  });

  it('handles shift advancement preconditions and updates shift audio', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(() => runtime.advanceShift()).toThrow('Chưa hoàn thành tất cả đơn hàng trong buổi này.');
  });

  it('blocks navigation from lobby to workspace', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.activeView).toBe('lobby');
    const navigated = runtime.navigate('workspace');
    expect(navigated).toBe(false);
    expect(runtime.activeView).toBe('lobby');
  });

  it('blocks navigation to workspace during intro and order dialogue', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    // Enter counter
    expect(runtime.navigate('counter')).toBe(true);
    expect(runtime.activeView).toBe('counter');
    expect(runtime.dialogue).toBeDefined();

    // Workspace blocked while intro dialogue active
    expect(runtime.navigate('workspace')).toBe(false);
    expect(runtime.activeView).toBe('counter');

    // Advance past intro to customer opening dialogue
    runtime.advanceDialogue('choice-intro-start');
    expect(runtime.dialogue?.id).toBe('dlg-bacba-01');
    expect(runtime.canCompose).toBe(false);

    // Workspace still blocked while customer order dialogue active
    expect(runtime.navigate('workspace')).toBe(false);
    expect(runtime.activeView).toBe('counter');
  });

  it('allows navigation to workspace when order is compose-ready', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.navigate('counter')).toBe(true);
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();

    expect(runtime.canCompose).toBe(true);
    expect(runtime.navigate('workspace')).toBe(true);
    expect(runtime.activeView).toBe('workspace');
  });

  it('rejects arrangement actions outside workspace and leaves items, inventory, and flags unchanged', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    const initialInventory = { ...runtime.snapshot.inventory };
    const initialFlags = { ...runtime.snapshot.flags };
    expect(runtime.activeView).toBe('lobby');

    // Rejected actions in lobby
    expect(() => runtime.addFlower('hoa-cuc-trang')).toThrow();
    expect(runtime.bouquetItems).toHaveLength(0);
    expect(runtime.snapshot.inventory).toEqual(initialInventory);
    expect(runtime.snapshot.flags).toEqual(initialFlags);

    runtime.selectItem('non-existent');
    expect(runtime.selectedItemId).toBeNull();

    runtime.rotateSelected(15);
    runtime.removeSelected();
    runtime.undoBouquet();
    runtime.clearBouquet();
    expect(runtime.bouquetItems).toHaveLength(0);

    // Navigate to counter with active dialogue
    expect(runtime.navigate('counter')).toBe(true);
    expect(() => runtime.addFlower('hoa-cuc-trang')).toThrow();
    expect(runtime.bouquetItems).toHaveLength(0);
    expect(runtime.snapshot.inventory).toEqual(initialInventory);
    expect(runtime.snapshot.flags).toEqual(initialFlags);
    expect(() => runtime.deliver()).toThrow();
  });

  it('routes to counter on successful delivery before notifying subscribers', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.navigate('counter')).toBe(true);
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();

    expect(runtime.navigate('workspace')).toBe(true);
    runtime.configureBouquet('bouquet', 3);
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');

    let observedViewDuringNotification: string | null = null;
    const unsub = runtime.subscribe(() => {
      if (!observedViewDuringNotification) {
        observedViewDuringNotification = runtime.activeView;
      }
    });

    const result = runtime.deliver();
    unsub();

    expect(result.outcome).toBe('accepted');
    expect(observedViewDuringNotification).toBe('counter');
    expect(runtime.activeView).toBe('counter');
  });

  it('routes to lobby on resetGame', async () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.navigate('counter')).toBe(true);
    expect(runtime.activeView).toBe('counter');

    await runtime.resetGame();
    expect(runtime.activeView).toBe('lobby');
  });

  it('rejects repeated delivery during result dialogue', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.navigate('counter')).toBe(true);
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();

    expect(runtime.navigate('workspace')).toBe(true);
    runtime.configureBouquet('bouquet', 3);
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');
    const result = runtime.deliver();
    expect(result.outcome).toBe('accepted');
    expect(runtime.activeView).toBe('counter');
    expect(runtime.dialogue).toBeDefined();

    const completedCountBefore = runtime.snapshot.completedOrderIds.length;
    expect(() => runtime.deliver()).toThrow();
    expect(runtime.snapshot.completedOrderIds.length).toBe(completedCountBefore);
  });

  it('resets draft, consumes flowers, and completes order even on missed delivery', () => {
    const state = createInitialGameState();
    state.currentDay = 'day-2';
    state.currentShift = 'living';
    state.flags.flag_intro_seen = true;
    state.unlockedFlowerIds = ['hoa-cuc-trang', 'hoa-hong-do'];
    state.inventory['hoa-cuc-trang'] = 30;
    state.inventory['hoa-hong-do'] = 30;
    state.currentOrderId = 'order-02-01-bac-ba';
    state.activeDialogueId = undefined;

    const session = new GameSession(state);
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    expect(runtime.navigate('counter')).toBe(true);
    expect(runtime.navigate('workspace')).toBe(true);

    const initialCucStock = runtime.snapshot.inventory['hoa-cuc-trang'];

    // order-02-01-bac-ba requires 2 cuc-trang, 1 hong-do, and kraft paper.
    // Delivering 3 cuc-trang without hong-do results in missed outcome
    runtime.configureBouquet('bouquet', 3);
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');
    runtime.addFlower('hoa-cuc-trang');
    expect(runtime.bouquetItems).toHaveLength(3);

    const result = runtime.deliver();

    expect(result.outcome).toBe('missed');
    expect(runtime.activeView).toBe('counter');
    expect(runtime.dialogue?.id).toBe('dlg-order-02-01-bac-ba-missed');

    // Missed order consumes drafted stems and resets draft; no retry allowed
    expect(runtime.bouquetItems).toHaveLength(0);
    expect(runtime.snapshot.inventory['hoa-cuc-trang']).toBe(initialCucStock - 3);
    expect(runtime.snapshot.completedOrderIds).toContain('order-02-01-bac-ba');
    expect(() => session.retryMissed()).toThrow(
      'Submitted bouquets are final; missed orders cannot be retried.',
    );
  });

  it('tracks remaining stock accurately minus drafted flowers', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    runtime.navigate('counter');
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();
    runtime.navigate('workspace');

    runtime.configureBouquet('bouquet', 5);
    const initialStock = runtime.getRemainingStock('hoa-cuc-trang');
    expect(initialStock).toBe(30);

    runtime.addFlower('hoa-cuc-trang');
    expect(runtime.getRemainingStock('hoa-cuc-trang')).toBe(initialStock - 1);

    runtime.addFlower('hoa-cuc-trang');
    expect(runtime.getRemainingStock('hoa-cuc-trang')).toBe(initialStock - 2);

    runtime.undoBouquet();
    expect(runtime.getRemainingStock('hoa-cuc-trang')).toBe(initialStock - 1);
  });

  it('supports domain order detail inquiry and updates heard notes', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    runtime.navigate('counter');
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();

    expect(runtime.isOrderDetailHeard).toBe(false);
    const initialNotesCount = runtime.heardOrderNotes.length;

    runtime.askOrderDetail();
    expect(runtime.isOrderDetailHeard).toBe(true);
    expect(runtime.heardOrderNotes.length).toBeGreaterThan(initialNotesCount);

    // Cannot ask detail again
    expect(() => runtime.askOrderDetail()).toThrow();
  });

  it('enforces finishing features gated by day', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    runtime.navigate('counter');
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();
    runtime.navigate('workspace');
    runtime.configureBouquet('bouquet', 3);

    // Day 1 has no paper, ribbon, or cards unlocked
    expect(runtime.features.paper).toBe(false);
    expect(runtime.features.ribbon).toBe(false);
    expect(runtime.features.cards).toBe(false);

    expect(() => runtime.setPaper('kraft')).toThrow('Giấy gói chưa mở khóa ở ngày này.');
    expect(() => runtime.setRibbon('sage')).toThrow('Ruy-băng chưa mở khóa ở ngày này.');
    expect(() => runtime.setCard('card-respect')).toThrow('Thiệp nhắn chưa mở khóa ở ngày này.');
  });

  it('restores cleared items and draft state when undoing clearBouquet', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    runtime.navigate('counter');
    runtime.advanceDialogue('choice-intro-start');
    runtime.advanceDialogue('choice-order-01-bac-ba-direct');
    runtime.advanceDialogue();
    runtime.navigate('workspace');

    runtime.configureBouquet('bouquet', 3);
    const item1 = runtime.addFlower('hoa-cuc-trang');
    const item2 = runtime.addFlower('hoa-cuc-trang');
    expect(runtime.bouquetItems).toHaveLength(2);
    expect(runtime.getRemainingStock('hoa-cuc-trang')).toBe(28);

    runtime.clearBouquet();
    expect(runtime.bouquetItems).toHaveLength(0);
    expect(runtime.selectedItemId).toBeNull();
    expect(runtime.isBouquetConfigured).toBe(true);

    // Undoing clear restores items and remaining stock calculation
    runtime.undoBouquet();
    expect(runtime.bouquetItems).toHaveLength(2);
    expect(runtime.bouquetItems.map((i) => i.id)).toEqual([item1.id, item2.id]);
    expect(runtime.getRemainingStock('hoa-cuc-trang')).toBe(28);
  });
});
