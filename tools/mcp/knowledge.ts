import { contentBundle, flowers as allFlowers } from '../../src/game/content';
import { flowerAssets } from '../../src/game/content/flowerAssets';
import { characterAssets } from '../../src/game/content/characterAssets';
import { INTRO_DIALOGUE_NODE } from '../../src/game/GameSession';
import { flowerMatchesRequirement, flowerMatchesTaboo } from '../../src/game/bouquet/evaluateBouquet';
import {
  KnowledgeError,
  refKey,
  type EntityKind,
  type EntityRef,
  type KnowledgeEdge,
  type KnowledgeEntity,
  type SourceRef,
  type SourceSnapshot,
} from './contracts';

function normalizeVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase();
}

interface CursorData {
  revision: string;
  offset: number;
  filterHash: string;
}

function encodeCursor(data: CursorData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function decodeCursor(cursorStr: string, currentRevision: string, currentFilterHash: string): number {
  let parsed: unknown;
  try {
    const json = Buffer.from(cursorStr, 'base64').toString('utf8');
    parsed = JSON.parse(json);
  } catch {
    throw new KnowledgeError('INVALID_CURSOR', 'Cursor is malformed or invalid base64.');
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    (parsed as CursorData).revision !== currentRevision ||
    (parsed as CursorData).filterHash !== currentFilterHash ||
    typeof (parsed as CursorData).offset !== 'number'
  ) {
    throw new KnowledgeError('INVALID_CURSOR', 'Cursor is invalid, tampered, or expired due to revision mismatch.');
  }

  return (parsed as CursorData).offset;
}

export function buildKnowledge(sources: SourceSnapshot) {
  const entities = new Map<string, KnowledgeEntity>();
  const entityList: KnowledgeEntity[] = [];
  const edges: KnowledgeEdge[] = [];
  const outgoing = new Map<string, KnowledgeEdge[]>();
  const incoming = new Map<string, KnowledgeEdge[]>();

  function addEntity(entity: KnowledgeEntity): void {
    const key = refKey(entity.ref);
    if (!entities.has(key)) {
      entities.set(key, entity);
      entityList.push(entity);
    }
  }

  function addEdge(from: EntityRef, to: EntityRef, type: string, sourceRefs: SourceRef[], details?: Record<string, unknown>): void {
    const edge: KnowledgeEdge = { from, to, type, sourceRefs, ...(details ? { details } : {}) };
    edges.push(edge);

    const fromKey = refKey(from);
    const toKey = refKey(to);

    let outList = outgoing.get(fromKey);
    if (!outList) {
      outList = [];
      outgoing.set(fromKey, outList);
    }
    outList.push(edge);

    let inList = incoming.get(toKey);
    if (!inList) {
      inList = [];
      incoming.set(toKey, inList);
    }
    inList.push(edge);
  }

  // 1. Flowers
  for (const flower of contentBundle.flowers) {
    const ref: EntityRef = { kind: 'flower', id: flower.id };
    const span = sources.source('src/game/content/flowers.ts', 'flowers', flower.id);
    addEntity({
      ref,
      data: flower as unknown as Record<string, unknown>,
      sourceRefs: [span],
      evidenceKind: 'runtime_data',
    });

    if (flower.unlockFlag) {
      const flagRef: EntityRef = { kind: 'flag', id: flower.unlockFlag };
      addEdge(ref, flagRef, 'unlocked_by_flag', [span]);
    }

    const assetEntry = flowerAssets[flower.id];
    if (assetEntry) {
      const assetRef: EntityRef = { kind: 'asset', id: `asset:flower:${flower.id}` };
      const assetSpan = sources.source('src/game/content/flowerAssets.ts', 'flowerAssets', assetEntry.textureKey);
      addEntity({
        ref: assetRef,
        data: { ...assetEntry, flowerId: flower.id, category: 'flower' },
        sourceRefs: [assetSpan],
        evidenceKind: 'runtime_data',
      });
      addEdge(ref, assetRef, 'visual_asset', [assetSpan]);
    }
  }

  // 2. Customers
  for (const customer of contentBundle.customers) {
    const ref: EntityRef = { kind: 'customer', id: customer.id };
    const span = sources.source('src/game/content/customers.ts', 'customers', customer.id);
    addEntity({
      ref,
      data: customer as unknown as Record<string, unknown>,
      sourceRefs: [span],
      evidenceKind: 'runtime_data',
    });

    const charAsset = characterAssets[customer.portraitKey];
    if (charAsset) {
      const assetRef: EntityRef = { kind: 'asset', id: `asset:character:${customer.portraitKey}` };
      const assetSpan = sources.source('src/game/content/characterAssets.ts', 'characterAssets', customer.portraitKey);
      addEntity({
        ref: assetRef,
        data: { ...charAsset, customerId: customer.id, category: 'character' },
        sourceRefs: [assetSpan],
        evidenceKind: 'runtime_data',
      });
      addEdge(ref, assetRef, 'portrait_asset', [assetSpan]);
    }
  }

  // Also Player asset
  const playerAsset = characterAssets.player;
  if (playerAsset) {
    const assetRef: EntityRef = { kind: 'asset', id: 'asset:character:player' };
    const assetSpan = sources.source('src/game/content/characterAssets.ts', 'characterAssets', 'player');
    addEntity({
      ref: assetRef,
      data: { ...playerAsset, category: 'character' },
      sourceRefs: [assetSpan],
      evidenceKind: 'runtime_data',
    });
  }

  // 3. Orders & Rules
  for (const order of contentBundle.orders) {
    const orderRef: EntityRef = { kind: 'order', id: order.id };
    const orderSpan = sources.source('src/game/content/orders.ts', 'orders', order.id);
    addEntity({
      ref: orderRef,
      data: order as unknown as Record<string, unknown>,
      sourceRefs: [orderSpan],
      evidenceKind: 'runtime_data',
    });

    addEdge(orderRef, { kind: 'customer', id: order.customerId }, 'customer', [orderSpan]);
    addEdge(orderRef, { kind: 'day', id: order.dayId }, 'day', [orderSpan]);
    addEdge(orderRef, { kind: 'dialogue', id: order.openingDialogueId }, 'opening_dialogue', [orderSpan]);

    for (const [outcome, dlgId] of Object.entries(order.resultDialogueIds)) {
      addEdge(orderRef, { kind: 'dialogue', id: dlgId }, `result_dialogue_${outcome}`, [orderSpan]);
    }

    // Requirements
    for (const req of order.explicitRequirements) {
      if (req.kind === 'flower') {
        addEdge(orderRef, { kind: 'flower', id: req.value }, 'requirement', [orderSpan], {
          kind: req.kind,
          min: req.min ?? 1,
          polarity: 'positive',
        });
      } else {
        for (const fl of allFlowers) {
          if (flowerMatchesRequirement(fl, req)) {
            addEdge(orderRef, { kind: 'flower', id: fl.id }, 'requirement', [orderSpan], {
              kind: req.kind,
              min: req.min ?? 1,
              polarity: 'positive',
              matchedValue: req.value,
            });
          }
        }
      }
    }

    // Taboos
    for (const taboo of order.taboos) {
      if (taboo.kind === 'flower') {
        addEdge(orderRef, { kind: 'flower', id: taboo.value }, 'taboo', [orderSpan], {
          kind: taboo.kind,
          min: taboo.min ?? 1,
          polarity: 'negative',
        });
      } else {
        for (const fl of allFlowers) {
          if (flowerMatchesTaboo(fl, taboo)) {
            addEdge(orderRef, { kind: 'flower', id: fl.id }, 'taboo', [orderSpan], {
              kind: taboo.kind,
              min: taboo.min ?? 1,
              polarity: 'negative',
              matchedValue: taboo.value,
            });
          }
        }
      }
    }

    // Resonance rules
    for (const rule of order.resonanceRules) {
      const ruleRef: EntityRef = { kind: 'rule', id: rule.id, ownerRef: order.id };
      const ruleSpan = sources.source('src/game/content/orders.ts', 'orders', rule.id);
      addEntity({
        ref: ruleRef,
        data: rule as unknown as Record<string, unknown>,
        sourceRefs: [ruleSpan],
        evidenceKind: 'runtime_data',
      });

      addEdge(orderRef, ruleRef, 'resonance_rule', [ruleSpan]);
      addEdge(ruleRef, orderRef, 'parent_order', [ruleSpan]);

      for (const cond of rule.conditions) {
        addEdge(ruleRef, { kind: 'flag', id: cond.flag }, 'checks_flag', [ruleSpan], { equals: cond.equals });
      }

      for (const req of rule.requirements) {
        if (req.kind === 'flower') {
          addEdge(ruleRef, { kind: 'flower', id: req.value }, 'requirement', [ruleSpan], {
            min: req.min ?? 1,
            polarity: 'positive',
          });
        } else {
          for (const fl of allFlowers) {
            if (flowerMatchesRequirement(fl, req)) {
              addEdge(ruleRef, { kind: 'flower', id: fl.id }, 'requirement', [ruleSpan], {
                kind: req.kind,
                min: req.min ?? 1,
                polarity: 'positive',
              });
            }
          }
        }
      }

      for (const eff of rule.effects) {
        if (eff.type === 'setFlag') {
          addEdge(ruleRef, { kind: 'flag', id: eff.flag }, 'writes_flag', [ruleSpan], { value: eff.value });
        } else if (eff.type === 'relationship') {
          addEdge(ruleRef, { kind: 'customer', id: eff.customerId }, 'affects_relationship', [ruleSpan], { amount: eff.amount });
        } else if (eff.type === 'unlockFlower') {
          addEdge(ruleRef, { kind: 'flower', id: eff.flowerId }, 'unlocks_flower', [ruleSpan]);
        } else if (eff.type === 'journal') {
          addEdge(ruleRef, { kind: 'journal', id: eff.entryId }, 'adds_journal', [ruleSpan]);
        }
      }
    }
  }

  // 4. Dialogues & Choices
  const allDialogues = [...contentBundle.dialogue, INTRO_DIALOGUE_NODE];
  for (const node of allDialogues) {
    const isIntro = node.id === 'dlg-intro';
    const dlgRef: EntityRef = { kind: 'dialogue', id: node.id };
    const dlgSpan = isIntro
      ? sources.source('src/game/GameSession.ts', 'INTRO_DIALOGUE_NODE')
      : sources.source('src/game/content/dialogue.ts', 'dialogues', node.id);

    addEntity({
      ref: dlgRef,
      data: node as unknown as Record<string, unknown>,
      sourceRefs: [dlgSpan],
      evidenceKind: 'runtime_data',
    });

    if (node.speakerId !== 'player') {
      addEdge(dlgRef, { kind: 'customer', id: node.speakerId }, 'speaker', [dlgSpan]);
    }

    if (node.nextId) {
      addEdge(dlgRef, { kind: 'dialogue', id: node.nextId }, 'next_dialogue', [dlgSpan]);
    }

    for (const eff of node.effects ?? []) {
      if (eff.type === 'setFlag') {
        addEdge(dlgRef, { kind: 'flag', id: eff.flag }, 'writes_flag', [dlgSpan], { value: eff.value });
      } else if (eff.type === 'relationship') {
        addEdge(dlgRef, { kind: 'customer', id: eff.customerId }, 'affects_relationship', [dlgSpan], { amount: eff.amount });
      } else if (eff.type === 'unlockFlower') {
        addEdge(dlgRef, { kind: 'flower', id: eff.flowerId }, 'unlocks_flower', [dlgSpan]);
      } else if (eff.type === 'journal') {
        addEdge(dlgRef, { kind: 'journal', id: eff.entryId }, 'adds_journal', [dlgSpan]);
      }
    }

    for (const choice of node.choices ?? []) {
      const choiceRef: EntityRef = { kind: 'choice', id: choice.id, ownerRef: node.id };
      const choiceSpan = isIntro
        ? sources.source('src/game/GameSession.ts', 'INTRO_DIALOGUE_NODE', choice.id)
        : sources.source('src/game/content/dialogue.ts', 'dialogues', choice.id);

      addEntity({
        ref: choiceRef,
        data: choice as unknown as Record<string, unknown>,
        sourceRefs: [choiceSpan],
        evidenceKind: 'runtime_data',
      });

      addEdge(dlgRef, choiceRef, 'has_choice', [choiceSpan]);
      addEdge(choiceRef, dlgRef, 'parent_dialogue', [choiceSpan]);

      if (choice.nextId) {
        addEdge(choiceRef, { kind: 'dialogue', id: choice.nextId }, 'next_dialogue', [choiceSpan]);
      }

      for (const cond of choice.conditions ?? []) {
        addEdge(choiceRef, { kind: 'flag', id: cond.flag }, 'checks_flag', [choiceSpan], { equals: cond.equals });
      }

      for (const eff of choice.effects ?? []) {
        if (eff.type === 'setFlag') {
          addEdge(choiceRef, { kind: 'flag', id: eff.flag }, 'writes_flag', [choiceSpan], { value: eff.value });
        } else if (eff.type === 'relationship') {
          addEdge(choiceRef, { kind: 'customer', id: eff.customerId }, 'affects_relationship', [choiceSpan], { amount: eff.amount });
        } else if (eff.type === 'unlockFlower') {
          addEdge(choiceRef, { kind: 'flower', id: eff.flowerId }, 'unlocks_flower', [choiceSpan]);
        } else if (eff.type === 'journal') {
          addEdge(choiceRef, { kind: 'journal', id: eff.entryId }, 'adds_journal', [choiceSpan]);
        }
      }
    }
  }

  // 5. Flags
  for (const flag of contentBundle.flags) {
    const ref: EntityRef = { kind: 'flag', id: flag };
    const span = sources.source('src/game/content/index.ts', 'flags', flag);
    addEntity({
      ref,
      data: { id: flag },
      sourceRefs: [span],
      evidenceKind: 'runtime_data',
    });
  }

  // 6. Journal Entries
  for (const entry of contentBundle.journal) {
    const ref: EntityRef = { kind: 'journal', id: entry.id };
    const span = sources.source('src/game/content/index.ts', 'journalEntries', entry.id);
    addEntity({
      ref,
      data: entry as unknown as Record<string, unknown>,
      sourceRefs: [span],
      evidenceKind: 'runtime_data',
    });
  }

  // 7. Days & Chapters
  for (const day of ['day-1', 'day-2']) {
    const ref: EntityRef = { kind: 'day', id: day };
    const span = sources.source('src/game/content/index.ts', 'dayIds', day);
    addEntity({
      ref,
      data: { id: day },
      sourceRefs: [span],
      evidenceKind: 'runtime_data',
    });
  }

  const chapRef: EntityRef = { kind: 'chapter', id: 'thang-mot' };
  const chapSpan = sources.source('src/game/content/index.ts', 'chapterIds', 'thang-mot');
  addEntity({
    ref: chapRef,
    data: { id: 'thang-mot' },
    sourceRefs: [chapSpan],
    evidenceKind: 'runtime_data',
  });

  const validKinds = new Set<string>([
    'flower',
    'customer',
    'order',
    'dialogue',
    'choice',
    'rule',
    'flag',
    'journal',
    'asset',
    'day',
    'chapter',
  ]);

  return {
    discover(): object {
      const counts: Record<EntityKind, number> = {
        flower: 0,
        customer: 0,
        order: 0,
        dialogue: 0,
        choice: 0,
        rule: 0,
        flag: 0,
        journal: 0,
        asset: 0,
        day: 0,
        chapter: 0,
      };

      for (const ent of entityList) {
        counts[ent.ref.kind] = (counts[ent.ref.kind] ?? 0) + 1;
      }

      return {
        summary: {
          entityCounts: counts,
          totalEntities: entityList.length,
          documentCount: sources.documents.length,
        },
        domains: [
          'botanical_catalog',
          'customer_profiles',
          'orders_and_symbolism',
          'branching_dialogue',
          'resonance_rules',
          'game_flags_and_state',
          'journal_lore',
          'asset_provenance',
          'day_and_chapter_schedule',
        ],
        idConventions: {
          flower: 'hoa-<slug> (e.g. hoa-cuc-trang, hoa-hong-do)',
          customer: '<slug> (e.g. bac-ba, co-lien, linh-hon-thi-si)',
          order: 'order-<nn>-<slug> (e.g. order-01-bac-ba)',
          dialogue: 'dlg-<slug> (e.g. dlg-intro, dlg-bacba-01)',
          choice: 'choice-<slug> with ownerRef dialogue ID (e.g. choice-bacba-01-direct)',
          rule: 'rule-<slug> with ownerRef order ID (e.g. rule-bacba-thuytien)',
          flag: 'flag_<name> (e.g. flag_intro_seen, flag_knows_bac_ba_wife_memory)',
          journal: 'journal_<topic> (e.g. journal_aunt_shop_creed)',
          asset: 'asset:<category>:<id> (e.g. asset:flower:hoa-cuc-trang)',
          day: 'day-<n> (e.g. day-1, day-2)',
          chapter: '<slug> (e.g. thang-mot)',
        },
        limits: {
          defaultLimit: 20,
          maxLimit: 50,
          maxImpactDepth: 4,
          maxTraversalEdges: 500,
        },
        exampleLookups: [
          { tool: 'search_knowledge', query: 'cuc trang', desc: 'Find flower by unaccented name' },
          { tool: 'get_entity', kind: 'flower', id: 'hoa-cuc-trang', desc: 'Get exact flower and source spans' },
          { tool: 'get_relations', entityRef: { kind: 'order', id: 'order-01-bac-ba' }, direction: 'outgoing', desc: 'View order requirements' },
          { tool: 'analyze_impact', entityRef: { kind: 'flag', id: 'flag_knows_bac_ba_wife_memory' }, desc: 'View dialogue and rule dependency' },
        ],
      };
    },

    search(input: unknown): object {
      if (!input || typeof input !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'search input must be an object');
      }

      const { query, kinds, sourceKinds, cursor, limit } = input as {
        query?: unknown;
        kinds?: unknown;
        sourceKinds?: unknown;
        cursor?: unknown;
        limit?: unknown;
      };

      if (typeof query !== 'string') {
        throw new KnowledgeError('INVALID_INPUT', 'query must be a string');
      }
      if (query.length > 500) {
        throw new KnowledgeError('LIMIT_EXCEEDED', 'query cannot exceed 500 characters');
      }

      const parsedLimit = limit === undefined ? 20 : typeof limit === 'number' ? limit : -1;
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        throw new KnowledgeError('INVALID_INPUT', 'limit must be an integer between 1 and 50');
      }

      let kindFilter: Set<string> | undefined;
      if (kinds !== undefined) {
        if (!Array.isArray(kinds)) throw new KnowledgeError('INVALID_INPUT', 'kinds must be an array');
        for (const k of kinds) {
          if (typeof k !== 'string' || !validKinds.has(k)) {
            throw new KnowledgeError('INVALID_INPUT', `Invalid kind in filter: ${String(k)}`);
          }
        }
        kindFilter = new Set(kinds);
      }

      const filterHash = `${query}\0${Array.isArray(kinds) ? kinds.slice().sort().join(',') : '*'}\0${Array.isArray(sourceKinds) ? sourceKinds.slice().sort().join(',') : '*'}`;
      const offset = cursor ? decodeCursor(String(cursor), sources.revision, filterHash) : 0;

      const normQuery = normalizeVietnamese(query.trim());
      const queryTrimmed = query.trim().toLowerCase();

      const matchedItems: Array<
        | { type: 'entity'; entity: KnowledgeEntity; matchField?: string; score: number }
        | { type: 'document'; relativePath: string; excerpt: string; sourceRef: SourceRef; score: number }
      > = [];

      // 1. Search entities
      for (const ent of entityList) {
        if (kindFilter && !kindFilter.has(ent.ref.kind)) continue;

        let score = 0;
        let matchField: string | undefined;

        const idNorm = normalizeVietnamese(ent.ref.id);
        const nameField = (ent.data.displayName || ent.data.name || ent.data.title || '') as string;
        const normName = normalizeVietnamese(nameField);
        const textContent = JSON.stringify(ent.data).toLowerCase();
        const normContent = normalizeVietnamese(textContent);

        if (!normQuery) {
          score = 1;
        } else if (ent.ref.id.toLowerCase() === queryTrimmed) {
          score = 100;
          matchField = 'id';
        } else if (normName && normName === normQuery) {
          score = 90;
          matchField = 'name';
        } else if (idNorm.includes(normQuery)) {
          score = 80;
          matchField = 'id';
        } else if (normName.includes(normQuery)) {
          score = 70;
          matchField = 'name';
        } else if (normContent.includes(normQuery)) {
          score = 50;
          matchField = 'content';
        }

        if (score > 0) {
          matchedItems.push({
            type: 'entity',
            entity: ent,
            ...(matchField ? { matchField } : {}),
            score,
          });
        }
      }

      // 2. Search documents if no kinds filter or if empty
      if (!kindFilter || kindFilter.size === 0) {
        for (const doc of sources.documents) {
          if (!normQuery) continue;
          const normDoc = normalizeVietnamese(doc.text);
          const idx = normDoc.indexOf(normQuery);
          if (idx >= 0) {
            const start = Math.max(0, idx - 60);
            const end = Math.min(doc.text.length, idx + query.length + 80);
            const excerpt = (start > 0 ? '...' : '') + doc.text.slice(start, end).trim() + (end < doc.text.length ? '...' : '');

            matchedItems.push({
              type: 'document',
              relativePath: doc.relativePath,
              excerpt,
              sourceRef: sources.source(doc.relativePath, undefined, doc.text.slice(idx, idx + query.length)),
              score: 40,
            });
          }
        }
      }

      // Sort: score desc, then alphabetical
      matchedItems.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const keyA = a.type === 'entity' ? refKey(a.entity.ref) : a.relativePath;
        const keyB = b.type === 'entity' ? refKey(b.entity.ref) : b.relativePath;
        return keyA.localeCompare(keyB);
      });

      const paginated = matchedItems.slice(offset, offset + parsedLimit);
      const nextOffset = offset + parsedLimit;
      const nextCursor = nextOffset < matchedItems.length ? encodeCursor({ revision: sources.revision, offset: nextOffset, filterHash }) : undefined;

      return {
        items: paginated.map(({ score, ...rest }) => rest),
        totalMatches: matchedItems.length,
        ...(nextCursor ? { nextCursor } : {}),
      };
    },

    get(input: unknown): object {
      if (!input || typeof input !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'get input must be an object');
      }

      const { kind, id, ownerRef } = input as { kind?: unknown; id?: unknown; ownerRef?: unknown };

      if (typeof kind !== 'string' || !validKinds.has(kind)) {
        throw new KnowledgeError('INVALID_INPUT', `Invalid entity kind: ${String(kind)}`);
      }
      if (typeof id !== 'string' || !id) {
        throw new KnowledgeError('INVALID_INPUT', 'id must be a non-empty string');
      }

      const key = refKey({ kind: kind as EntityKind, id, ...(typeof ownerRef === 'string' ? { ownerRef } : {}) });
      let found = entities.get(key);

      if (!found && !ownerRef) {
        // Try searching if single match exists
        const candidates = entityList.filter((e) => e.ref.kind === kind && e.ref.id === id);
        if (candidates.length === 1) {
          found = candidates[0];
        } else if (candidates.length > 1) {
          throw new KnowledgeError(
            'AMBIGUOUS_ID',
            `ID "${id}" of kind "${kind}" matches multiple entities. Specify ownerRef (candidates: ${candidates.map((c) => c.ref.ownerRef).join(', ')})`,
          );
        }
      }

      if (!found) {
        throw new KnowledgeError('NOT_FOUND', `Entity not found: kind="${kind}", id="${id}"`);
      }

      return { entity: found };
    },

    relations(input: unknown): object {
      if (!input || typeof input !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'relations input must be an object');
      }

      const { entityRef, direction, relationTypes, cursor, limit } = input as {
        entityRef?: unknown;
        direction?: unknown;
        relationTypes?: unknown;
        cursor?: unknown;
        limit?: unknown;
      };

      if (!entityRef || typeof entityRef !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'entityRef is required');
      }
      const ref = entityRef as EntityRef;
      if (!ref.kind || !ref.id || !validKinds.has(ref.kind)) {
        throw new KnowledgeError('INVALID_INPUT', 'entityRef is invalid');
      }

      const parsedLimit = limit === undefined ? 20 : typeof limit === 'number' ? limit : -1;
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        throw new KnowledgeError('INVALID_INPUT', 'limit must be between 1 and 50');
      }

      if (direction !== 'incoming' && direction !== 'outgoing' && direction !== 'both') {
        throw new KnowledgeError('INVALID_INPUT', 'direction must be "incoming", "outgoing", or "both"');
      }

      const key = refKey(ref);
      const edgeMatches: KnowledgeEdge[] = [];

      if (direction === 'outgoing' || direction === 'both') {
        const outList = outgoing.get(key) ?? [];
        edgeMatches.push(...outList);
      }
      if (direction === 'incoming' || direction === 'both') {
        const inList = incoming.get(key) ?? [];
        edgeMatches.push(...inList);
      }

      let filtered = edgeMatches;
      if (Array.isArray(relationTypes) && relationTypes.length > 0) {
        const typeSet = new Set(relationTypes);
        filtered = filtered.filter((e) => typeSet.has(e.type));
      }

      // Tie-break stable sort
      filtered.sort((a, b) => {
        const kA = `${refKey(a.from)}->${refKey(a.to)}:${a.type}`;
        const kB = `${refKey(b.from)}->${refKey(b.to)}:${b.type}`;
        return kA.localeCompare(kB);
      });

      const filterHash = `rel:${key}:${direction}:${Array.isArray(relationTypes) ? relationTypes.slice().sort().join(',') : '*'}`;
      const offset = cursor ? decodeCursor(String(cursor), sources.revision, filterHash) : 0;

      const paginated = filtered.slice(offset, offset + parsedLimit);
      const nextOffset = offset + parsedLimit;
      const nextCursor = nextOffset < filtered.length ? encodeCursor({ revision: sources.revision, offset: nextOffset, filterHash }) : undefined;

      const relatedKeys = new Set<string>();
      for (const e of paginated) {
        relatedKeys.add(refKey(e.from));
        relatedKeys.add(refKey(e.to));
      }
      const relatedEntities: KnowledgeEntity[] = [];
      for (const k of relatedKeys) {
        const ent = entities.get(k);
        if (ent && k !== key) relatedEntities.push(ent);
      }

      return {
        edges: paginated,
        relatedEntities,
        totalEdges: filtered.length,
        ...(nextCursor ? { nextCursor } : {}),
      };
    },

    impact(input: unknown): object {
      if (!input || typeof input !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'impact input must be an object');
      }

      const { entityRef, depth } = input as { entityRef?: unknown; depth?: unknown };

      if (!entityRef || typeof entityRef !== 'object') {
        throw new KnowledgeError('INVALID_INPUT', 'entityRef is required');
      }
      const ref = entityRef as EntityRef;
      if (!ref.kind || !ref.id || !validKinds.has(ref.kind)) {
        throw new KnowledgeError('INVALID_INPUT', 'entityRef is invalid');
      }

      const parsedDepth = depth === undefined ? 1 : typeof depth === 'number' ? depth : -1;
      if (!Number.isInteger(parsedDepth) || parsedDepth < 1 || parsedDepth > 4) {
        throw new KnowledgeError('INVALID_INPUT', 'depth must be an integer between 1 and 4');
      }

      const startKey = refKey(ref);
      const visited = new Set<string>([startKey]);
      const affectedKeys = new Set<string>();
      const collectedEdges: KnowledgeEdge[] = [];
      const paths: Array<{ from: string; to: string; type: string }> = [];

      let currentFrontier = [startKey];
      let edgesVisitedCount = 0;

      for (let d = 0; d < parsedDepth; d++) {
        const nextFrontier: string[] = [];

        for (const currKey of currentFrontier) {
          // Impact travels across both readers and writers
          const neighbors = [...(outgoing.get(currKey) ?? []), ...(incoming.get(currKey) ?? [])];

          for (const edge of neighbors) {
            edgesVisitedCount++;
            if (edgesVisitedCount > 500) break;

            const neighborKey = refKey(edge.from) === currKey ? refKey(edge.to) : refKey(edge.from);
            collectedEdges.push(edge);
            paths.push({ from: refKey(edge.from), to: refKey(edge.to), type: edge.type });

            if (!visited.has(neighborKey)) {
              visited.add(neighborKey);
              affectedKeys.add(neighborKey);
              nextFrontier.push(neighborKey);
            }
          }
          if (edgesVisitedCount > 500) break;
        }

        currentFrontier = nextFrontier;
        if (currentFrontier.length === 0 || edgesVisitedCount > 500) break;
      }

      const affectedEntities: KnowledgeEntity[] = [];
      for (const k of affectedKeys) {
        const ent = entities.get(k);
        if (ent) affectedEntities.push(ent);
      }

      return {
        affectedEntities,
        paths,
        edges: collectedEdges,
      };
    },
  };
}
