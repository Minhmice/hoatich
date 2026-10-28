import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { loadSources } from '../../tools/mcp/sources';

const roots: string[] = [];
afterEach(async () => { await Promise.all(roots.map(root => rm(root, { recursive: true, force: true }))); roots.length = 0; });
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'hoatich-mcp-'));
  roots.push(root);
  await mkdir(join(root, 'src/game'), { recursive: true });
  await writeFile(join(root, 'src/game/fixture.ts'), 'export const flowers = [\n  { id: "hoa-test", name: "Hoa" },\n];\n');
  await writeFile(join(root, 'README.md'), '# Game\n\nFacts.\n');
  return root;
}
it('locates exact entity span inside declaration and rejects changed source snapshots', async () => {
  const root = await fixture();
  const snapshot = await loadSources(root);
  expect(snapshot.source('src/game/fixture.ts', 'flowers', 'hoa-test')).toMatchObject({ lineStart: 2, lineEnd: 2, symbol: 'flowers' });
  await snapshot.assertFresh();
  await writeFile(join(root, 'src/game/fixture.ts'), 'export const flowers = [];');
  await expect(snapshot.assertFresh()).rejects.toMatchObject({ code: 'SOURCE_CHANGED' });
});
it('detects additions and deletions instead of returning stale search results', async () => {
  const root = await fixture();
  const snapshot = await loadSources(root);
  await writeFile(join(root, 'PRODUCT.md'), '# Product\nNew intent');
  await expect(snapshot.assertFresh()).rejects.toMatchObject({ code: 'SOURCE_CHANGED' });
  const next = await loadSources(root);
  await rm(join(root, 'README.md'));
  await expect(next.assertFresh()).rejects.toMatchObject({ code: 'SOURCE_CHANGED' });
});
it('refuses symlink escape and does not include hidden or binary files', async () => {
  const root = await fixture();
  await writeFile(join(root, '.env'), 'SECRET=private');
  await writeFile(join(root, 'src/game/image.png'), 'not text source');
  const safe = await loadSources(root);
  expect(safe.documents.map(d => d.relativePath)).not.toContain('.env');
  expect(safe.documents.map(d => d.relativePath)).not.toContain('src/game/image.png');
  await symlink(join(tmpdir(), 'outside-private.md'), join(root, 'PRODUCT.md'));
  await expect(loadSources(root)).rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' });
});
