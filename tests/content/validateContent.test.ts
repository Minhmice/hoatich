import { describe, it, expect } from 'vitest';
import type { ContentBundle, RequirementKind } from '../../src/game/content/types';
import { contentBundle } from '../../src/game/content';
import {
  validateContent,
  assertValidContent,
} from '../../src/game/content/validateContent';

function createValidFixture(): ContentBundle {
  return {
    flowers: [
      {
        id: 'flower-rose',
        displayName: 'Hoa Hồng',
        world: 'living',
        colors: ['red'],
        meanings: ['love'],
        emotionalTags: ['romantic'],
        seasonTags: ['spring'],
        description: 'Bông hồng tươi thắm',
        price: 15,
        unlockFlag: 'flag-rose-unlocked',
      },
    ],
    customers: [
      {
        id: 'customer-bac-ba',
        name: 'Bác Ba',
        description: 'Khách quen',
        portraitKey: 'customer-one',
      },
    ],
    orders: [
      {
        id: 'order-1',
        dayId: 'day-1',
        shift: 'living',
        customerId: 'customer-bac-ba',
        recipient: 'deceased',
        openingDialogueId: 'diag-start',
        explicitRequirements: [{ kind: 'flower', value: 'flower-rose', min: 1 }],
        preferences: [{ kind: 'color', value: 'red' }],
        taboos: [],
        resonanceRules: [
          {
            id: 'rule-1',
            requirements: [{ kind: 'tag', value: 'romantic' }],
            conditions: [{ flag: 'flag-heard-story', equals: true }],
            effects: [{ type: 'setFlag', flag: 'flag-resonant', value: true }],
          },
        ],
        resultDialogueIds: {
          missed: 'diag-missed',
          accepted: 'diag-accepted',
          resonant: 'diag-resonant',
        },
        effects: {
          accepted: [{ type: 'relationship', customerId: 'customer-bac-ba', amount: 1 }],
          resonant: [{ type: 'journal', entryId: 'journal-entry-1' }],
        },
      },
    ],
    dialogue: [
      {
        id: 'diag-start',
        speakerId: 'customer-bac-ba',
        text: 'Xin chào tiệm hoa.',
        nextId: 'diag-choice-node',
      },
      {
        id: 'diag-choice-node',
        speakerId: 'player',
        text: 'Bác cần hoa gì?',
        choices: [
          {
            id: 'choice-1',
            text: 'Tôi có hoa hồng đỏ.',
            nextId: 'diag-accepted',
            conditions: [{ flag: 'flag-heard-story', equals: true }],
            effects: [{ type: 'unlockFlower', flowerId: 'flower-rose' }],
          },
        ],
      },
      {
        id: 'diag-missed',
        speakerId: 'customer-bac-ba',
        text: 'Hoa này không hợp rồi...',
      },
      {
        id: 'diag-accepted',
        speakerId: 'customer-bac-ba',
        text: 'Cảm ơn cháu, đúng thứ bác tìm.',
      },
      {
        id: 'diag-resonant',
        speakerId: 'customer-bac-ba',
        text: 'Ôi, chính là bông hoa ấy...',
      },
    ],
    flags: ['flag-rose-unlocked', 'flag-heard-story', 'flag-resonant'],
    journal: [
      {
        id: 'journal-entry-1',
        title: 'Ký ức Bác Ba',
        text: 'Bác Ba luôn nhớ về người vợ quá cố.',
      },
    ],
    assetKeys: ['customer-one', 'player'],
  };
}

describe('validateContent - narrative validation behavior', () => {
  it('valid custom fixture returns zero issues and passes assertValidContent', () => {
    const fixture = createValidFixture();
    const issues = validateContent(fixture);
    expect(issues).toEqual([]);
    expect(() => assertValidContent(fixture)).not.toThrow();
  });

  it('validates checked-in production content bundle without issues', () => {
    const issues = validateContent(contentBundle);
    expect(issues).toEqual([]);
    expect(() => assertValidContent(contentBundle)).not.toThrow();
  });

  describe('missing references', () => {
    it('detects missing customer in order.customerId', () => {
      const fixture = createValidFixture();
      fixture.orders[0].customerId = 'missing-customer-id';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_CUSTOMER',
        entityId: 'order-1',
        message: expect.stringContaining('missing-customer-id'),
      });
      expect(() => assertValidContent(fixture)).toThrow(/MISSING_CUSTOMER/);
    });

    it('detects missing speaker in dialogue node', () => {
      const fixture = createValidFixture();
      fixture.dialogue[0].speakerId = 'unknown-speaker';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_CUSTOMER',
        entityId: 'diag-start',
        message: expect.stringContaining('unknown-speaker'),
      });
    });

    it('detects missing opening dialogue in order', () => {
      const fixture = createValidFixture();
      fixture.orders[0].openingDialogueId = 'missing-opening-dialogue';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_DIALOGUE',
        entityId: 'order-1',
        message: expect.stringContaining('missing-opening-dialogue'),
      });
    });

    it('detects missing dialogue in node nextId and choice nextId', () => {
      const fixture = createValidFixture();
      fixture.dialogue[0].nextId = 'missing-next-node';
      fixture.dialogue[1].choices![0].nextId = 'missing-choice-next';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_DIALOGUE',
        entityId: 'diag-start',
        message: expect.stringContaining('missing-next-node'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_DIALOGUE',
        entityId: 'diag-choice-node',
        message: expect.stringContaining('missing-choice-next'),
      });
    });

    it('detects missing asset key for customer portraitKey', () => {
      const fixture = createValidFixture();
      fixture.customers[0].portraitKey = 'passerby'; // valid portraitKey type, but not in assetKeys
      fixture.assetKeys = ['player'];

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_ASSET_KEY',
        entityId: 'customer-bac-ba',
        message: expect.stringContaining('passerby'),
      });
    });
  });

  describe('duplicates', () => {
    it('detects duplicate flower, customer, order, dialogue, flag, journal, and asset IDs', () => {
      const fixture = createValidFixture();
      fixture.flowers.push({ ...fixture.flowers[0] });
      fixture.customers.push({ ...fixture.customers[0] });
      fixture.orders.push({ ...fixture.orders[0] });
      fixture.dialogue.push({ ...fixture.dialogue[0] });
      fixture.flags.push(fixture.flags[0]);
      fixture.journal.push({ ...fixture.journal[0] });
      fixture.assetKeys.push(fixture.assetKeys[0]);

      const issues = validateContent(fixture);
      const duplicateCodes = issues.filter((i) => i.code === 'DUPLICATE_ID');
      expect(duplicateCodes.length).toBe(7);
      expect(duplicateCodes.map((i) => i.entityId)).toEqual(
        expect.arrayContaining([
          'flower-rose',
          'customer-bac-ba',
          'order-1',
          'diag-start',
          'flag-rose-unlocked',
          'journal-entry-1',
          'customer-one',
        ]),
      );
    });

    it('detects duplicate choice IDs within a single dialogue node', () => {
      const fixture = createValidFixture();
      fixture.dialogue[1].choices = [
        { id: 'dup-choice', text: 'Option A' },
        { id: 'dup-choice', text: 'Option B' },
      ];

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'DUPLICATE_ID',
        entityId: 'dup-choice',
        message: expect.stringContaining('diag-choice-node'),
      });
    });
  });

  describe('taboo requirement flower missing', () => {
    it('detects missing flower in order taboos', () => {
      const fixture = createValidFixture();
      fixture.orders[0].taboos = [{ kind: 'flower', value: 'flower-phantom' }];

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_FLOWER',
        entityId: 'order-1',
        message: expect.stringContaining('flower-phantom'),
      });
    });
  });

  describe('result dialogue missing', () => {
    it('detects missing result dialogue for resonant outcome', () => {
      const fixture = createValidFixture();
      fixture.orders[0].resultDialogueIds.resonant = 'missing-resonant-dialogue';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_RESULT_DIALOGUE',
        entityId: 'order-1',
        message: expect.stringContaining('missing-resonant-dialogue'),
      });
    });

    it('detects missing result dialogue for missed and accepted outcomes', () => {
      const fixture = createValidFixture();
      fixture.orders[0].resultDialogueIds.missed = 'missing-missed-dialogue';
      fixture.orders[0].resultDialogueIds.accepted = 'missing-accepted-dialogue';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_RESULT_DIALOGUE',
        entityId: 'order-1',
        message: expect.stringContaining('missing-missed-dialogue'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_RESULT_DIALOGUE',
        entityId: 'order-1',
        message: expect.stringContaining('missing-accepted-dialogue'),
      });
    });
  });

  describe('invalid count and kind', () => {
    it('detects non-positive integer requirement min values', () => {
      const fixture = createValidFixture();
      fixture.orders[0].explicitRequirements = [
        { kind: 'flower', value: 'flower-rose', min: 0 },
        { kind: 'flower', value: 'flower-rose', min: -2 },
        { kind: 'flower', value: 'flower-rose', min: 1.5 },
      ];

      const issues = validateContent(fixture);
      const minIssues = issues.filter((i) => i.code === 'INVALID_REQUIREMENT_MIN');
      expect(minIssues.length).toBe(3);
      for (const issue of minIssues) {
        expect(issue.entityId).toBe('order-1');
      }
    });

    it('detects unsupported requirement kind', () => {
      const fixture = createValidFixture();
      const invalidKind = 'weapon' as unknown as RequirementKind;
      fixture.orders[0].preferences = [
        { kind: invalidKind, value: 'sword' },
      ];

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'INVALID_REQUIREMENT_KIND',
        entityId: 'order-1',
        message: expect.stringContaining('weapon'),
      });
    });
  });

  describe('missing effect references and conditions', () => {
    it('detects missing target IDs in all effect types across choices, rules, and outcomes', () => {
      const fixture = createValidFixture();
      fixture.dialogue[1].choices![0].effects = [
        { type: 'unlockFlower', flowerId: 'missing-flower-target' },
      ];
      fixture.orders[0].resonanceRules[0].effects = [
        { type: 'setFlag', flag: 'missing-flag-target', value: true },
      ];
      fixture.orders[0].effects = {
        accepted: [{ type: 'relationship', customerId: 'missing-customer-target', amount: 2 }],
        resonant: [{ type: 'journal', entryId: 'missing-journal-target' }],
      };

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_FLOWER',
        entityId: 'diag-choice-node',
        message: expect.stringContaining('missing-flower-target'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_FLAG',
        entityId: 'order-1',
        message: expect.stringContaining('missing-flag-target'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_CUSTOMER',
        entityId: 'order-1',
        message: expect.stringContaining('missing-customer-target'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_JOURNAL',
        entityId: 'order-1',
        message: expect.stringContaining('missing-journal-target'),
      });
    });

    it('detects missing flags in choice and resonance rule conditions', () => {
      const fixture = createValidFixture();
      fixture.dialogue[1].choices![0].conditions = [
        { flag: 'missing-condition-flag-1', equals: true },
      ];
      fixture.orders[0].resonanceRules[0].conditions = [
        { flag: 'missing-condition-flag-2', equals: true },
      ];

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_FLAG',
        entityId: 'diag-choice-node',
        message: expect.stringContaining('missing-condition-flag-1'),
      });
      expect(issues).toContainEqual({
        code: 'MISSING_FLAG',
        entityId: 'order-1',
        message: expect.stringContaining('missing-condition-flag-2'),
      });
    });
  });
  describe('effect payload validation', () => {
    it('rejects valid customer relationship with NaN or Infinity amount', () => {
      const fixtureNan = createValidFixture();
      fixtureNan.orders[0].effects = {
        accepted: [{ type: 'relationship', customerId: 'customer-bac-ba', amount: Number.NaN }],
      };
      const nanIssues = validateContent(fixtureNan);
      expect(nanIssues).toContainEqual({
        code: 'INVALID_EFFECT_AMOUNT',
        entityId: 'order-1',
        message: expect.stringContaining('NaN'),
      });

      const fixtureInf = createValidFixture();
      fixtureInf.orders[0].effects = {
        accepted: [{ type: 'relationship', customerId: 'customer-bac-ba', amount: Number.POSITIVE_INFINITY }],
      };
      const infIssues = validateContent(fixtureInf);
      expect(infIssues).toContainEqual({
        code: 'INVALID_EFFECT_AMOUNT',
        entityId: 'order-1',
        message: expect.stringContaining('Infinity'),
      });
    });

    it('rejects setFlag with Infinity value and non-primitive runtime values', () => {
      const fixtureInf = createValidFixture();
      fixtureInf.orders[0].resonanceRules[0].effects = [
        { type: 'setFlag', flag: 'flag-resonant', value: Number.POSITIVE_INFINITY },
      ];
      const infIssues = validateContent(fixtureInf);
      expect(infIssues).toContainEqual({
        code: 'INVALID_EFFECT_VALUE',
        entityId: 'order-1',
        message: expect.stringContaining('Infinity'),
      });

      const fixtureBad = createValidFixture();
      const rawNull: unknown = null;
      const rawObject: unknown = { bad: 'object' };
      fixtureBad.dialogue[1].choices![0].effects = [
        { type: 'setFlag', flag: 'flag-rose-unlocked', value: rawNull as boolean },
        { type: 'setFlag', flag: 'flag-heard-story', value: rawObject as string },
      ];
      const badIssues = validateContent(fixtureBad);
      const valIssues = badIssues.filter((i) => i.code === 'INVALID_EFFECT_VALUE');
      expect(valIssues.length).toBe(2);
      expect(valIssues[0].entityId).toBe('diag-choice-node');
      expect(valIssues[1].entityId).toBe('diag-choice-node');
    });

    it('accepts normal finite relationship amount and valid setFlag values', () => {
      const fixture = createValidFixture();
      fixture.orders[0].effects = {
        accepted: [
          { type: 'relationship', customerId: 'customer-bac-ba', amount: 15 },
          { type: 'relationship', customerId: 'customer-bac-ba', amount: -5 },
        ],
        resonant: [
          { type: 'setFlag', flag: 'flag-resonant', value: 42 },
          { type: 'setFlag', flag: 'flag-heard-story', value: 'unlocked' },
          { type: 'setFlag', flag: 'flag-rose-unlocked', value: true },
        ],
      };

      const issues = validateContent(fixture);
      const effectIssues = issues.filter(
        (i) => i.code === 'INVALID_EFFECT_AMOUNT' || i.code === 'INVALID_EFFECT_VALUE',
      );
      expect(effectIssues).toEqual([]);
    });
  });

  describe('prices and unlock flags', () => {
    it('detects negative or non-finite flower prices', () => {
      const fixture = createValidFixture();
      fixture.flowers[0].price = -5;

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'INVALID_PRICE',
        entityId: 'flower-rose',
        message: expect.stringContaining('-5'),
      });
    });

    it('detects missing unlock flag in flower definition', () => {
      const fixture = createValidFixture();
      fixture.flowers[0].unlockFlag = 'missing-unlock-flag-xyz';

      const issues = validateContent(fixture);
      expect(issues).toContainEqual({
        code: 'MISSING_UNLOCK_FLAG',
        entityId: 'flower-rose',
        message: expect.stringContaining('missing-unlock-flag-xyz'),
      });
    });
  });

  describe('deterministic sorting', () => {
    it('sorts multiple issues deterministically by code, then entityId, then message', () => {
      const fixture = createValidFixture();
      fixture.flowers[0].price = -10; // INVALID_PRICE
      fixture.orders[0].customerId = 'missing-cust-z'; // MISSING_CUSTOMER
      fixture.orders[0].openingDialogueId = 'missing-diag-a'; // MISSING_DIALOGUE
      fixture.flags.push(fixture.flags[0]); // DUPLICATE_ID

      const issues = validateContent(fixture);
      expect(issues.length).toBeGreaterThan(1);

      for (let i = 0; i < issues.length - 1; i++) {
        const curr = issues[i];
        const next = issues[i + 1];
        const codeCmp = curr.code.localeCompare(next.code);
        if (codeCmp !== 0) {
          expect(codeCmp).toBeLessThan(0);
        } else {
          const entityCmp = curr.entityId.localeCompare(next.entityId);
          if (entityCmp !== 0) {
            expect(entityCmp).toBeLessThan(0);
          } else {
            expect(curr.message.localeCompare(next.message)).toBeLessThanOrEqual(0);
          }
        }
      }
    });
  });
});
