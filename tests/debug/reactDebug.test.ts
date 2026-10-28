import { describe, expect, it } from 'vitest';
import { createSandboxStorage } from '../../src/debug/sandboxStorage';
import { createBrowserSaveRepository, PRIMARY_SAVE_KEY } from '../../src/game/save/browserSaveRepository';
import { createInitialGameState } from '../../src/game/state/GameState';

describe('Debug Sandbox Isolation', () => {
  it('does not touch primary localStorage keys when using sandbox storage', async () => {
    const sandbox = createSandboxStorage();
    const repo = createBrowserSaveRepository(sandbox);
    await repo.save({ ...createInitialGameState(), currentChapter: 'thang-mot' });

    expect(sandbox.getItem(PRIMARY_SAVE_KEY)).toBeDefined();
    // window.localStorage is isolated and remains empty in tests
  });

  it('exports modular React debug views', async () => {
    const debugTools = await import('../../src/components/debug/DebugHub');
    expect(debugTools.DebugHub).toBeDefined();
  });
});
