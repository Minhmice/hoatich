import { describe, expect, it } from 'vitest';
import { contentBundle } from '../../src/game/content';
import { BouquetModel, evaluateBouquet, type BouquetItem } from '../../src/game/bouquet/evaluateBouquet';
import type { Effect, OrderDefinition } from '../../src/game/content/types';

describe('BouquetModel & evaluateBouquet', () => {
  const orderBacBa = contentBundle.orders.find((o) => o.id === 'order-01-bac-ba')!;
  const orderCoLien = contentBundle.orders.find((o) => o.id === 'order-02-co-lien')!;

  describe('BouquetModel operations & constraints', () => {
    it('validates finite rotation inputs and rejects non-finite numbers', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');
      const item = model.items[0];

      expect(() => model.rotate(item.id, Number.NaN)).toThrow();
      expect(() => model.rotate(item.id, Number.POSITIVE_INFINITY)).toThrow();
    });

    it('validates known flower IDs', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      expect(() => model.add('unknown-fake-flower')).toThrow(/Unknown flower ID/);
    });

    it('tracks immutable snapshots for undo across add, rotate, remove, and clear', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });

      model.add('hoa-cuc-trang');
      expect(model.items.length).toBe(1);
      const item1Id = model.items[0].id;

      model.add('hoa-hong-do');
      expect(model.items.length).toBe(2);
      const item2Id = model.items[1].id;

      model.rotate(item2Id, 15);
      expect(model.items[1].rotation).toBe(model.slots[1].rotation + 15);

      model.remove(item2Id);
      expect(model.items.length).toBe(1);
      expect(model.items[0].id).toBe(item1Id);

      model.clear();
      expect(model.items.length).toBe(0);

      // Undo clear -> restores 1 item
      model.undo();
      expect(model.items.length).toBe(1);
      expect(model.items[0].id).toBe(item1Id);

      // Undo remove -> restores 2 items
      model.undo();
      expect(model.items.length).toBe(2);
      expect(model.items[0].id).toBe(item1Id);
      expect(model.items[1].id).toBe(item2Id);

      // Undo rotate -> rotation restored
      model.undo();
      expect(model.items[1].rotation).toBe(model.slots[1].rotation);

      // Undo second add -> 1 item left
      model.undo();
      expect(model.items.length).toBe(1);

      // Undo first add -> 0 items left
      model.undo();
      expect(model.items.length).toBe(0);
    });

    it('returns frozen items and protects internal state against direct external mutation', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');

      const items = model.items;
      expect(Object.isFrozen(items)).toBe(true);
      expect(Object.isFrozen(items[0])).toBe(true);
      expect(Object.isFrozen(items[0].position)).toBe(true);
    });

    it('batches continuous gesture rotation into a single undo step', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');
      const itemId = model.items[0].id;
      const initialRotation = model.items[0].rotation;

      model.beginGesture();
      model.rotate(itemId, 5);
      model.rotate(itemId, 5);
      model.rotate(itemId, 5);
      model.endGesture();

      expect(model.items[0].rotation).toBe(initialRotation + 15);

      model.undo();
      expect(model.items[0].rotation).toBe(initialRotation);
    });

    it('maintains coherent undo semantics for empty gestures and item removal during gesture', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');
      model.add('hoa-hong-do');
      const item2Id = model.items[1].id;

      // Gesture with no mutation does not record redundant history snapshot
      model.beginGesture();
      model.endGesture();

      // Gesture with rotate then remove captures initial state and restores completely on undo
      model.beginGesture();
      model.rotate(item2Id, 10);
      model.remove(item2Id);
      model.endGesture();

      expect(model.items.length).toBe(1);

      model.undo();
      expect(model.items.length).toBe(2);
      expect(model.items[1].id).toBe(item2Id);
    });
  });

  describe('evaluateBouquet logic', () => {
    it('returns missed when explicit requirements are missing', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      // Bac Ba explicitly requires hoa-cuc-trang
      model.add('hoa-hong-do');

      const result = evaluateBouquet(orderBacBa, model, { flags: {} });
      expect(result.outcome).toBe('missed');
      expect(result.reasonIds).toContain('missing:hoa-cuc-trang');
      expect(result.matchedRuleIds).toEqual([]);
    });

    it('accepts order when explicit requirements met but hidden context is unknown', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');

      // Player has not discovered the wife's memory flag
      const resultWithoutSecret = evaluateBouquet(orderBacBa, model, { flags: {} });
      expect(resultWithoutSecret.outcome).toBe('accepted');
      expect(resultWithoutSecret.matchedRuleIds).toEqual([]);
      expect(resultWithoutSecret.effects.length).toBeGreaterThan(0);

      // Even if player placed the resonance flower by chance, without the flag it is accepted, not resonant
      const modelWithThuyTien = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      modelWithThuyTien.add('hoa-cuc-trang');
      modelWithThuyTien.add('hoa-thuy-tien');

      const resultWithFlowerOnly = evaluateBouquet(orderBacBa, modelWithThuyTien, { flags: {} });
      expect(resultWithFlowerOnly.outcome).toBe('accepted');
      expect(resultWithFlowerOnly.matchedRuleIds).toEqual([]);
    });

    it('taboo overrides preferences and explicit requirements returning missed', () => {
      // Co Lien taboos dead-world flowers (hoa-hoang-tuyen)
      const modelCoLien = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      modelCoLien.add('hoa-cuc-trang');
      modelCoLien.add('hoa-hoang-tuyen');

      const resultCoLien = evaluateBouquet(orderCoLien, modelCoLien, { flags: {} });
      expect(resultCoLien.outcome).toBe('missed');
      expect(resultCoLien.reasonIds).toContain('taboo:dead');
      expect(resultCoLien.matchedRuleIds).toEqual([]);

      // Bac Ba taboos dead-world flowers (hoa-hoang-tuyen)
      const modelBacBaWithTaboo = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      modelBacBaWithTaboo.add('hoa-cuc-trang');
      modelBacBaWithTaboo.add('hoa-hoang-tuyen');

      const resultBacBaTaboo = evaluateBouquet(orderBacBa, modelBacBaWithTaboo, { flags: {} });
      expect(resultBacBaTaboo.outcome).toBe('missed');
      expect(resultBacBaTaboo.reasonIds).toContain('taboo:dead');
    });

    it('returns resonant and merges rule effects when requirements and conditions both match', () => {
      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');
      model.add('hoa-thuy-tien');

      const context = { flags: { flag_knows_bac_ba_wife_memory: true } };
      const result = evaluateBouquet(orderBacBa, model, context);

      expect(result.outcome).toBe('resonant');
      expect(result.matchedRuleIds).toContain('rule-bacba-thuytien');
      expect(result.reasonIds).toContain('rule-bacba-thuytien');

      // Resonant effects merge order.effects.resonant and rule.effects
      const relationshipEffects = result.effects.filter(
        (e): e is Extract<Effect, { type: 'relationship' }> => e.type === 'relationship',
      );
      expect(relationshipEffects.length).toBe(2);
      const totalAmount = relationshipEffects.reduce((sum, e) => sum + e.amount, 0);
      expect(totalAmount).toBe(25); // 10 from order resonant effect + 15 from rule effect
    });

    it('evaluates alternate compositions consistently regardless of position, layer, or rotation', () => {
      const comp1 = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      comp1.add('hoa-cuc-trang');
      comp1.add('hoa-sen-hong');

      const comp2 = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      comp2.add('hoa-sen-hong');
      comp2.add('hoa-cuc-trang');
      comp2.rotate(comp2.items[1].id, 10);

      const res1 = evaluateBouquet(orderBacBa, comp1, { flags: {} });
      const res2 = evaluateBouquet(orderBacBa, comp2, { flags: {} });

      expect(res1.outcome).toBe('accepted');
      expect(res2.outcome).toBe('accepted');
      expect(res1.reasonIds).toEqual(res2.reasonIds);
    });

    it('evaluates readonly BouquetItem array directly without BouquetModel wrapper', () => {
      const rawItems: readonly BouquetItem[] = [
        {
          id: 'manual-1',
          flowerId: 'hoa-cuc-trang',
          position: { x: 600, y: 400 },
          layer: 0,
          rotation: 0,
          slotIndex: 0,
          pose: 'center',
        },
      ];

      const result = evaluateBouquet(orderBacBa, rawItems, { flags: {} });
      expect(result.outcome).toBe('accepted');
    });

    it('does not mutate order, context, or bouquet input', () => {
      const frozenOrder: OrderDefinition = JSON.parse(JSON.stringify(orderBacBa));
      Object.freeze(frozenOrder);
      Object.freeze(frozenOrder.explicitRequirements);
      Object.freeze(frozenOrder.taboos);
      Object.freeze(frozenOrder.resonanceRules);

      const frozenContext = Object.freeze({
        flags: Object.freeze({ flag_knows_bac_ba_wife_memory: true }),
      });

      const model = new BouquetModel({ vessel: 'bouquet', stemCount: 5 });
      model.add('hoa-cuc-trang');
      model.add('hoa-thuy-tien');

      const itemsBefore = JSON.stringify(model.items);

      const result = evaluateBouquet(frozenOrder, model, frozenContext);

      expect(JSON.stringify(model.items)).toBe(itemsBefore);
      expect(result.outcome).toBe('resonant');

      // Modifying returned effects does not mutate order effects
      if (result.effects.length > 0) {
        (result.effects[0] as unknown as Record<string, unknown>).type = 'journal';
        expect(orderBacBa.effects?.resonant?.[0]?.type).toBe('relationship');
      }
    });
  });
});
