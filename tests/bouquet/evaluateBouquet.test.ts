import { describe, expect, it } from 'vitest';
import { contentBundle } from '../../src/game/content';
import { BouquetModel, evaluateBouquet, type BouquetItem } from '../../src/game/bouquet/evaluateBouquet';
import type { Effect, OrderDefinition } from '../../src/game/content/types';

describe('BouquetModel & evaluateBouquet', () => {
  const orderBacBa = contentBundle.orders.find((o) => o.id === 'order-01-bac-ba')!;
  const orderCoLien = contentBundle.orders.find((o) => o.id === 'order-02-co-lien')!;

  describe('BouquetModel operations & constraints', () => {
    it('validates finite coordinate inputs and rejects non-finite numbers', () => {
      const model = new BouquetModel();

      expect(() => model.add('hoa-cuc-trang', { x: Number.NaN, y: 400 })).toThrow();
      expect(() => model.add('hoa-cuc-trang', { x: 600, y: Number.POSITIVE_INFINITY })).toThrow();

      model.add('hoa-cuc-trang', { x: 600, y: 400 });
      const item = model.items[0];

      expect(() => model.move(item.id, Number.NaN, 200)).toThrow();
      expect(() => model.move(item.id, 200, Number.NEGATIVE_INFINITY)).toThrow();
      expect(() => model.rotate(item.id, Number.NaN)).toThrow();
      expect(() => model.rotate(item.id, Number.POSITIVE_INFINITY)).toThrow();
      expect(() => model.reorder(item.id, 0 as -1 | 1)).toThrow();
    });

    it('validates known flower IDs', () => {
      const model = new BouquetModel();
      expect(() => model.add('unknown-fake-flower')).toThrow(/Unknown flower ID/);
    });

    it('tracks immutable snapshots for undo across add, move, rotate, reorder, remove, and clear', () => {
      const model = new BouquetModel();

      model.add('hoa-cuc-trang', { x: 500, y: 300 });
      expect(model.items.length).toBe(1);
      const item1Id = model.items[0].id;

      model.add('hoa-hong-do', { x: 600, y: 350 });
      expect(model.items.length).toBe(2);
      const item2Id = model.items[1].id;

      model.move(item1Id, 520, 310);
      expect(model.items[0].position).toEqual({ x: 520, y: 310 });

      model.rotate(item2Id, 45);
      expect(model.items[1].rotation).toBe(45);

      model.reorder(item2Id, -1);
      expect(model.items[0].id).toBe(item2Id);
      expect(model.items[0].layer).toBe(0);
      expect(model.items[1].id).toBe(item1Id);
      expect(model.items[1].layer).toBe(1);

      model.remove(item2Id);
      expect(model.items.length).toBe(1);
      expect(model.items[0].id).toBe(item1Id);

      model.clear();
      expect(model.items.length).toBe(0);

      // Undo clear -> restores 1 item
      model.undo();
      expect(model.items.length).toBe(1);
      expect(model.items[0].id).toBe(item1Id);

      // Undo remove -> restores 2 items in reordered positions
      model.undo();
      expect(model.items.length).toBe(2);
      expect(model.items[0].id).toBe(item2Id);
      expect(model.items[1].id).toBe(item1Id);

      // Undo reorder -> item1 is first
      model.undo();
      expect(model.items[0].id).toBe(item1Id);
      expect(model.items[1].id).toBe(item2Id);

      // Undo rotate -> rotation restored to 0
      model.undo();
      expect(model.items[1].rotation).toBe(0);

      // Undo move -> position restored
      model.undo();
      expect(model.items[0].position).toEqual({ x: 500, y: 300 });

      // Undo second add -> 1 item left
      model.undo();
      expect(model.items.length).toBe(1);

      // Undo first add -> 0 items left
      model.undo();
      expect(model.items.length).toBe(0);
    });

    it('returns frozen items and protects internal state against direct external mutation', () => {
      const model = new BouquetModel();
      model.add('hoa-cuc-trang', { x: 640, y: 410 });

      const items = model.items;
      expect(Object.isFrozen(items)).toBe(true);
      expect(Object.isFrozen(items[0])).toBe(true);
      expect(Object.isFrozen(items[0].position)).toBe(true);
    });

    it('restores predrag on single undo after multiple drag moves while separate keyboard moves restore one at a time', () => {
      const model = new BouquetModel();
      model.add('hoa-cuc-trang', { x: 500, y: 300 });
      const itemId = model.items[0].id;

      // One drag gesture emitting multiple move samples
      model.beginGesture();
      model.move(itemId, 510, 305);
      model.move(itemId, 520, 310);
      model.move(itemId, 550, 330);
      model.move(itemId, 600, 360);
      model.endGesture();

      expect(model.items[0].position).toEqual({ x: 600, y: 360 });

      // Single undo restores pre-drag position
      model.undo();
      expect(model.items[0].position).toEqual({ x: 500, y: 300 });

      // Separate keyboard moves outside gesture restore one at a time
      model.move(itemId, 510, 300);
      model.move(itemId, 520, 300);
      model.move(itemId, 530, 300);
      expect(model.items[0].position).toEqual({ x: 530, y: 300 });

      model.undo();
      expect(model.items[0].position).toEqual({ x: 520, y: 300 });

      model.undo();
      expect(model.items[0].position).toEqual({ x: 510, y: 300 });

      model.undo();
      expect(model.items[0].position).toEqual({ x: 500, y: 300 });
    });

    it('maintains coherent undo semantics for empty gestures and item removal during gesture', () => {
      const model = new BouquetModel();
      model.add('hoa-cuc-trang', { x: 500, y: 300 });
      model.add('hoa-hong-do', { x: 600, y: 350 });
      const item2Id = model.items[1].id;

      // Gesture with no mutation does not record redundant history snapshot
      model.beginGesture();
      model.endGesture();

      // Gesture with move then remove captures initial state and restores completely on undo
      model.beginGesture();
      model.move(item2Id, 620, 370);
      model.remove(item2Id);
      model.endGesture();

      expect(model.items.length).toBe(1);

      model.undo();
      expect(model.items.length).toBe(2);
      expect(model.items[1].id).toBe(item2Id);
      expect(model.items[1].position).toEqual({ x: 600, y: 350 });
    });
  });

  describe('evaluateBouquet logic', () => {
    it('returns missed when explicit requirements are missing', () => {
      const model = new BouquetModel();
      // Bac Ba explicitly requires hoa-cuc-trang
      model.add('hoa-hong-do');

      const result = evaluateBouquet(orderBacBa, model, { flags: {} });
      expect(result.outcome).toBe('missed');
      expect(result.reasonIds).toContain('missing:hoa-cuc-trang');
      expect(result.matchedRuleIds).toEqual([]);
    });

    it('accepts order when explicit requirements met but hidden context is unknown', () => {
      const model = new BouquetModel();
      model.add('hoa-cuc-trang');

      // Player has not discovered the wife's memory flag
      const resultWithoutSecret = evaluateBouquet(orderBacBa, model, { flags: {} });
      expect(resultWithoutSecret.outcome).toBe('accepted');
      expect(resultWithoutSecret.matchedRuleIds).toEqual([]);
      expect(resultWithoutSecret.effects.length).toBeGreaterThan(0);

      // Even if player placed the resonance flower by chance, without the flag it is accepted, not resonant
      const modelWithThuyTien = new BouquetModel();
      modelWithThuyTien.add('hoa-cuc-trang');
      modelWithThuyTien.add('hoa-thuy-tien');

      const resultWithFlowerOnly = evaluateBouquet(orderBacBa, modelWithThuyTien, { flags: {} });
      expect(resultWithFlowerOnly.outcome).toBe('accepted');
      expect(resultWithFlowerOnly.matchedRuleIds).toEqual([]);
    });

    it('taboo overrides preferences and explicit requirements returning missed', () => {
      const model = new BouquetModel();
      // Co Lien explicitly requires hoa-huong-duong and taboos hoa-cuc-trang (mourning)
      model.add('hoa-huong-duong');
      model.add('hoa-cuc-trang');

      const result = evaluateBouquet(orderCoLien, model, { flags: {} });
      expect(result.outcome).toBe('missed');
      expect(result.reasonIds).toContain('taboo:hoa-cuc-trang');
      expect(result.matchedRuleIds).toEqual([]);

      // Bac Ba taboos dead-world flowers (hoa-hoang-tuyen)
      const modelBacBaWithTaboo = new BouquetModel();
      modelBacBaWithTaboo.add('hoa-cuc-trang');
      modelBacBaWithTaboo.add('hoa-hoang-tuyen');

      const resultBacBaTaboo = evaluateBouquet(orderBacBa, modelBacBaWithTaboo, { flags: {} });
      expect(resultBacBaTaboo.outcome).toBe('missed');
      expect(resultBacBaTaboo.reasonIds).toContain('taboo:dead');
    });

    it('returns resonant and merges rule effects when requirements and conditions both match', () => {
      const model = new BouquetModel();
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
      const comp1 = new BouquetModel();
      comp1.add('hoa-cuc-trang', { x: 200, y: 150 });
      comp1.add('hoa-sen-hong', { x: 700, y: 500 });

      const comp2 = new BouquetModel();
      comp2.add('hoa-sen-hong', { x: 300, y: 400 });
      comp2.add('hoa-cuc-trang', { x: 640, y: 410 });
      comp2.rotate(comp2.items[1].id, 90);

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

      const model = new BouquetModel();
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
