import { describe, expect, it } from 'vitest';
import { contentBundle } from '../../src/game/content';
import { evaluateBouquet } from '../../src/game/bouquet/evaluateBouquet';
import type { BouquetSubmission } from '../../src/game/bouquet/BouquetModel';

const order = contentBundle.orders.find((entry) => entry.id === 'order-04-02-co-lien')!;
const items = Array.from({ length: 6 }, (_, index) => ({
  id: `flower-${index}`,
  flowerId: index < 2 ? 'hoa-sen-hong' : 'hoa-huong-duong',
  position: { x: index, y: index },
  layer: index,
  rotation: 0,
  slotIndex: index,
  pose: 'center' as const,
}));
const submission: BouquetSubmission = {
  configuration: { vessel: 'vase', stemCount: 6 },
  items,
  finish: { paper: 'none', ribbon: 'none', bowStep: 0, cardId: 'card-comfort' },
};

describe('progressive evaluation', () => {
  it('checks actual arrangement and finish metadata for full submissions', () => {
    const result = evaluateBouquet(order, submission, { flags: {} });
    expect(result.metadataChecked).toBe(true);
    expect(result.outcome).toBe('accepted');
  });

  it('labels scalar MCP evaluation as metadata unchecked', () => {
    const result = evaluateBouquet(order, items, { flags: {} });
    expect(result.metadataChecked).toBe(false);
  });

  it('returns specific missed reasons for missing card and accepted suggestion for wrong vessel', () => {
    const wrongVesselResult = evaluateBouquet(order, {
      ...submission,
      configuration: { vessel: 'jar', stemCount: 6 },
    }, { flags: {} });
    expect(wrongVesselResult.outcome).toBe('accepted');
    expect(wrongVesselResult.reasonIds).toContain('accepted:suggestion-mismatch');
    expect(wrongVesselResult.reasonIds).toContain('arrangement:vessel:vase');

    const missingCardResult = evaluateBouquet(order, {
      ...submission,
      finish: { ...submission.finish, cardId: null },
    }, { flags: {} });
    expect(missingCardResult.outcome).toBe('missed');
    expect(missingCardResult.reasonIds).toContain('finish:card:required');
  });
});
