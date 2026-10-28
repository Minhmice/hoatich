import { fileURLToPath } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { createKnowledgeServer } from './server';

try {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const server = await createKnowledgeServer(root);
  await server.connect(new StdioServerTransport(undefined, undefined, { maxBufferSize: 256 * 1024 }));
} catch (error) {
  console.error('Hoa Tích MCP could not start:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
