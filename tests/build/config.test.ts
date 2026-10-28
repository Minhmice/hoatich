import { describe, expect, it } from 'vitest';

describe('Build Configuration', () => {
  it('configures Next.js for static export with trailingSlash', async () => {
    const configModule = await import('../../next.config.mjs');
    const config = configModule.default;
    expect(config.output).toBe('export');
    expect(config.trailingSlash).toBe(true);
    expect(config.distDir).toBe('out');
  });
});
