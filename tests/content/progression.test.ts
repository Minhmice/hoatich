import { describe, expect, it } from 'vitest';
import { contentBundle, getFeatures, getOrderArrangement, getOrderNote, getUnlockedSpeciesForDay } from '../../src/game/content';

describe('progressive authored content', () => {
  it('unlocks one cumulative species each authored day and schedules finishing features', () => {
    const days = ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6'];
    const counts = days.map((day) => getUnlockedSpeciesForDay(day).length);
    expect(counts).toEqual([1, 2, 3, 4, 5, 6]);
    expect(days.map(getFeatures)).toEqual([
      { paper: false, ribbon: false, cards: false },
      { paper: true, ribbon: false, cards: false },
      { paper: true, ribbon: true, cards: false },
      { paper: true, ribbon: true, cards: true },
      { paper: true, ribbon: true, cards: true },
      { paper: true, ribbon: true, cards: true },
    ]);
  });

  it('keeps four customers per day and all explicit flowers unlocked on that day', () => {
    for (const day of ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6']) {
      const orders = contentBundle.orders.filter((order) => order.dayId === day);
      expect(new Set(orders.map((order) => order.customerId)).size).toBe(4);
      const unlocked = new Set(getUnlockedSpeciesForDay(day));
      for (const order of orders) {
        for (const requirement of order.explicitRequirements) {
          if (requirement.kind === 'flower') expect(unlocked.has(requirement.value), `${order.id}: ${requirement.value}`).toBe(true);
        }
      }
    }
  });

  it('reveals detail notes only after corresponding heard flag', () => {
    const order = contentBundle.orders.find((entry) => entry.noteDetail?.length) as NonNullable<typeof contentBundle.orders[number]>;
    expect(getOrderNote(order.id, {})).not.toContain(order.noteDetail![0]);
    expect(getOrderNote(order.id, { [`flag_heard_detail_${order.id}`]: true })).toContain(order.noteDetail![0]);
  });

  it('provides arrangement ranges within supported stem capacity', () => {
    for (const order of contentBundle.orders) {
      const arrangement = getOrderArrangement(order.id);
      expect(arrangement.minStems).toBeGreaterThanOrEqual(3);
      expect(arrangement.maxStems).toBeLessThanOrEqual(15);
      expect(arrangement.maxStems).toBeGreaterThanOrEqual(arrangement.minStems);
    }
  });
});
