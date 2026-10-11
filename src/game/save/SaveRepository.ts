import type { GameState } from '../state/GameState';

export type LoadResult =
  | { status: 'empty' }
  | { status: 'loaded'; state: GameState; recovered: boolean }
  | { status: 'error'; message: string; raw?: string };

export interface SaveRepository {
  load(): Promise<LoadResult>;
  save(state: GameState): Promise<void>;
  clear(): Promise<void>;
}
