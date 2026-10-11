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

    const migrated = migrateSave(v0);
    expect(migrated).toMatchObject({
      schemaVersion: 1,
      currentShift: 'living',
      settings: { textSpeed: 'normal', fontScale: 1, musicVolume: 1, sfxVolume: 1, reducedMotion: false },
      completedOrderIds: [],
      journalEntryIds: [],
    });
    expect(migrated.unlockedFlowerIds).toEqual(Object.keys(state.inventory));
  });

  it('derives legacy unlocks from known inventory', () => {
    const state = createInitialGameState();
    const v0 = { ...state, inventory: { ...state.inventory, 'hoa-hoang-tuyen': 2 } } as Record<string, unknown>;
    delete v0.schemaVersion;
    delete v0.unlockedFlowerIds;
    expect(migrateSave(v0).unlockedFlowerIds).toContain('hoa-hoang-tuyen');
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
    expect(() => migrateSave({ schemaVersion: 2 })).toThrow(/Unsupported save schema version/i);
  });
});
