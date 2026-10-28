export type EntityKind = 'flower' | 'customer' | 'order' | 'dialogue' | 'choice' | 'rule' | 'flag' | 'journal' | 'asset' | 'day' | 'chapter';
export interface EntityRef { kind: EntityKind; id: string; ownerRef?: string }
export interface SourceRef { relativePath: string; symbol?: string; heading?: string; lineStart: number; lineEnd: number; contentHash: string }
export interface KnowledgeEntity { ref: EntityRef; data: Record<string, unknown>; sourceRefs: SourceRef[]; evidenceKind: 'runtime_data' | 'runtime_code' }
export interface KnowledgeEdge { from: EntityRef; to: EntityRef; type: string; sourceRefs: SourceRef[]; details?: Record<string, unknown> }
export interface SourceDocument { relativePath: string; text: string; contentHash: string; evidenceKind: 'runtime_code' | 'design_document' }
export interface SourceSnapshot {
  root: string;
  revision: string;
  documents: SourceDocument[];
  warnings: string[];
  source(relativePath: string, symbol?: string, needle?: string): SourceRef;
  assertFresh(): Promise<void>;
}
export class KnowledgeError extends Error {
  constructor(public readonly code: string, message: string) { super(message); this.name = 'KnowledgeError'; }
}
export function refKey(ref: EntityRef): string { return `${ref.kind}:${ref.ownerRef ? `${ref.ownerRef}/` : ''}${ref.id}`; }
