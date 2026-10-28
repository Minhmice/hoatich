import type { Vector3 } from 'three';

export function modelToWorld(position: Readonly<{ x: number; y: number }>, layer: number, target: Vector3): Vector3 {
  if (![position.x, position.y, layer].every(Number.isFinite)) throw new Error('Table coordinates must be finite');
  return target.set((position.x - 380) / 520 * 8 - 4, 0.03 + layer * 0.02, (position.y - 410) / 300 * 5 - 2.5);
}

export function worldToModel(point: Readonly<{ x: number; z: number }>): { x: number; y: number } {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.z)) throw new Error('Table coordinates must be finite');
  return { x: Math.max(380, Math.min(900, (point.x + 4) / 8 * 520 + 380)), y: Math.max(410, Math.min(710, (point.z + 2.5) / 5 * 300 + 410)) };
}
