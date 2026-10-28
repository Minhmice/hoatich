import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const root = fileURLToPath(new URL('../../', import.meta.url));
const transport = new StdioClientTransport({ command: process.execPath, args: ['--import', 'tsx', 'tools/mcp/stdio.ts'], cwd: root, stderr: 'inherit' });
const client = new Client({ name: 'hoatich-smoke', version: '1.0.0' });
try {
  await client.connect(transport);
  const listed = await client.listTools();
  assert.deepEqual(listed.tools.map(t => t.name).sort(), ['analyze_impact', 'discover_game', 'evaluate_bouquet', 'get_entity', 'get_relations', 'search_knowledge', 'simulate_scenario']);
  async function call(name: string, args: Record<string, unknown> = {}) {
    const response = await client.callTool({ name, arguments: args });
    assert.ok(Array.isArray(response.content));
    const textBlock = response.content.find(block => block.type === 'text');
    assert.ok(textBlock && textBlock.type === 'text' && typeof textBlock.text === 'string');
    const result: Record<string, unknown> = JSON.parse(textBlock.text);
    assert.deepEqual(response.structuredContent, result);
    assert.ok(!response.isError, JSON.stringify(result));
    assert.equal(result.schemaVersion, 1);
    assert.equal(typeof result.knowledgeRevision, 'string');
    return result;
  }
  const discovery = await call('discover_game');
  const search = await call('search_knowledge', { query: 'cuc trang', kinds: ['flower'] });
  assert.ok(JSON.stringify(search).includes('hoa-cuc-trang'));
  const flower = await call('get_entity', { kind: 'flower', id: 'hoa-cuc-trang' });
  assert.ok(JSON.stringify(flower).includes('Cúc trắng'));
  const relations = await call('get_relations', { entityRef: { kind: 'flower', id: 'hoa-cuc-trang' }, direction: 'both' });
  assert.ok(JSON.stringify(relations).includes('order-01-bac-ba'));
  const impact = await call('analyze_impact', { entityRef: { kind: 'flag', id: 'flag_knows_bac_ba_wife_memory' }, depth: 2, limit: 5 });
  assert.ok(JSON.stringify(impact).includes('order-01-bac-ba'));
  const evaluation = await call('evaluate_bouquet', { orderId: 'order-01-bac-ba', flowers: [{ flowerId: 'hoa-hong-do', quantity: 1 }], context: { flags: {} } });
  assert.equal(evaluation.outcome, 'missed');
  const simulation = await call('simulate_scenario', { initialState: 'initial', actions: [{ type: 'advance_dialogue', choiceId: 'choice-intro-start' }] });
  assert.ok(JSON.stringify(simulation).includes('order-01-bac-ba'));
  assert.ok(JSON.stringify(simulation).includes('flag_intro_seen'));
  const invalid = await client.callTool({ name: 'get_entity', arguments: { kind: 'flower', id: 'unknown-flower' } });
  assert.equal(invalid.isError, true);
  console.log(JSON.stringify({ status: 'passed', transport: 'stdio', tools: listed.tools.map(t => t.name), knowledgeRevision: discovery.knowledgeRevision, evaluation: evaluation.outcome, simulation: 'intro-to-first-order', verifiedError: 'unknown-flower' }, null, 2));
} finally {
  await client.close();
}
