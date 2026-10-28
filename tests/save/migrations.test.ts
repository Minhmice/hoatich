import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../../src/game/state/GameState';
import { migrateSave } from '../../src/game/save/migrations';

describe('migrateSave', () => {
  it('migrates schema 0 defaults', () => {
    const state = createInitialGameState();
    const v0 = { ...state } as Record<string, unknown>;
    delete v0.schemaVersion;
    delete v0.currentShift;
    delete v0.settings;
    delete v0.unlockedFlowerIds;
    delete v0.completedOrderIds;
    delete v0.journalEntryIds;
    delete v0.npcProgress;

    const migrated = migrateSave(v0);
    expect(migrated).toMatchObject({
      schemaVersion: 2,
      currentShift: 'living',
      settings: { textSpeed: 'normal', fontScale: 1, musicVolume: 1, sfxVolume: 1, reducedMotion: false },
      completedOrderIds: [],
      journalEntryIds: [],
    });
    expect(migrated.unlockedFlowerIds).toEqual(['hoa-cuc-trang']);
  });

  it('derives legacy unlocks from known inventory', () => {
    const state = createInitialGameState();
    const v0 = { ...state, inventory: { ...state.inventory, 'hoa-hoang-tuyen': 2 } } as Record<string, unknown>;
    delete v0.schemaVersion;
    delete v0.unlockedFlowerIds;
    expect(migrateSave(v0).unlockedFlowerIds).toContain('hoa-hoang-tuyen');
  });
  it('preserves historical completed IDs, flags, and relationship affinity through v1 migration', () => {
    const state = createInitialGameState();
    const v1 = {
      ...state,
      schemaVersion: 1,
      completedOrderIds: ['order-01-bac-ba'],
      flags: { flag_knows_bac_ba_wife_memory: true, 'dlg_effect_applied_dlg-bacba-01': true },
      relationshipScores: { 'bac-ba': 67 },
    } as unknown as Record<string, unknown>;
    delete v1.npcProgress;
    const migrated = migrateSave(v1);
    expect(migrated.completedOrderIds).toContain('order-01-bac-ba');
    expect(migrated.flags.flag_knows_bac_ba_wife_memory).toBe(true);
    expect(migrated.flags['dlg_effect_applied_dlg-bacba-01']).toBe(true);
    expect(migrated.npcProgress['bac-ba'].affinity).toBe(67);
  });

  it('rejects unknown calendar IDs', () => {
    const state = createInitialGameState();
    expect(() => migrateSave({ ...state, currentChapter: 'thang-hai' })).toThrow(/currentChapter/i);
    expect(() => migrateSave({ ...state, currentDay: 'day-999' })).toThrow(/currentDay/i);
  });

  it('rejects arbitrary dialogue-effect flag prefixes', () => {
    const state = createInitialGameState();
    expect(() => migrateSave({ ...state, flags: { dlg_effect_applied_untrusted: true } })).toThrow(/flags contains unknown ID/i);
  });

  it('rejects invalid inventory', () => {
    const state = createInitialGameState();
    expect(() => migrateSave({ ...state, inventory: { ...state.inventory, 'hoa-cuc-trang': -1 } })).toThrow(/inventory/i);
  });

  it('rejects future schemas without coercion', () => {
    expect(() => migrateSave({ schemaVersion: 3 })).toThrow(/Unsupported save schema version/i);
  });

  it('strictly validates schema 2: rejects unknown activeDialogueId without silent rewriting', () => {
    const state = createInitialGameState();
    expect(() => migrateSave({ ...state, activeDialogueId: 'dlg-corrupted-fake-id' })).toThrow(
      /Unknown activeDialogueId/i,
    );
  });

  it('strictly validates schema 2: rejects missing npcProgress', () => {
    const state = createInitialGameState() as unknown as Record<string, unknown>;
    delete state.npcProgress;
    expect(() => migrateSave(state)).toThrow(/npcProgress is required/i);
  });

  it('strictly validates schema 2: rejects out-of-range affinity without silent clamping', () => {
    const state = createInitialGameState();
    state.npcProgress['bac-ba'].affinity = 150;
    expect(() => migrateSave(state)).toThrow(/affinity out of range/i);

    state.npcProgress['bac-ba'].affinity = -20;
    expect(() => migrateSave(state)).toThrow(/affinity out of range/i);
  });

  it('strictly validates schema 2: rejects mismatched relationshipScores vs npcProgress affinity', () => {
    const state = createInitialGameState();
    state.npcProgress['bac-ba'].affinity = 80;
    state.relationshipScores['bac-ba'] = 40;
    expect(() => migrateSave(state)).toThrow(/does not match npcProgress affinity/i);
  });

  it('permits legacy fallback mapping of unknown dialogue IDs only for version < 2', () => {
    const legacySave = {
      schemaVersion: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      currentChapter: 'thang-mot',
      currentDay: 'day-1',
      currentShift: 'living',
      inventory: { 'hoa-cuc-trang': 12 },
      unlockedFlowerIds: ['hoa-cuc-trang'],
      completedOrderIds: [],
      currentOrderId: 'order-01-bac-ba',
      activeDialogueId: 'dlg-obsolete-legacy-id',
      flags: {},
      journalEntryIds: [],
    };
    const migrated = migrateSave(legacySave);
    expect(migrated.schemaVersion).toBe(2);
    // Legacy fallback mapped to openingDialogueId of active order
    expect(migrated.activeDialogueId).toBe('dlg-bacba-01');
  });
});
