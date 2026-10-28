import { describe, expect, it } from 'vitest';
import { ThreeViewport } from '../../src/components/ThreeViewport';

describe('ThreeViewport', () => {
  it('exports a valid React component function', () => {
    expect(typeof ThreeViewport).toBe('function');
  });
});
