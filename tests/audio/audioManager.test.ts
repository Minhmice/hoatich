import { describe, expect, it } from 'vitest';
import { AudioManager } from '../../src/game/audio';

describe('AudioManager', () => {
  it('instantiates cleanly and supports volume adjustment without audio context in node', () => {
    const audio = new AudioManager({ musicVolume: 0.8, sfxVolume: 0.5 });
    expect(audio).toBeDefined();

    // Verify setMusicVolume, setSfxVolume, setShift do not throw in node env
    expect(() => audio.setMusicVolume(0.5)).not.toThrow();
    expect(() => audio.setSfxVolume(0.2)).not.toThrow();
    expect(() => audio.setShift('dead')).not.toThrow();
    expect(() => audio.setShift('living')).not.toThrow();
    expect(() => audio.playPlacementSfx()).not.toThrow();
    expect(() => audio.playDeliverySfx(true)).not.toThrow();
    expect(() => audio.playDeliverySfx(false)).not.toThrow();

    audio.destroy();
  });
});
