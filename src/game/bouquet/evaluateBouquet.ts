import { contentBundle } from '../content';
import { getCardChoices, getFeatures, getOrderArrangement } from '../content/progression';
import type { BouquetSubmission, Effect, FlowerDefinition, OrderDefinition, Outcome, Requirement, RequiredFinish } from '../content/types';
import { BouquetModel, type BouquetItem } from './BouquetModel';

export { BouquetModel, type BouquetItem };

export function flowerMatchesTaboo(flower: FlowerDefinition, taboo: Requirement): boolean {
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

export function flowerMatchesRequirement(flower: FlowerDefinition, requirement: Requirement): boolean {
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


export interface BouquetEvaluation {
  outcome: Outcome;
  reasonIds: string[];
  effects: Effect[];
  matchedRuleIds: string[];
  metadataChecked: boolean;
}

function submissionOf(bouquet: BouquetModel | BouquetSubmission | readonly BouquetItem[]): BouquetSubmission | undefined {
  if (bouquet instanceof BouquetModel) return undefined;
  if (Array.isArray(bouquet)) return undefined;
  return bouquet as BouquetSubmission;
}

function finishReasons(required: RequiredFinish | undefined, submission: BouquetSubmission, order: OrderDefinition): string[] {
  if (!required) return [];
  const reasons: string[] = [];
  const dayFeatures = getFeatures(order.dayId);
  if (required.paper && dayFeatures.paper && submission.finish.paper !== required.paper) reasons.push(`finish:paper:${required.paper}`);
  if (required.ribbon && dayFeatures.ribbon && (submission.finish.ribbon !== required.ribbon || submission.finish.bowStep !== 3)) reasons.push(`finish:ribbon:${required.ribbon}`);
  if (required.requireCard && dayFeatures.cards && !submission.finish.cardId) reasons.push('finish:card:required');
  if (required.targetTone && submission.finish.cardId) {
    const card = getCardChoices(order.id).find((choice) => choice.id === submission.finish.cardId);
    if (!card) reasons.push('finish:card:unknown');
    else if (card.tone !== required.targetTone) reasons.push(`finish:card-tone:${required.targetTone}`);
  }
  return reasons;
}

export function evaluateBouquet(
  order: OrderDefinition,
  bouquet: BouquetModel | BouquetSubmission | readonly BouquetItem[],
  context: { flags: Record<string, boolean | number | string> },
): BouquetEvaluation {
  const submission = submissionOf(bouquet);
  const items: readonly BouquetItem[] = submission
    ? submission.items
    : bouquet instanceof BouquetModel ? bouquet.items : bouquet as readonly BouquetItem[];
  const flowers = items
    .map((item) => contentBundle.flowers.find((f) => f.id === item.flowerId))
    .filter((f): f is FlowerDefinition => f !== undefined);

  const reasons: string[] = [];
  for (const taboo of order.taboos) {
    if (flowers.filter((flower) => flowerMatchesTaboo(flower, taboo)).length >= (taboo.min ?? 1)) {
      reasons.push(`taboo:${taboo.value}`, `taboo:${taboo.kind}:${taboo.value}`);
    }
  }
  for (const requirement of order.explicitRequirements) {
    if (flowers.filter((flower) => flowerMatchesRequirement(flower, requirement)).length < (requirement.min ?? 1)) {
      reasons.push(`missing:${requirement.value}`, `missing:${requirement.kind}:${requirement.value}`);
    }
  }

  const metadataChecked = submission !== undefined;
  const arrangementReasons: string[] = [];
  if (submission) {
    const arrangement = getOrderArrangement(order.id);
    if (submission.configuration.vessel !== arrangement.suggestedVessel) {
      arrangementReasons.push(`arrangement:vessel:${arrangement.suggestedVessel}`);
    }
    if (items.length < arrangement.minStems) {
      arrangementReasons.push('arrangement:too-few-stems');
    }
    if (items.length > arrangement.maxStems) {
      arrangementReasons.push('arrangement:too-many-stems');
    }
    reasons.push(...finishReasons(order.requiredFinish, submission, order));
  }
  if (reasons.length > 0) {
    return {
      outcome: 'missed',
      reasonIds: [...reasons, ...arrangementReasons],
      effects: (order.effects?.missed ?? []).map((effect) => ({ ...effect })),
      matchedRuleIds: [],
      metadataChecked,
    };
  }

  const matchedRuleIds: string[] = [];
  const matchedRuleEffects: Effect[] = [];
  for (const rule of order.resonanceRules) {
    if (!rule.conditions.every((condition) => context.flags[condition.flag] === condition.equals)) continue;
    if (!rule.requirements.every((requirement) => flowers.filter((flower) => flowerMatchesRequirement(flower, requirement)).length >= (requirement.min ?? 1))) continue;
    matchedRuleIds.push(rule.id);
    matchedRuleEffects.push(...rule.effects.map((effect) => ({ ...effect })));
  }

  if (arrangementReasons.length > 0) {
    return {
      outcome: 'accepted',
      reasonIds: ['accepted:suggestion-mismatch', ...arrangementReasons],
      effects: (order.effects?.accepted ?? []).map((effect) => ({ ...effect })),
      matchedRuleIds: [],
      metadataChecked,
    };
  }

  const outcome: Outcome = matchedRuleIds.length > 0 ? 'resonant' : 'accepted';
  return {
    outcome,
    reasonIds: outcome === 'resonant' ? [...matchedRuleIds] : ['accepted:explicit-requirements-met'],
    effects: [...(order.effects?.[outcome] ?? []).map((effect) => ({ ...effect })), ...matchedRuleEffects],
    matchedRuleIds,
    metadataChecked,
  };
}
