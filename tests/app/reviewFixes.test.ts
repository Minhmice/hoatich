import { describe, expect, it } from 'vitest';
import { GameSession } from '../../src/game/GameSession';
import { createBrowserSaveRepository, PRIMARY_SAVE_KEY, BACKUP_SAVE_KEY } from '../../src/game/save/browserSaveRepository';
import { createSandboxStorage } from '../../src/debug/sandboxStorage';

describe('Review Fixes - Regressions', () => {
  it('does not auto-overwrite corrupt saves in storage when initialized in recovery mode', async () => {
    const storage = createSandboxStorage();
    storage.setItem(PRIMARY_SAVE_KEY, '{invalid-json');
    storage.setItem(BACKUP_SAVE_KEY, '{invalid-backup');

    const repo = createBrowserSaveRepository(storage);
    const loaded = await repo.load();
    expect(loaded.status).toBe('error');

    // When status is error, GameSession must not have saveRepo attached automatically
    const session = new GameSession(
      loaded.status === 'loaded' ? loaded.state : undefined,
      loaded.status === 'loaded' ? repo : undefined,
    );

    session.advanceDialogue('choice-intro-start');
    await Promise.resolve();

    // Storage must still contain the raw corrupt saves, not overwritten by new game state
    expect(storage.getItem(PRIMARY_SAVE_KEY)).toBe('{invalid-json');
    expect(storage.getItem(BACKUP_SAVE_KEY)).toBe('{invalid-backup');
  });
});
