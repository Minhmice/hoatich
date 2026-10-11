import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../../src/game/state/GameState';
import { BACKUP_SAVE_KEY, PRIMARY_SAVE_KEY, createBrowserSaveRepository } from '../../src/game/save/browserSaveRepository';
import { GameSession } from '../../src/game/GameSession';

function storage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
    map,
  };
}

describe('browser save repository', () => {
  it('round trips state', async () => {
    const fake = storage();
    const repository = createBrowserSaveRepository(fake);
    const state = createInitialGameState();
    await repository.save(state);
    const result = await repository.load();
    expect(result).toMatchObject({ status: 'loaded', recovered: false, state });
  });

  it('round trips a dialogue checkpoint with runtime flags', async () => {
    const fake = storage();
    const repository = createBrowserSaveRepository(fake);
    const session = new GameSession(undefined, repository);
    session.advanceDialogue('choice-intro-start');
    session.advanceDialogue('choice-bacba-01-memory');
    const result = await repository.load();
    expect(result).toMatchObject({
      status: 'loaded',
      state: {
        activeDialogueId: 'dlg-bacba-03-memory',
        flags: {
          flag_intro_seen: true,
          flag_knows_bac_ba_wife_memory: true,
          'dlg_effect_applied_dlg-bacba-03-memory': true,
        },
      },
    });
  });

  it('recovers valid backup after invalid primary calendar', async () => {
    const state = createInitialGameState();
    const fake = storage({ [PRIMARY_SAVE_KEY]: JSON.stringify({ ...state, currentDay: 'day-999' }), [BACKUP_SAVE_KEY]: JSON.stringify(state) });
    await expect(createBrowserSaveRepository(fake).load()).resolves.toMatchObject({ status: 'loaded', recovered: true, state });
  });

  it('recovers valid backup when primary is corrupt', async () => {
    const state = createInitialGameState();
    const fake = storage({ [PRIMARY_SAVE_KEY]: '{bad', [BACKUP_SAVE_KEY]: JSON.stringify(state) });
    const result = await createBrowserSaveRepository(fake).load();
    expect(result).toMatchObject({ status: 'loaded', recovered: true, state });
  });

  it('blocks writes that would replace a corrupt primary recovered from backup', async () => {
    const state = createInitialGameState();
    const raw = '{bad';
    const fake = storage({ [PRIMARY_SAVE_KEY]: raw, [BACKUP_SAVE_KEY]: JSON.stringify(state) });
    const repository = createBrowserSaveRepository(fake);
    await expect(repository.load()).resolves.toMatchObject({ status: 'loaded', recovered: true, state });
    await expect(repository.save(state)).rejects.toThrow();
    expect(fake.map.get(PRIMARY_SAVE_KEY)).toBe(raw);
  });

  it('returns raw error and retains invalid saves', async () => {
    const raw = '{bad';
    const fake = storage({ [PRIMARY_SAVE_KEY]: raw, [BACKUP_SAVE_KEY]: '{also bad' });
    const result = await createBrowserSaveRepository(fake).load();
    expect(result).toMatchObject({ status: 'error', raw });
    expect(fake.map.get(PRIMARY_SAVE_KEY)).toBe(raw);
  });

  it('does not overwrite future primary saves', async () => {
    const future = JSON.stringify({ schemaVersion: 99, preserved: true });
    const fake = storage({ [PRIMARY_SAVE_KEY]: future });
    await expect(createBrowserSaveRepository(fake).save(createInitialGameState())).rejects.toThrow(/Unsupported save schema/i);
    expect(fake.map.get(PRIMARY_SAVE_KEY)).toBe(future);
  });

  it('rejects writes after unresolved raw load errors', async () => {
    const raw = '{bad';
    const fake = storage({ [PRIMARY_SAVE_KEY]: raw });
    const repository = createBrowserSaveRepository(fake);
    await expect(repository.load()).resolves.toMatchObject({ status: 'error', raw });
    await expect(repository.save(createInitialGameState())).rejects.toThrow();
    expect(fake.map.get(PRIMARY_SAVE_KEY)).toBe(raw);
  });

  it('does not overwrite future backup saves', async () => {
    const future = JSON.stringify({ schemaVersion: 99, preserved: true });
    const fake = storage({ [BACKUP_SAVE_KEY]: future });
    await expect(createBrowserSaveRepository(fake).save(createInitialGameState())).rejects.toThrow(/Unsupported save schema/i);
    expect(fake.map.get(BACKUP_SAVE_KEY)).toBe(future);
  });

  it('does not overwrite mixed current and future saves', async () => {
    const future = JSON.stringify({ schemaVersion: 99, preserved: true });
    const fake = storage({ [PRIMARY_SAVE_KEY]: JSON.stringify(createInitialGameState()), [BACKUP_SAVE_KEY]: future });
    await expect(createBrowserSaveRepository(fake).save(createInitialGameState())).rejects.toThrow(/Unsupported save schema/i);
    expect(fake.map.get(BACKUP_SAVE_KEY)).toBe(future);
  });

  it('propagates storage errors from save', async () => {
    const state = createInitialGameState();
    const repository = createBrowserSaveRepository({
      getItem: () => null,
      setItem: () => { throw new Error('quota exceeded'); },
      removeItem: () => undefined,
    });
    await expect(repository.save(state)).rejects.toThrow('quota exceeded');
  });

  it('returns error when storage access throws', async () => {
    const repository = createBrowserSaveRepository({
      getItem: () => { throw new Error('storage blocked'); },
      setItem: () => undefined,
      removeItem: () => undefined,
    });
    await expect(repository.load()).resolves.toMatchObject({ status: 'error', message: 'storage blocked' });
  });
});
