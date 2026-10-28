import { describe, expect, it } from 'vitest';
import {
  BouquetModel,
  type VesselKind,
} from '../../src/game/bouquet/BouquetModel';
import { generateSlots } from '../../src/game/bouquet/slotLayout';
import { contentBundle } from '../../src/game/content';
import { flowerAssets } from '../../src/game/content/flowerAssets';
import { computeStemTransform } from '../../src/render3d/FlowerCard3D';

describe('Slot Arrangement & BouquetModel binding contracts', () => {
  const flower1 = contentBundle.flowers[0]?.id ?? 'hoa-cuc-trang';
  const flower2 = contentBundle.flowers[1]?.id ?? 'hoa-hong-do';
  const flower3 = contentBundle.flowers[2]?.id ?? 'hoa-huong-duong';

  describe('Capacity generation: 1, 5, 12, 15, 24', () => {
    it.each([1, 5, 12, 15, 24])('generates exact capacity for %i stems in bouquet vessel', (count) => {
      const slots = generateSlots('bouquet', count);
      expect(slots.length).toBe(count);

      // Verify all slot indices are sequential 0..count-1
      const indices = slots.map((s) => s.index);
      expect(indices).toEqual(Array.from({ length: count }, (_, i) => i));

      // Verify finite coordinates, integer layers, and valid poses
      for (const slot of slots) {
        expect(Number.isFinite(slot.position.x)).toBe(true);
        expect(Number.isFinite(slot.position.y)).toBe(true);
        expect(Number.isInteger(slot.layer)).toBe(true);
        expect(['center', 'left', 'right', 'down']).toContain(slot.pose);
      }
    });

    it('generates 1 center slot for count = 1', () => {
      const slots = generateSlots('bouquet', 1);
      expect(slots.length).toBe(1);
      expect(slots[0].pose).toBe('center');
      expect(slots[0].rotation).toBe(0);
      expect(slots[0].position.x).toBe(640);
    });

    it('generates 1 middle anchor + 4 diagonal surround for count = 5 with row-major [2,1,2] order', () => {
      const slots = generateSlots('bouquet', 5);
      expect(slots.length).toBe(5);

      // Row-major order check: y monotonically non-decreasing
      for (let i = 1; i < slots.length; i++) {
        expect(slots[i].position.y).toBeGreaterThanOrEqual(slots[i - 1].position.y);
      }

      // Middle anchor is at index 2 (row 1, center x=640)
      const centerSlot = slots[2];
      expect(centerSlot.index).toBe(2);
      expect(centerSlot.pose).toBe('center');
      expect(centerSlot.position.x).toBe(640);
      expect(centerSlot.rotation).toBe(0);

      // Top diagonals: slot 0 (top-left) and slot 1 (top-right)
      const topLeft = slots[0];
      const topRight = slots[1];
      expect(topLeft.position.y).toBeLessThan(centerSlot.position.y);
      expect(topRight.position.y).toBeLessThan(centerSlot.position.y);
      expect(topLeft.position.x).toBeLessThan(640);
      expect(topRight.position.x).toBeGreaterThan(640);
      expect(topLeft.rotation).toBeLessThan(0);
      expect(topRight.rotation).toBeGreaterThan(0);

      // Bottom diagonals: slot 3 (bottom-left) and slot 4 (bottom-right)
      const bottomLeft = slots[3];
      const bottomRight = slots[4];
      expect(bottomLeft.position.y).toBeGreaterThan(centerSlot.position.y);
      expect(bottomRight.position.y).toBeGreaterThan(centerSlot.position.y);
      expect(bottomLeft.position.x).toBeLessThan(640);
      expect(bottomRight.position.x).toBeGreaterThan(640);
      expect(bottomLeft.rotation).toBeLessThan(0);
      expect(bottomRight.rotation).toBeGreaterThan(0);
    });

    it.each(['bouquet', 'vase', 'jar'] as VesselKind[])('supports vessel silhouette variations: %s', (vessel) => {
      const slots = generateSlots(vessel, 12);
      expect(slots.length).toBe(12);
      for (const slot of slots) {
        expect(Number.isFinite(slot.position.x)).toBe(true);
        expect(Number.isFinite(slot.position.y)).toBe(true);
      }
    });
  });

  describe('Vacancy order and slot fill mechanics', () => {
    it('fills earliest vacancy in row-major order after middle removal', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });

      // Add 5 flowers
      for (let i = 0; i < 5; i++) {
        model.add(flower1);
      }
      expect(model.isFull).toBe(true);
      expect(model.items.map((it) => it.slotIndex)).toEqual([0, 1, 2, 3, 4]);

      // Remove flower at slot 2
      const itemAtSlot2 = model.items.find((it) => it.slotIndex === 2)!;
      model.remove(itemAtSlot2.id);
      expect(model.items.length).toBe(4);
      expect(model.items.map((it) => it.slotIndex)).toEqual([0, 1, 3, 4]);

      // Next add MUST fill earliest vacant slot (index 2)
      const newItem = model.add(flower2);
      expect(newItem.slotIndex).toBe(2);
      expect(model.isFull).toBe(true);

      // Remove slots 1 and 3
      const itemAtSlot1 = model.items.find((it) => it.slotIndex === 1)!;
      const itemAtSlot3 = model.items.find((it) => it.slotIndex === 3)!;
      model.remove(itemAtSlot1.id);
      model.remove(itemAtSlot3.id);
      expect(model.items.length).toBe(3);

      // First add fills slot 1
      const item1 = model.add(flower3);
      expect(item1.slotIndex).toBe(1);

      // Second add fills slot 3
      const item3 = model.add(flower3);
      expect(item3.slotIndex).toBe(3);
      expect(model.isFull).toBe(true);
    });

    it('rejects add when bouquet is full', () => {
      const model = new BouquetModel({ vessel: 'vase', stemCount: 3 });
      model.add(flower1);
      model.add(flower1);
      model.add(flower1);
      expect(model.isFull).toBe(true);

      expect(() => model.add(flower1)).toThrow(/Bouquet is full/);
    });

    it('requires lifting/removal before replacing a slot; cannot overwrite occupied slot', () => {
      const model = new BouquetModel({ vessel: 'jar', stemCount: 3 });
      model.add(flower1);
      model.add(flower1);
      model.add(flower1);

      // Cannot force addition onto occupied slot without removing
      expect(() => model.add(flower2)).toThrow(/Bouquet is full/);

      // Lift item at slot 0
      const item0 = model.items.find((it) => it.slotIndex === 0)!;
      model.remove(item0.id);

      // Now addition fills the vacated slot 0 with new flower
      const replaced = model.add(flower2);
      expect(replaced.slotIndex).toBe(0);
      expect(replaced.flowerId).toBe(flower2);
    });
  });

  describe('Undo mechanics and state restoration', () => {
    it('restores config, items, poses, rotation, and finish on undo', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });

      model.add(flower1);
      const firstItemId = model.items[0].id;
      const initialRotation = model.items[0].rotation;

      // Rotate item
      model.rotate(firstItemId, 10);
      expect(model.items[0].rotation).toBeCloseTo(initialRotation + 10);

      // Undo rotation
      model.undo();
      expect(model.items[0].rotation).toBe(initialRotation);

      // Set finish options
      model.setPaper('kraft');
      expect(model.finish.paper).toBe('kraft');
      model.setRibbon('rose');
      expect(model.finish.ribbon).toBe('rose');
      model.advanceBow();
      expect(model.finish.bowStep).toBe(1);
      model.setCard('test-card');
      expect(model.finish.cardId).toBe('test-card');

      // Undo card
      model.undo();
      expect(model.finish.cardId).toBeNull();
      expect(model.finish.bowStep).toBe(1);

      // Undo bow step
      model.undo();
      expect(model.finish.bowStep).toBe(0);

      // Undo ribbon
      model.undo();
      expect(model.finish.ribbon).toBe('none');

      // Undo paper
      model.undo();
      expect(model.finish.paper).toBe('none');

      // Undo add item
      model.undo();
      expect(model.items.length).toBe(0);
    });

    it('batches continuous gesture rotation into a single undo step', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add(flower1);
      const itemId = model.items[0].id;
      const initialRotation = model.items[0].rotation;

      // Simulate pointer drag gesture: 15 micro-deltas
      model.beginGesture();
      for (let i = 0; i < 15; i++) {
        model.rotate(itemId, 1);
      }
      model.endGesture();

      expect(model.items[0].rotation).toBeCloseTo(initialRotation + 15);

      // Single undo must revert the entire drag gesture
      model.undo();
      expect(model.items[0].rotation).toBe(initialRotation);

      // Second undo restores state before add
      model.undo();
      expect(model.items.length).toBe(0);
    });

    it('does not save snapshot on clamped no-op rotation', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add(flower1);
      const itemId = model.items[0].id;
      const baseRotation = model.items[0].rotation;

      // Rotate to maximum clamp (+25 degrees relative to base)
      model.rotate(itemId, 25);
      expect(model.items[0].rotation).toBe(baseRotation + 25);

      // Further positive rotation is clamped and must not push snapshot
      model.rotate(itemId, 10);
      expect(model.items[0].rotation).toBe(baseRotation + 25);

      // Undo must undo the rotation directly, not a no-op step
      model.undo();
      expect(model.items[0].rotation).toBe(baseRotation);
    });
  });

  describe('Configuration lock and invariants', () => {
    it('locks configuration once chosen and rejects re-configuration until reset()', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });

      // Cannot reconfigure while active
      expect(() =>
        model.configure({ vessel: 'vase', stemCount: 3 }),
      ).toThrow(/locked/);

      // Even after clear(), config remains locked
      model.add(flower1);
      model.clear();
      expect(model.items.length).toBe(0);
      expect(() =>
        model.configure({ vessel: 'jar', stemCount: 8 }),
      ).toThrow(/locked/);

      // Only explicit reset() unlocks configuration
      model.reset();
      expect(model.configuration).toBeNull();
      model.configure({ vessel: 'vase', stemCount: 3 });
      expect(model.configuration?.vessel).toBe('vase');
      expect(model.configuration?.stemCount).toBe(3);
    });

    it('rejects unknown flower IDs without corrupting state', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add(flower1);

      expect(() => model.add('unknown-fictional-flower')).toThrow(/Unknown flower ID/);
      expect(model.items.length).toBe(1);
    });
  });

  describe('Finishing mechanics and bow step lifecycle', () => {
    it('advances bow step through 0 -> 1 -> 2 -> 3 and caps at 3', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 3 });

      // Cannot advance bow without ribbon
      model.advanceBow();
      expect(model.finish.bowStep).toBe(0);

      model.setRibbon('sage');
      expect(model.finish.bowStep).toBe(0);

      // Step 1: Quấn
      model.advanceBow();
      expect(model.finish.bowStep).toBe(1);

      // Step 2: Tạo tai
      model.advanceBow();
      expect(model.finish.bowStep).toBe(2);

      // Step 3: Siết
      model.advanceBow();
      expect(model.finish.bowStep).toBe(3);

      // Additional advance remains capped at 3
      model.advanceBow();
      expect(model.finish.bowStep).toBe(3);
    });

    it('resets bow step to 0 when ribbon changes or is set to none', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 3 });
      model.setRibbon('sage');
      model.advanceBow();
      model.advanceBow();
      expect(model.finish.bowStep).toBe(2);

      // Changing ribbon resets bow
      model.setRibbon('rose');
      expect(model.finish.bowStep).toBe(0);

      model.advanceBow();
      expect(model.finish.bowStep).toBe(1);

      // Setting ribbon to none resets bow
      model.setRibbon('none');
      expect(model.finish.bowStep).toBe(0);
    });

    it('resets bow step on paper change or structural flower change, but preserves bow on card edit', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 3 });
      model.setRibbon('rose');
      model.advanceBow();
      expect(model.finish.bowStep).toBe(1);

      // Card edit preserves bow
      model.setCard('greeting-card');
      expect(model.finish.bowStep).toBe(1);
      expect(model.finish.cardId).toBe('greeting-card');

      model.setCard(null);
      expect(model.finish.bowStep).toBe(1);

      // Changing paper resets bow
      model.setPaper('kraft');
      expect(model.finish.bowStep).toBe(0);

      // Tie bow again
      model.advanceBow();
      expect(model.finish.bowStep).toBe(1);

      // Adding flower resets bow
      model.add(flower1);
      expect(model.finish.bowStep).toBe(0);
    });
  });

  describe('Submission contract and order clear/reset', () => {
    it('throws when getting submission on unconfigured or incomplete bouquet', () => {
      const unconfigured = new BouquetModel();
      expect(() => unconfigured.submission).toThrow(/not configured/);

      const configured = new BouquetModel({ vessel: 'bouquet', stemCount: 2 });
      expect(() => configured.submission).toThrow(/not full/);

      configured.add(flower1);
      expect(() => configured.submission).toThrow(/not full/);

      configured.add(flower2);
      expect(configured.isFull).toBe(true);

      const sub = configured.submission;
      expect(sub.configuration.stemCount).toBe(2);
      expect(sub.items.length).toBe(2);
      expect(sub.finish.paper).toBe('none');
    });

    it('clear() empties flowers while retaining configuration and slots', () => {
      const model = new BouquetModel({ vessel: 'vase', stemCount: 5 });
      model.add(flower1);
      model.add(flower2);

      model.clear();
      expect(model.items.length).toBe(0);
      expect(model.configuration?.vessel).toBe('vase');
      expect(model.slots.length).toBe(5);
    });

    it('reset() clears configuration, slots, items, finish, and history for a new order', () => {
      const model = new BouquetModel({ vessel: 'jar', stemCount: 3 });
      model.add(flower1);
      model.setPaper('cream');

      model.reset();
      expect(model.configuration).toBeNull();
      expect(model.slots.length).toBe(0);
      expect(model.items.length).toBe(0);
      expect(model.finish.paper).toBe('none');
      expect(model.finish.ribbon).toBe('none');
    });
  });

  describe('Flower asset mapping verification', () => {
    it('verifies all catalog flowers have center asset and directional variants in flowerAssets', () => {
      for (const flower of contentBundle.flowers) {
        const asset = flowerAssets[flower.id];
        expect(asset).toBeDefined();
        expect(typeof asset.url).toBe('string');
        expect(asset.url.length).toBeGreaterThan(0);

        if (asset.variants) {
          if (asset.variants.left) expect(typeof asset.variants.left).toBe('string');
          if (asset.variants.right) expect(typeof asset.variants.right).toBe('string');
          if (asset.variants.down) expect(typeof asset.variants.down).toBe('string');
        }
      }
    });
  });

  describe('3D Vessel Mouth Insertion & Stem Convergence', () => {
    it('converges stem bottoms inside vessel mouth for vase, jar, and bouquet', () => {
      // Vase: mouth at Y=1.125, Z=-0.20
      const vaseStem = computeStemTransform({ x: 640, y: 500 }, 1, 0, 'vase', false);
      expect(vaseStem.position.x).toBeCloseTo(0);
      expect(vaseStem.position.y).toBeCloseTo(1.065); // inside vase neck
      expect(vaseStem.position.z).toBeCloseTo(-0.20);
      expect(vaseStem.headPosition.y).toBeGreaterThan(2.2); // bloom stands above vase rim

      // Jar: mouth at Y=0.705, Z=0.10
      const jarStem = computeStemTransform({ x: 640, y: 520 }, 1, 0, 'jar', false);
      expect(jarStem.position.x).toBeCloseTo(0);
      expect(jarStem.position.y).toBeCloseTo(0.645); // inside jar mouth
      expect(jarStem.position.z).toBeCloseTo(0.10);
      expect(jarStem.headPosition.y).toBeGreaterThan(1.8);

      // Bouquet: tied at ribbon point (Y=0.14, Z=0.52)
      const bouquetStem = computeStemTransform({ x: 640, y: 510 }, 1, 0, 'bouquet', false);
      expect(bouquetStem.position.x).toBeCloseTo(0);
      expect(bouquetStem.position.y).toBeCloseTo(0.16);
      expect(bouquetStem.position.z).toBeCloseTo(0.52);
    });

    it('elevates stem base when selected (tactile lift feedback)', () => {
      const unselected = computeStemTransform({ x: 640, y: 500 }, 1, 0, 'vase', false);
      const selected = computeStemTransform({ x: 640, y: 500 }, 1, 0, 'vase', true);
      expect(selected.position.y - unselected.position.y).toBeCloseTo(0.35);
    });

    it('fans stem head angle based on lateral position dx and row position dy', () => {
      const leftStem = computeStemTransform({ x: 500, y: 500 }, 1, 0, 'vase', false);
      const rightStem = computeStemTransform({ x: 780, y: 500 }, 1, 0, 'vase', false);
      expect(leftStem.rotation.z).toBeGreaterThan(0); // in Three coordinate convention, +Z rotation tilts +Y vector to -X (left)
      expect(rightStem.rotation.z).toBeLessThan(0); // -Z rotation tilts +Y vector to +X (right)
      expect(leftStem.headPosition.x).toBeLessThan(0);
      expect(rightStem.headPosition.x).toBeGreaterThan(0);
    });
  });
});
