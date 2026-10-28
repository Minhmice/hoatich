import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { KnowledgeError, type SourceDocument, type SourceRef, type SourceSnapshot } from './contracts';

const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const optional = ['README.md', 'PRODUCT.md', 'DESIGN.md', 'asset-source/generated/ASSET_PROMPTS.md'];

export async function loadSources(rootPath: string): Promise<SourceSnapshot> {
  const root = await realpath(rootPath);
  async function collect(): Promise<SourceDocument[]> {
    const documents: SourceDocument[] = [];
    async function scan(path: string, recursive: boolean, required = false): Promise<void> {
      const full = resolve(root, path);
      let stat;
      try { stat = await lstat(full); } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' && !required) return;
        throw new KnowledgeError('SOURCE_UNAVAILABLE', `Cannot read source: ${path}`);
      }
      if (stat.isSymbolicLink()) throw new KnowledgeError('SOURCE_UNAVAILABLE', `Symlink source refused: ${path}`);
      const actual = await realpath(full);
      if (actual !== root && !actual.startsWith(root + sep)) throw new KnowledgeError('SOURCE_UNAVAILABLE', `Source outside root: ${path}`);
      if (stat.isDirectory()) {
        if (!recursive) throw new KnowledgeError('SOURCE_UNAVAILABLE', `Expected regular source: ${path}`);
        for (const entry of (await readdir(full)).sort()) {
          if (!entry.startsWith('.')) await scan(`${path}/${entry}`, true);
        }
      } else if (stat.isFile() && (path.endsWith('.ts') || path.endsWith('.md'))) {
        if (stat.size > 2 * 1024 * 1024) throw new KnowledgeError('LIMIT_EXCEEDED', `Source too large: ${path}`);
        let text: string;
        try { text = new TextDecoder('utf-8', { fatal: true }).decode(await readFile(full)); }
        catch { throw new KnowledgeError('SOURCE_UNAVAILABLE', `Source is unreadable UTF-8: ${path}`); }
        documents.push({ relativePath: relative(root, full).split(sep).join('/'), text, contentHash: hash(text), evidenceKind: path.endsWith('.ts') ? 'runtime_code' : 'design_document' });
      }
    }
    await scan('src/game', true, true);
    await scan('docs', true);
    for (const file of optional) await scan(file, false);
    return documents.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }
  const documents = await collect();
  const signature = (docs: SourceDocument[]) => hash(docs.map(d => `${d.relativePath}\0${d.contentHash}`).join('\n'));
  const revision = signature(documents);
  const byPath = new Map(documents.map(doc => [doc.relativePath, doc]));
  const parsed = new Map<string, ts.SourceFile>();
  function source(path: string, symbol?: string, needle?: string): SourceRef {
    const doc = byPath.get(path);
    if (!doc) throw new KnowledgeError('SOURCE_UNAVAILABLE', `Source not indexed: ${path}`);
    let start = 0;
    let end = doc.text.length;
    if (path.endsWith('.ts')) {
      let file = parsed.get(path);
      if (!file) { file = ts.createSourceFile(path, doc.text, ts.ScriptTarget.Latest, true); parsed.set(path, file); }
      let best: ts.Node | undefined;
      function visit(node: ts.Node): void {
        const named = node as ts.Node & { name?: ts.Node };
        if (symbol && named.name?.getText(file) === symbol) best = node;
        ts.forEachChild(node, visit);
      }
      if (symbol) visit(file);
      if (best) { start = best.getStart(file); end = best.getEnd(); }
      if (needle) {
        const hits: ts.StringLiteralLike[] = [];
        function literals(node: ts.Node): void {
          if (ts.isStringLiteralLike(node) && node.text === needle && node.getStart(file) >= start && node.getEnd() <= end) hits.push(node);
          ts.forEachChild(node, literals);
        }
        literals(file);
        if (hits[0]) {
          let node: ts.Node = hits[0];
          while (node.parent && !ts.isObjectLiteralExpression(node) && node.parent !== file) node = node.parent;
          start = node.getStart(file); end = node.getEnd();
        }
      }
    } else if (needle) {
      const index = doc.text.indexOf(needle);
      if (index >= 0) { start = index; end = index + needle.length; }
    }
    return { relativePath: path, ...(symbol ? { symbol } : {}), lineStart: doc.text.slice(0, start).split('\n').length, lineEnd: doc.text.slice(0, end).split('\n').length, contentHash: doc.contentHash };
  }
  return {
    root, revision, documents, warnings: optional.filter(file => !byPath.has(file)).map(file => `Optional source unavailable: ${file}`), source,
    async assertFresh() {
      try { if (signature(await collect()) !== revision) throw new KnowledgeError('SOURCE_CHANGED', 'Sources changed; restart MCP to load a consistent revision.'); }
      catch (error) { if (error instanceof KnowledgeError && error.code === 'SOURCE_CHANGED') throw error; throw new KnowledgeError('SOURCE_CHANGED', 'Source set is no longer readable; restart after resolving source access.'); }
    },
  };
}
