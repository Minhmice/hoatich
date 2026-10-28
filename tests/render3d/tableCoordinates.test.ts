import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { modelToWorld, worldToModel } from '../../src/render3d/tableCoordinates';

describe('table coordinate projection', () => {
  it('preserves model points through world projection at table corners and center', () => {
    for (const position of [{ x: 380, y: 410 }, { x: 640, y: 560 }, { x: 900, y: 710 }]) {
      const projected = modelToWorld(position, 0, new Vector3());
      const restored = worldToModel(projected);
      expect(restored.x).toBeCloseTo(position.x);
      expect(restored.y).toBeCloseTo(position.y);
    }
    expect(modelToWorld({ x: 380, y: 410 }, 0, new Vector3()).toArray()).toEqual([-4, 0.03, -2.5]);
    expect(modelToWorld({ x: 900, y: 710 }, 0, new Vector3()).toArray()).toEqual([4, 0.03, 2.5]);
  });
  it('raises layers along the table normal without moving their anchors', () => {
    const low = modelToWorld({ x: 640, y: 560 }, 0, new Vector3());
    const high = modelToWorld({ x: 640, y: 560 }, 4, new Vector3());
    expect(high.x).toBe(low.x);
    expect(high.z).toBe(low.z);
    expect(high.y - low.y).toBeCloseTo(0.08);
  });
  it('clamps a drag outside the table and rejects invalid coordinates', () => {
    expect(worldToModel({ x: 20, z: -40 })).toEqual({ x: 900, y: 410 });
    expect(() => worldToModel({ x: NaN, z: 0 })).toThrow();
    expect(() => modelToWorld({ x: 1, y: Infinity }, 0, new Vector3())).toThrow();
    expect(() => modelToWorld({ x: 640, y: 560 }, Infinity, new Vector3())).toThrow();
  });
});
