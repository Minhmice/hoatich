import { describe, expect, it } from 'vitest';
import { createSandboxStorage } from '../../src/debug/sandboxStorage';
import { BACKUP_SAVE_KEY, PRIMARY_SAVE_KEY, createBrowserSaveRepository } from '../../src/game/save/browserSaveRepository';
import { createInitialGameState } from '../../src/game/state/GameState';

describe('debug storage sandbox', () => {
  it('keeps independently opened tools isolated', () => {
    const first = createSandboxStorage(); const second = createSandboxStorage();
    first.setItem(PRIMARY_SAVE_KEY, 'first');
    expect(second.getItem(PRIMARY_SAVE_KEY)).toBeNull();
    first.removeItem(PRIMARY_SAVE_KEY);
    expect(first.getItem(PRIMARY_SAVE_KEY)).toBeNull();
  });
  it('runs real backup recovery without accepting corrupt or future saves', async () => {
    const storage = createSandboxStorage();
    const repository = createBrowserSaveRepository(storage);
    const state = createInitialGameState();
    storage.setItem(PRIMARY_SAVE_KEY, '{broken');
    storage.setItem(BACKUP_SAVE_KEY, JSON.stringify(state));
    expect(await repository.load()).toMatchObject({ status: 'loaded', recovered: true, state: { currentShift: 'living' } });
    storage.setItem(BACKUP_SAVE_KEY, '{broken');
    expect(await repository.load()).toMatchObject({ status: 'error' });
    storage.removeItem(BACKUP_SAVE_KEY);
    storage.setItem(PRIMARY_SAVE_KEY, JSON.stringify({ ...state, schemaVersion: 999 }));
    expect(await repository.load()).toMatchObject({ status: 'error' });
    await repository.clear();
    expect(await repository.load()).toEqual({ status: 'empty' });
  });
});
