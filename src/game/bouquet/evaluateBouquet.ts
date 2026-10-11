import { contentBundle } from '../content';
import type { Effect, FlowerDefinition, OrderDefinition, Outcome, Requirement } from '../content/types';
import { BouquetModel, type BouquetItem } from './BouquetModel';

export { BouquetModel, type BouquetItem };

function flowerMatchesTaboo(flower: FlowerDefinition, taboo: Requirement): boolean {
  switch (taboo.kind) {
    case 'flower':
      return flower.id === taboo.value;
    case 'tag': {
      const tag = taboo.value.toLowerCase();
      return (
        flower.meanings.some((meaning) => meaning.toLowerCase() === tag) ||
        flower.emotionalTags.some((emotionalTag) => emotionalTag.toLowerCase() === tag)
      );
    }
    case 'color':
      return flower.colors.some((color) => color.toLowerCase() === taboo.value.toLowerCase());
    case 'world':
      return flower.world === taboo.value;
    default:
      return false;
  }
}

function flowerMatchesRequirement(flower: FlowerDefinition, requirement: Requirement): boolean {
  switch (requirement.kind) {
    case 'flower':
      return flower.id === requirement.value;
    case 'tag': {
      const tag = requirement.value.toLowerCase();
      return (
        flower.meanings.some((meaning) => meaning.toLowerCase() === tag) ||
        flower.emotionalTags.some((emotionalTag) => emotionalTag.toLowerCase() === tag)
      );
    }
    case 'color':
      return flower.colors.some((color) => color.toLowerCase() === requirement.value.toLowerCase());
    case 'world':
      if (flower.world === requirement.value) return true;
      if (
        flower.world === 'both' &&
        (requirement.value === 'living' || requirement.value === 'dead')
      ) {
        return true;
      }
      return false;
    default:
      return false;
  }
}

export function evaluateBouquet(
  order: OrderDefinition,
  bouquet: BouquetModel | readonly BouquetItem[],
  context: { flags: Record<string, boolean | number | string> },
): {
  outcome: Outcome;
  reasonIds: string[];
  effects: Effect[];
  matchedRuleIds: string[];
} {
  const items: readonly BouquetItem[] = bouquet instanceof BouquetModel ? bouquet.items : bouquet;

  const flowers = items
    .map((item) => contentBundle.flowers.find((f) => f.id === item.flowerId))
    .filter((f): f is FlowerDefinition => f !== undefined);

  const tabooReasons: string[] = [];
  for (const taboo of order.taboos) {
    const count = flowers.filter((flower) => flowerMatchesTaboo(flower, taboo)).length;
    const min = taboo.min ?? 1;
    if (count >= min) {
      tabooReasons.push(`taboo:${taboo.value}`, `taboo:${taboo.kind}:${taboo.value}`);
    }
  }

  const missingRequirementReasons: string[] = [];
  for (const requirement of order.explicitRequirements) {
    const count = flowers.filter((flower) => flowerMatchesRequirement(flower, requirement)).length;
    const min = requirement.min ?? 1;
    if (count < min) {
      missingRequirementReasons.push(
        `missing:${requirement.value}`,
        `missing:${requirement.kind}:${requirement.value}`,
      );
    }
  }

  if (tabooReasons.length > 0 || missingRequirementReasons.length > 0) {
    const outcomeEffects = (order.effects?.missed ?? []).map((effect) => ({ ...effect }));
    return {
      outcome: 'missed',
      reasonIds: [...tabooReasons, ...missingRequirementReasons],
      effects: outcomeEffects,
      matchedRuleIds: [],
    };
  }

  const matchedRuleIds: string[] = [];
  const matchedRuleEffects: Effect[] = [];

  for (const rule of order.resonanceRules) {
    const conditionsMet = rule.conditions.every(
      (condition) => context.flags[condition.flag] === condition.equals,
    );
    if (!conditionsMet) continue;

    const requirementsMet = rule.requirements.every((requirement) => {
      const count = flowers.filter((flower) => flowerMatchesRequirement(flower, requirement)).length;
      const min = requirement.min ?? 1;
      return count >= min;
    });
    if (!requirementsMet) continue;

    matchedRuleIds.push(rule.id);
    matchedRuleEffects.push(...rule.effects.map((effect) => ({ ...effect })));
  }

  const outcome: Outcome = matchedRuleIds.length > 0 ? 'resonant' : 'accepted';
  const reasonIds: string[] =
    outcome === 'resonant' ? [...matchedRuleIds] : ['accepted:explicit-requirements-met'];

  const outcomeEffects = (order.effects?.[outcome] ?? []).map((effect) => ({ ...effect }));
  const effects = [...outcomeEffects, ...matchedRuleEffects];

  return {
    outcome,
    reasonIds,
    effects,
    matchedRuleIds,
  };
}
