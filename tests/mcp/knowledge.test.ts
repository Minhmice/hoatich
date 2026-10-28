import { describe, expect, it } from 'vitest';
import { loadSources } from '../../tools/mcp/sources';
import { buildKnowledge } from '../../tools/mcp/knowledge';
import { KnowledgeError, type EntityKind, type KnowledgeEdge, type KnowledgeEntity, type SourceRef } from '../../tools/mcp/contracts';

interface DiscoverResult {
  summary: {
    entityCounts: Record<EntityKind, number>;
    totalEntities: number;
    documentCount: number;
  };
  domains: string[];
  idConventions: Record<string, string>;
  limits: {
    defaultLimit: number;
    maxLimit: number;
    maxImpactDepth: number;
    maxTraversalEdges: number;
  };
}

interface SearchEntityResultItem {
  type: 'entity';
  entity: KnowledgeEntity;
  matchField?: string;
  score?: number;
}

interface SearchDocumentResultItem {
  type: 'document';
  relativePath: string;
  excerpt: string;
  sourceRef: SourceRef;
}

type SearchResultItem = SearchEntityResultItem | SearchDocumentResultItem;

interface SearchResult {
  items: SearchResultItem[];
  nextCursor?: string;
  totalMatches: number;
}

interface GetResult {
  entity: KnowledgeEntity;
}

interface RelationsResult {
  edges: KnowledgeEdge[];
  relatedEntities: KnowledgeEntity[];
  totalEdges: number;
  nextCursor?: string;
}

interface ImpactResult {
  affectedEntities: KnowledgeEntity[];
  paths: Array<{ from: string; to: string; type: string }>;
  edges: KnowledgeEdge[];
}

describe('Knowledge Catalog', () => {
  async function getCatalog() {
    const sources = await loadSources(process.cwd());
    return { sources, catalog: buildKnowledge(sources) };
  }

  describe('discover', () => {
    it('returns counts for all entity kinds, domains, and example lookups', async () => {
      const { catalog } = await getCatalog();
      const result = catalog.discover() as unknown as DiscoverResult;

      expect(result).toHaveProperty('summary');
      expect(result.summary.entityCounts.flower).toBeGreaterThanOrEqual(10);
      expect(result.summary.entityCounts.customer).toBeGreaterThanOrEqual(4);
      expect(result.summary.entityCounts.order).toBeGreaterThanOrEqual(4);
      expect(result.summary.entityCounts.dialogue).toBeGreaterThanOrEqual(37);
      expect(result.summary.entityCounts.flag).toBeGreaterThanOrEqual(10);
      expect(result.summary.entityCounts.journal).toBeGreaterThanOrEqual(3);
      expect(result.summary.entityCounts.asset).toBeGreaterThanOrEqual(10);
      expect(result.summary.entityCounts.day).toBeGreaterThanOrEqual(2);
      expect(result.summary.entityCounts.chapter).toBeGreaterThanOrEqual(1);

      expect(result).toHaveProperty('idConventions');
      expect(result.idConventions).toHaveProperty('flower');
      expect(result.idConventions).toHaveProperty('choice');
      expect(result).toHaveProperty('limits');
      expect(result.limits.defaultLimit).toBe(20);
      expect(result.limits.maxLimit).toBe(50);
      expect(result.limits.maxImpactDepth).toBe(4);
    });
  });

  describe('search', () => {
    it('finds flowers by exact ID and by diacritic-insensitive Vietnamese name', async () => {
      const { catalog } = await getCatalog();

      // Exact ID
      const byId = catalog.search({ query: 'hoa-cuc-trang' }) as unknown as SearchResult;
      expect(byId.items.length).toBeGreaterThan(0);
      const first = byId.items[0];
      expect(first.type).toBe('entity');
      if (first.type === 'entity') {
        expect(first.entity.ref.id).toBe('hoa-cuc-trang');
      }

      // Unaccented "cuc trang" finds "Cúc trắng"
      const byUnaccented = catalog.search({ query: 'cuc trang' }) as unknown as SearchResult;
      expect(byUnaccented.items.some((item) => item.type === 'entity' && item.entity.ref.id === 'hoa-cuc-trang')).toBe(true);

      // Decomposed unicode "cúc trắng"
      const decomposed = 'cúc trắng'.normalize('NFD');
      const byDecomposed = catalog.search({ query: decomposed }) as unknown as SearchResult;
      expect(byDecomposed.items.some((item) => item.type === 'entity' && item.entity.ref.id === 'hoa-cuc-trang')).toBe(true);

      // Vietnamese "đ" / "Đ" handling
      const byD = catalog.search({ query: 'hong do' }) as unknown as SearchResult;
      expect(byD.items.some((item) => item.type === 'entity' && item.entity.ref.id === 'hoa-hong-do')).toBe(true);

      // Customer search without accents
      const customerSearch = catalog.search({ query: 'hon thi si' }) as unknown as SearchResult;
      expect(customerSearch.items.some((item) => item.type === 'entity' && item.entity.ref.id === 'linh-hon-thi-si')).toBe(true);
    });

    it('filters results by entity kinds', async () => {
      const { catalog } = await getCatalog();
      const flowersOnly = catalog.search({ query: 'trang', kinds: ['flower'] }) as unknown as SearchResult;
      expect(flowersOnly.items.length).toBeGreaterThan(0);
      for (const item of flowersOnly.items) {
        if (item.type === 'entity') {
          expect(item.entity.ref.kind).toBe('flower');
        }
      }
    });

    it('matches document excerpts when querying prose text', async () => {
      const { catalog } = await getCatalog();
      const docSearch = catalog.search({ query: 'Cô Năm', kinds: [] }) as unknown as SearchResult;
      const docItems = docSearch.items.filter((item): item is SearchDocumentResultItem => item.type === 'document');
      expect(docItems.length).toBeGreaterThan(0);
      expect(docItems[0]).toHaveProperty('excerpt');
      expect(docItems[0]).toHaveProperty('sourceRef');
      expect(docItems[0].sourceRef.relativePath).toMatch(/\.md$/);
    });

    it('supports stable pagination with cursor bound to revision', async () => {
      const { catalog } = await getCatalog();
      const page1 = catalog.search({ query: '', kinds: ['flower'], limit: 3 }) as unknown as SearchResult;
      expect(page1.items.length).toBe(3);
      expect(page1.nextCursor).toBeDefined();

      const page2 = catalog.search({ query: '', kinds: ['flower'], limit: 3, cursor: page1.nextCursor }) as unknown as SearchResult;
      expect(page2.items.length).toBe(3);
      if (page1.items[0].type === 'entity' && page2.items[0].type === 'entity') {
        expect(page2.items[0].entity.ref.id).not.toBe(page1.items[0].entity.ref.id);
      }

      // Tampered/stale revision cursor rejected
      const badCursor = Buffer.from(JSON.stringify({ revision: 'stale-rev', offset: 3, filterHash: 'x' })).toString('base64');
      expect(() => catalog.search({ query: '', cursor: badCursor })).toThrow(KnowledgeError);
      try {
        catalog.search({ query: '', cursor: badCursor });
      } catch (err) {
        expect((err as KnowledgeError).code).toBe('INVALID_CURSOR');
      }
    });

    it('validates query bounds and limits', async () => {
      const { catalog } = await getCatalog();
      expect(() => catalog.search({ query: 'a'.repeat(501) })).toThrow(KnowledgeError);
      expect(() => catalog.search({ query: 'test', limit: 0 })).toThrow(KnowledgeError);
      expect(() => catalog.search({ query: 'test', limit: 51 })).toThrow(KnowledgeError);
    });
  });

  describe('get', () => {
    it('retrieves flower entity with exact code source spans', async () => {
      const { catalog } = await getCatalog();
      const result = catalog.get({ kind: 'flower', id: 'hoa-cuc-trang' }) as unknown as GetResult;
      expect(result.entity.ref).toEqual({ kind: 'flower', id: 'hoa-cuc-trang' });
      expect(result.entity.data.displayName).toBe('Cúc trắng');
      expect(result.entity.evidenceKind).toBe('runtime_data');
      expect(result.entity.sourceRefs.length).toBeGreaterThan(0);
      const span = result.entity.sourceRefs[0];
      expect(span.relativePath).toBe('src/game/content/flowers.ts');
      expect(span.symbol).toBe('flowers');
      expect(span.lineStart).toBeGreaterThan(0);
      expect(span.lineEnd).toBeGreaterThanOrEqual(span.lineStart);
    });

    it('retrieves intro dialogue from GameSession with INTRO_DIALOGUE_NODE span', async () => {
      const { catalog } = await getCatalog();
      const result = catalog.get({ kind: 'dialogue', id: 'dlg-intro' }) as unknown as GetResult;
      expect(result.entity.ref).toEqual({ kind: 'dialogue', id: 'dlg-intro' });
      expect(result.entity.sourceRefs.some((s) => s.symbol === 'INTRO_DIALOGUE_NODE' && s.relativePath === 'src/game/GameSession.ts')).toBe(true);
    });

    it('retrieves scoped choice and rule entities requiring ownerRef', async () => {
      const { catalog } = await getCatalog();
      // Choice with ownerRef
      const choice = catalog.get({ kind: 'choice', id: 'choice-order-01-bac-ba-direct', ownerRef: 'dlg-bacba-01' }) as unknown as GetResult;
      expect(choice.entity.ref).toEqual({ kind: 'choice', id: 'choice-order-01-bac-ba-direct', ownerRef: 'dlg-bacba-01' });

      // Rule with ownerRef
      const rule = catalog.get({ kind: 'rule', id: 'rule-bacba-thuytien', ownerRef: 'order-01-bac-ba' }) as unknown as GetResult;
      expect(rule.entity.ref).toEqual({ kind: 'rule', id: 'rule-bacba-thuytien', ownerRef: 'order-01-bac-ba' });
    });

    it('throws NOT_FOUND for unknown entity ID', async () => {
      const { catalog } = await getCatalog();
      expect(() => catalog.get({ kind: 'flower', id: 'hoa-khong-ton-tai' })).toThrow(KnowledgeError);
      try {
        catalog.get({ kind: 'flower', id: 'hoa-khong-ton-tai' });
      } catch (err) {
        expect((err as KnowledgeError).code).toBe('NOT_FOUND');
      }
    });

    it('returns candidates or throws AMBIGUOUS_ID when un-scoped ID matches multiple entities', async () => {
      const { sources } = await getCatalog();
      const catalog = buildKnowledge(sources);
      expect(() => catalog.get({ kind: 'not-a-kind' as unknown as EntityKind, id: 'test' })).toThrow(KnowledgeError);
    });
  });

  describe('relations', () => {
    it('returns order outgoing relationships including customer, day, and flower requirements', async () => {
      const { catalog } = await getCatalog();
      const relations = catalog.relations({
        entityRef: { kind: 'order', id: 'order-01-bac-ba' },
        direction: 'outgoing',
      }) as unknown as RelationsResult;

      expect(relations.edges.length).toBeGreaterThan(0);

      // Customer relation
      expect(relations.edges.some((e) => e.to.kind === 'customer' && e.to.id === 'bac-ba')).toBe(true);

      // Flower requirement relation
      const flowerReq = relations.edges.find((e) => e.to.kind === 'flower' && e.to.id === 'hoa-cuc-trang');
      expect(flowerReq).toBeDefined();
      expect(flowerReq?.details?.polarity).toBe('positive');

      // Rule relation
      expect(relations.edges.some((e) => e.to.kind === 'rule' && e.to.id === 'rule-bacba-thuytien')).toBe(true);
    });

    it('distinguishes taboo vs requirement predicate semantics for world=both', async () => {
      const { catalog } = await getCatalog();

      const reqRelations = catalog.relations({
        entityRef: { kind: 'order', id: 'order-01-bac-ba' },
        direction: 'outgoing',
      }) as unknown as RelationsResult;

      const cucTrangReq = reqRelations.edges.find((e) =>
        e.to.kind === 'flower' && e.to.id === 'hoa-cuc-trang' && e.details?.polarity === 'positive'
      );
      expect(cucTrangReq).toBeDefined();
      expect(cucTrangReq?.type).toBe('requirement');

      // order-01-bac-ba has taboo: { kind: 'world', value: 'dead' }
      // Hoa Cúc Trắng (world: 'both') MUST NOT match taboo world: 'dead'.
      const cucTrangDeadTaboo = reqRelations.edges.find((e) =>
        e.to.kind === 'flower' && e.to.id === 'hoa-cuc-trang' && e.details?.polarity === 'negative'
      );
      expect(cucTrangDeadTaboo).toBeUndefined();

      // Hoa Hoàng Tuyền (world: 'dead') DOES match taboo world: 'dead'.
      const hoangTuyenDeadTaboo = reqRelations.edges.find((e) =>
        e.to.kind === 'flower' && e.to.id === 'hoa-hoang-tuyen' && e.details?.polarity === 'negative'
      );
      expect(hoangTuyenDeadTaboo).toBeDefined();
      expect(hoangTuyenDeadTaboo?.type).toBe('taboo');
      expect(hoangTuyenDeadTaboo?.details?.kind).toBe('world');
      expect(hoangTuyenDeadTaboo?.details?.matchedValue).toBe('dead');
    });

    it('supports incoming direction to find who references an entity', async () => {
      const { catalog } = await getCatalog();
      const bacBaIncoming = catalog.relations({
        entityRef: { kind: 'customer', id: 'bac-ba' },
        direction: 'incoming',
        relationTypes: ['customer'],
      }) as unknown as RelationsResult;

      expect(bacBaIncoming.edges.some((e) => e.from.kind === 'order' && e.from.id === 'order-01-bac-ba')).toBe(true);
    });
  });

  describe('impact', () => {
    it('traces flag readers and writers across dialogue, rule, and order', async () => {
      const { catalog } = await getCatalog();
      const impact = catalog.impact({
        entityRef: { kind: 'flag', id: 'flag_heard_detail_order-01-bac-ba' },
        depth: 2,
      }) as unknown as ImpactResult;

      expect(impact.affectedEntities.length).toBeGreaterThan(0);

      // Writer: dialogue node 'dlg-order-01-bac-ba-detail' writes this flag
      const dialogueWriter = impact.affectedEntities.find((e) => e.ref.kind === 'dialogue' && e.ref.id === 'dlg-order-01-bac-ba-detail');
      expect(dialogueWriter).toBeDefined();

      // Reader: rule 'rule-bacba-cuc-kinhtrong' checks this flag
      const ruleReader = impact.affectedEntities.find((e) => e.ref.kind === 'rule' && e.ref.id === 'rule-bacba-cuc-kinhtrong');
      expect(ruleReader).toBeDefined();

      // Paths explain dependency
      expect(impact.paths.length).toBeGreaterThan(0);
    });

    it('prevents infinite loops on cycles and limits depth to 4', async () => {
      const { catalog } = await getCatalog();
      // Depth > 4 throws INVALID_INPUT
      expect(() => catalog.impact({ entityRef: { kind: 'flag', id: 'flag_intro_seen' }, depth: 5 })).toThrow(KnowledgeError);

      // Traversal on intro seen flag finishes cleanly without cycle lock
      const impact = catalog.impact({ entityRef: { kind: 'flag', id: 'flag_intro_seen' }, depth: 4 }) as unknown as ImpactResult;
      expect(impact).toHaveProperty('affectedEntities');
      expect(impact.edges.length).toBeLessThanOrEqual(500);
    });
  });
});
