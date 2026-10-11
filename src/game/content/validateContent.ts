import type {
  ContentBundle,
  Effect,
  Outcome,
  Requirement,
  RequirementKind,
} from './types';

export interface ValidationIssue {
  code: string;
  entityId: string;
  message: string;
}

const SUPPORTED_REQUIREMENT_KINDS: Record<RequirementKind, true> = {
  flower: true,
  tag: true,
  world: true,
  color: true,
};

const REQUIRED_OUTCOMES: readonly Outcome[] = ['missed', 'accepted', 'resonant'];

function validateEffect(
  effect: Effect,
  entityId: string,
  context: string,
  issues: ValidationIssue[],
  flagSet: ReadonlySet<string>,
  customerSet: ReadonlySet<string>,
  flowerSet: ReadonlySet<string>,
  journalSet: ReadonlySet<string>,
): void {
  const raw: unknown = effect;
  if (
    typeof raw !== 'object' ||
    raw === null ||
    !('type' in raw) ||
    typeof raw.type !== 'string'
  ) {
    issues.push({
      code: 'INVALID_EFFECT_TYPE',
      entityId,
      message: `${context} has unsupported effect type "unknown"`,
    });
    return;
  }

  switch (effect.type) {
    case 'setFlag': {
      if (!flagSet.has(effect.flag)) {
        issues.push({
          code: 'MISSING_FLAG',
          entityId,
          message: `${context} references missing flag "${effect.flag}"`,
        });
      }
      const val = effect.value;
      const isValidValue =
        typeof val === 'boolean' ||
        typeof val === 'string' ||
        (typeof val === 'number' && Number.isFinite(val));
      if (!isValidValue) {
        issues.push({
          code: 'INVALID_EFFECT_VALUE',
          entityId,
          message: `${context} has invalid flag value "${String(val)}"; must be boolean, string, or finite number`,
        });
      }
      break;
    }
    case 'relationship': {
      if (!customerSet.has(effect.customerId)) {
        issues.push({
          code: 'MISSING_CUSTOMER',
          entityId,
          message: `${context} references missing customer "${effect.customerId}"`,
        });
      }
      if (typeof effect.amount !== 'number' || !Number.isFinite(effect.amount)) {
        issues.push({
          code: 'INVALID_EFFECT_AMOUNT',
          entityId,
          message: `${context} has invalid relationship amount "${String(effect.amount)}"; must be a finite number`,
        });
      }
      break;
    }
    case 'unlockFlower':
      if (!flowerSet.has(effect.flowerId)) {
        issues.push({
          code: 'MISSING_FLOWER',
          entityId,
          message: `${context} references missing flower "${effect.flowerId}"`,
        });
      }
      break;
    case 'journal':
      if (!journalSet.has(effect.entryId)) {
        issues.push({
          code: 'MISSING_JOURNAL',
          entityId,
          message: `${context} references missing journal entry "${effect.entryId}"`,
        });
      }
      break;
    default: {
      const rawType =
        typeof raw === 'object' && raw !== null && 'type' in raw && typeof raw.type === 'string'
          ? raw.type
          : 'unknown';
      issues.push({
        code: 'INVALID_EFFECT_TYPE',
        entityId,
        message: `${context} has unsupported effect type "${rawType}"`,
      });
      break;
    }
  }
}

function validateRequirements(
  requirements: readonly Requirement[],
  entityId: string,
  context: string,
  issues: ValidationIssue[],
  flowerSet: ReadonlySet<string>,
): void {
  for (const req of requirements) {
    if (!(req.kind in SUPPORTED_REQUIREMENT_KINDS)) {
      issues.push({
        code: 'INVALID_REQUIREMENT_KIND',
        entityId,
        message: `${context} has unsupported requirement kind "${req.kind}"`,
      });
    }

    if (
      req.min !== undefined &&
      (typeof req.min !== 'number' || !Number.isInteger(req.min) || req.min <= 0)
    ) {
      issues.push({
        code: 'INVALID_REQUIREMENT_MIN',
        entityId,
        message: `${context} requirement has invalid min "${req.min}"; must be a positive integer`,
      });
    }

    if (req.kind === 'flower' && !flowerSet.has(req.value)) {
      issues.push({
        code: 'MISSING_FLOWER',
        entityId,
        message: `${context} references missing flower "${req.value}"`,
      });
    }
  }
}

export function validateContent(content: ContentBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Duplicate checks per namespace
  const flowerIds = new Set<string>();
  for (const flower of content.flowers) {
    if (flowerIds.has(flower.id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: flower.id,
        message: `Duplicate flower ID "${flower.id}"`,
      });
    } else {
      flowerIds.add(flower.id);
    }
  }

  const customerIds = new Set<string>();
  for (const customer of content.customers) {
    if (customerIds.has(customer.id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: customer.id,
        message: `Duplicate customer ID "${customer.id}"`,
      });
    } else {
      customerIds.add(customer.id);
    }
  }

  const orderIds = new Set<string>();
  for (const order of content.orders) {
    if (orderIds.has(order.id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: order.id,
        message: `Duplicate order ID "${order.id}"`,
      });
    } else {
      orderIds.add(order.id);
    }
  }

  const dialogueIds = new Set<string>();
  for (const node of content.dialogue) {
    if (dialogueIds.has(node.id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: node.id,
        message: `Duplicate dialogue ID "${node.id}"`,
      });
    } else {
      dialogueIds.add(node.id);
    }
  }

  const flagIds = new Set<string>();
  for (const flag of content.flags) {
    if (flagIds.has(flag)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: flag,
        message: `Duplicate flag ID "${flag}"`,
      });
    } else {
      flagIds.add(flag);
    }
  }

  const journalIds = new Set<string>();
  for (const entry of content.journal) {
    if (journalIds.has(entry.id)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: entry.id,
        message: `Duplicate journal entry ID "${entry.id}"`,
      });
    } else {
      journalIds.add(entry.id);
    }
  }

  const assetKeyIds = new Set<string>();
  for (const assetKey of content.assetKeys) {
    if (assetKeyIds.has(assetKey)) {
      issues.push({
        code: 'DUPLICATE_ID',
        entityId: assetKey,
        message: `Duplicate asset key ID "${assetKey}"`,
      });
    } else {
      assetKeyIds.add(assetKey);
    }
  }

  const speakerIds = new Set<string>([...customerIds, 'player']);

  // Validate flowers
  for (const flower of content.flowers) {
    if (
      typeof flower.price !== 'number' ||
      !Number.isFinite(flower.price) ||
      flower.price < 0
    ) {
      issues.push({
        code: 'INVALID_PRICE',
        entityId: flower.id,
        message: `Flower "${flower.id}" has invalid price "${flower.price}"; must be a non-negative finite number`,
      });
    }

    if (flower.unlockFlag !== undefined && !flagIds.has(flower.unlockFlag)) {
      issues.push({
        code: 'MISSING_UNLOCK_FLAG',
        entityId: flower.id,
        message: `Flower "${flower.id}" references missing unlock flag "${flower.unlockFlag}"`,
      });
    }
  }

  // Validate customers
  for (const customer of content.customers) {
    if (!assetKeyIds.has(customer.portraitKey)) {
      issues.push({
        code: 'MISSING_ASSET_KEY',
        entityId: customer.id,
        message: `Customer "${customer.id}" references missing portrait asset key "${customer.portraitKey}"`,
      });
    }
  }

  // Validate dialogue nodes
  for (const node of content.dialogue) {
    if (!speakerIds.has(node.speakerId)) {
      issues.push({
        code: 'MISSING_CUSTOMER',
        entityId: node.id,
        message: `Dialogue node "${node.id}" references missing speaker "${node.speakerId}"`,
      });
    }

    if (node.nextId !== undefined && !dialogueIds.has(node.nextId)) {
      issues.push({
        code: 'MISSING_DIALOGUE',
        entityId: node.id,
        message: `Dialogue node "${node.id}" references missing nextId "${node.nextId}"`,
      });
    }

    if (node.effects) {
      for (const effect of node.effects) {
        validateEffect(
          effect,
          node.id,
          `Dialogue node "${node.id}" effect`,
          issues,
          flagIds,
          customerIds,
          flowerIds,
          journalIds,
        );
      }
    }

    if (node.choices) {
      const choiceIds = new Set<string>();
      for (const choice of node.choices) {
        if (choiceIds.has(choice.id)) {
          issues.push({
            code: 'DUPLICATE_ID',
            entityId: choice.id,
            message: `Duplicate choice ID "${choice.id}" in dialogue node "${node.id}"`,
          });
        } else {
          choiceIds.add(choice.id);
        }

        if (choice.nextId !== undefined && !dialogueIds.has(choice.nextId)) {
          issues.push({
            code: 'MISSING_DIALOGUE',
            entityId: node.id,
            message: `Dialogue node "${node.id}" choice "${choice.id}" references missing nextId "${choice.nextId}"`,
          });
        }

        if (choice.conditions) {
          for (const cond of choice.conditions) {
            if (!flagIds.has(cond.flag)) {
              issues.push({
                code: 'MISSING_FLAG',
                entityId: node.id,
                message: `Dialogue node "${node.id}" choice "${choice.id}" condition references missing flag "${cond.flag}"`,
              });
            }
          }
        }

        if (choice.effects) {
          for (const effect of choice.effects) {
            validateEffect(
              effect,
              node.id,
              `Dialogue node "${node.id}" choice "${choice.id}" effect`,
              issues,
              flagIds,
              customerIds,
              flowerIds,
              journalIds,
            );
          }
        }
      }
    }
  }

  // Validate orders
  for (const order of content.orders) {
    if (!customerIds.has(order.customerId)) {
      issues.push({
        code: 'MISSING_CUSTOMER',
        entityId: order.id,
        message: `Order "${order.id}" references missing customer "${order.customerId}"`,
      });
    }

    if (!dialogueIds.has(order.openingDialogueId)) {
      issues.push({
        code: 'MISSING_DIALOGUE',
        entityId: order.id,
        message: `Order "${order.id}" references missing opening dialogue "${order.openingDialogueId}"`,
      });
    }

    for (const outcome of REQUIRED_OUTCOMES) {
      const dialogueId = order.resultDialogueIds?.[outcome];
      if (!dialogueId || !dialogueIds.has(dialogueId)) {
        issues.push({
          code: 'MISSING_RESULT_DIALOGUE',
          entityId: order.id,
          message: `Order "${order.id}" references missing result dialogue "${dialogueId ?? 'undefined'}" for outcome "${outcome}"`,
        });
      }
    }

    validateRequirements(
      order.explicitRequirements,
      order.id,
      `Order "${order.id}" explicit requirement`,
      issues,
      flowerIds,
    );
    validateRequirements(
      order.preferences,
      order.id,
      `Order "${order.id}" preference`,
      issues,
      flowerIds,
    );
    validateRequirements(
      order.taboos,
      order.id,
      `Order "${order.id}" taboo`,
      issues,
      flowerIds,
    );

    for (const rule of order.resonanceRules) {
      validateRequirements(
        rule.requirements,
        order.id,
        `Order "${order.id}" resonance rule "${rule.id}" requirement`,
        issues,
        flowerIds,
      );

      for (const cond of rule.conditions) {
        if (!flagIds.has(cond.flag)) {
          issues.push({
            code: 'MISSING_FLAG',
            entityId: order.id,
            message: `Order "${order.id}" resonance rule "${rule.id}" condition references missing flag "${cond.flag}"`,
          });
        }
      }

      for (const effect of rule.effects) {
        validateEffect(
          effect,
          order.id,
          `Order "${order.id}" resonance rule "${rule.id}" effect`,
          issues,
          flagIds,
          customerIds,
          flowerIds,
          journalIds,
        );
      }
    }

    if (order.effects) {
      for (const outcome of REQUIRED_OUTCOMES) {
        const effects = order.effects[outcome];
        if (effects) {
          for (const effect of effects) {
            validateEffect(
              effect,
              order.id,
              `Order "${order.id}" outcome "${outcome}" effect`,
              issues,
              flagIds,
              customerIds,
              flowerIds,
              journalIds,
            );
          }
        }
      }
    }
  }

  // Deterministic sort: code -> entityId -> message
  issues.sort((a, b) => {
    const codeCmp = a.code.localeCompare(b.code);
    if (codeCmp !== 0) return codeCmp;
    const entityCmp = a.entityId.localeCompare(b.entityId);
    if (entityCmp !== 0) return entityCmp;
    return a.message.localeCompare(b.message);
  });

  return issues;
}

export function assertValidContent(content: ContentBundle): void {
  const issues = validateContent(content);
  if (issues.length > 0) {
    const details = issues
      .map((issue) => `[${issue.code}] ${issue.entityId}: ${issue.message}`)
      .join('\n');
    throw new Error(`Content validation failed with ${issues.length} issue(s):\n${details}`);
  }
}
