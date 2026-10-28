import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../../src/game/state/GameState';
import { reduceGameState } from '../../src/game/state/stateReducer';

describe('state reducer', () => {
  it('creates initial living state with one stocked flower species', () => {
    const state = createInitialGameState();
    expect(state.schemaVersion).toBe(2);
    expect(state.currentChapter).toBe('thang-mot');
    expect(state.currentDay).toBe('day-1');
    expect(state.currentShift).toBe('living');
    expect(state.unlockedFlowerIds).toEqual(['hoa-cuc-trang']);
    expect(state.inventory['hoa-cuc-trang']).toBe(30);
    expect(state.npcProgress['bac-ba']?.affinity).toBe(50);
  });

  it('completes order immutably and charges each bouquet flower once', () => {
    const initial = createInitialGameState();
    const state = reduceGameState(initial, {
      type: 'completeOrder',
      orderId: 'order-01-bac-ba',
      bouquetFlowerIds: ['hoa-cuc-trang', 'hoa-cuc-trang'],
      effects: [],
    });
    expect(state.inventory['hoa-cuc-trang']).toBe(28);
    expect(state.completedOrderIds).toContain('order-01-bac-ba');
    expect(initial.inventory['hoa-cuc-trang']).toBe(30);
    expect(initial.completedOrderIds).not.toContain('order-01-bac-ba');
  });

  it('makes duplicate completion idempotent', () => {
    const initial = createInitialGameState();
    const event = {
      type: 'completeOrder' as const,
      orderId: 'order-01-bac-ba',
      bouquetFlowerIds: ['hoa-cuc-trang'],
      effects: [],
    };
    const once = reduceGameState(initial, event);
    const twice = reduceGameState(once, event);
    expect(twice.inventory['hoa-cuc-trang']).toBe(29);
    expect(twice.completedOrderIds.filter((id) => id === 'order-01-bac-ba')).toHaveLength(1);
  });

  it('rejects unavailable or negative stock', () => {
    const initial = createInitialGameState();
    expect(() => reduceGameState(initial, {
      type: 'completeOrder', orderId: 'order-01-bac-ba',
      bouquetFlowerIds: Array.from({ length: 31 }, () => 'hoa-cuc-trang'), effects: [],
    })).toThrow(/inventory|stock|available/i);
    const invalid = { ...initial, inventory: { ...initial.inventory, 'hoa-cuc-trang': -1 } };
    expect(() => reduceGameState(invalid, { type: 'effect', effect: { type: 'setFlag', flag: 'flag_read_aunt_spirit_journal', value: true } })).toThrow(/negative/i);
  });

  it('unlocks flower with initial stock', () => {
    const state = reduceGameState(createInitialGameState(), {
      type: 'effect', effect: { type: 'unlockFlower', flowerId: 'hoa-cam-chuong-hong' },
    });
    expect(state.unlockedFlowerIds).toContain('hoa-cam-chuong-hong');
    expect(state.inventory['hoa-cam-chuong-hong']).toBe(12);
  });

  it('applies validated flag, relationship, and journal effects', () => {
    const flagged = reduceGameState(createInitialGameState(), {
      type: 'effect', effect: { type: 'setFlag', flag: 'flag_read_aunt_spirit_journal', value: true },
    });
    expect(flagged.flags.flag_read_aunt_spirit_journal).toBe(true);
    const related = reduceGameState(flagged, {
      type: 'effect', effect: { type: 'relationship', customerId: 'bac-ba', amount: 2 },
    });
    expect(related.relationshipScores['bac-ba']).toBe(52);
    expect(related.npcProgress['bac-ba']?.affinity).toBe(52);
    const journaled = reduceGameState(related, {
      type: 'effect', effect: { type: 'journal', entryId: 'journal_aunt_hoang_tuyen' },
    });
    expect(journaled.journalEntryIds).toContain('journal_aunt_hoang_tuyen');
  });

  it('validates settings and preserves checkpoint until order completion', () => {
    const initial = createInitialGameState();
    const checkpointed = reduceGameState(initial, { type: 'checkpoint', orderId: 'order-01-bac-ba', dialogueId: 'dlg-bacba-01' });
    expect(checkpointed.currentOrderId).toBe('order-01-bac-ba');
    expect(checkpointed.activeDialogueId).toBe('dlg-bacba-01');
    const configured = reduceGameState(initial, { type: 'settings', settings: { musicVolume: 0.5, textSpeed: 'fast' } });
    expect(configured.settings.musicVolume).toBe(0.5);
    expect(configured.settings.textSpeed).toBe('fast');
    expect(() => reduceGameState(initial, { type: 'settings', settings: { musicVolume: 2 } })).toThrow(/volume|range|finite/i);
    expect(() => reduceGameState(initial, { type: 'settings', settings: { fontScale: Number.NaN } })).toThrow(/font|finite/i);
    const finished = reduceGameState(checkpointed, { type: 'completeOrder', orderId: 'order-01-bac-ba', bouquetFlowerIds: [], effects: [] });
    expect(finished.currentOrderId).toBeUndefined();
    expect(finished.activeDialogueId).toBeUndefined();
  });

  it('restocks depleted unlocked flowers to minimum 30 on advanceShift without reducing higher stock', () => {
    const initial = createInitialGameState();
    const withCustomInventory = {
      ...initial,
      unlockedFlowerIds: ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong'],
      inventory: {
        'hoa-hong-do': 0,
        'hoa-cuc-trang': 3,
        'hoa-huong-duong': 35,
      },
    };
    const shifted = reduceGameState(withCustomInventory, {
      type: 'advanceShift',
      shift: 'dead',
    });
    expect(shifted.currentShift).toBe('dead');
    expect(shifted.inventory['hoa-hong-do']).toBe(30);
    expect(shifted.inventory['hoa-cuc-trang']).toBe(30);
    expect(shifted.inventory['hoa-huong-duong']).toBe(35);
  });
});
