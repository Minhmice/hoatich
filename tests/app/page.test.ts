import { describe, expect, it } from 'vitest';

describe('App Router Integration', () => {
  it('defines root page and layout modules', async () => {
    const layout = await import('../../src/app/layout');
    expect(layout.default).toBeDefined();
    const page = await import('../../src/app/page');
    expect(page.default).toBeDefined();
  });
});
