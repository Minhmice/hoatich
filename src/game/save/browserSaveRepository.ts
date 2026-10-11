import type { GameState } from '../state/GameState';
import { migrateSave, validateSave } from './migrations';
import type { LoadResult, SaveRepository } from './SaveRepository';

export const PRIMARY_SAVE_KEY = 'hoatich.save.v1';
export const BACKUP_SAVE_KEY = 'hoatich.save.backup';

type SaveStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function createBrowserSaveRepository(storage?: SaveStorage): SaveRepository {
  const getStorage = (): SaveStorage => {
    if (storage) return storage;
    if (typeof window === 'undefined') throw new Error('Browser storage is unavailable');
    return window.localStorage;
  };

  return {
    async load(): Promise<LoadResult> {
      let store: SaveStorage;
      try {
        store = getStorage();
      } catch (error) {
        return { status: 'error', message: errorMessage(error) };
      }
      let primary: string | null;
      let backup: string | null;
      try {
        primary = store.getItem(PRIMARY_SAVE_KEY);
        backup = store.getItem(BACKUP_SAVE_KEY);
      } catch (error) {
        return { status: 'error', message: errorMessage(error) };
      }
      if (primary === null && backup === null) return { status: 'empty' };
      let primaryError: string | undefined;
      if (primary !== null) {
        try {
          return { status: 'loaded', state: migrateSave(JSON.parse(primary)), recovered: false };
        } catch (error) {
          primaryError = errorMessage(error);
        }
      }
      if (backup !== null) {
        try {
          return { status: 'loaded', state: migrateSave(JSON.parse(backup)), recovered: true };
        } catch (error) {
          return { status: 'error', message: `Save recovery failed: ${errorMessage(error)}`, raw: primary ?? backup };
        }
      }
      return { status: 'error', message: primaryError ?? 'Save is invalid', raw: primary ?? undefined };
    },

    async save(state: GameState): Promise<void> {
      const valid = validateSave(state);
      const serialized = JSON.stringify(valid);
      const store = getStorage();
      const primary = store.getItem(PRIMARY_SAVE_KEY);
      const backup = store.getItem(BACKUP_SAVE_KEY);
      for (const raw of [primary, backup]) {
        if (raw !== null) migrateSave(JSON.parse(raw));
      }
      if (primary !== null) store.setItem(BACKUP_SAVE_KEY, primary);
      store.setItem(PRIMARY_SAVE_KEY, serialized);
    },

    async clear(): Promise<void> {
      const store = getStorage();
      store.removeItem(PRIMARY_SAVE_KEY);
      store.removeItem(BACKUP_SAVE_KEY);
    },
  };
}
