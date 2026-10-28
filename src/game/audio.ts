export interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
}

export class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private currentShift: 'living' | 'dead' = 'living';
  private ambientFilter: BiquadFilterNode | null = null;
  private musicVolume: number;
  private sfxVolume: number;
  private gestureAttached = false;
  private isDestroyed = false;
  private isStarted = false;

  private gestureHandler = () => {
    this.handleFirstGesture();
  };

  private visibilityHandler = () => {
    this.handleVisibilityChange();
  };

  constructor(settings?: Partial<AudioSettings>) {
    this.musicVolume = settings?.musicVolume ?? 1;
    this.sfxVolume = settings?.sfxVolume ?? 1;

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.attachGestureListeners();
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  private attachGestureListeners(): void {
    if (this.gestureAttached || typeof window === 'undefined') return;
    this.gestureAttached = true;
    window.addEventListener('pointerdown', this.gestureHandler, { once: true, passive: true });
    window.addEventListener('keydown', this.gestureHandler, { once: true, passive: true });
  }

  private handleFirstGesture(): void {
    if (this.isDestroyed || this.isStarted) return;
    this.startAmbient();
  }

  public startAmbient(): void {
    if (this.isDestroyed || this.isStarted) return;
    if (typeof window === 'undefined') return;

    interface WindowWithAudio {
      webkitAudioContext?: typeof AudioContext;
    }
    const win = window as unknown as WindowWithAudio;
    const AudioContextClass = window.AudioContext || win.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      this.ctx = ctx;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const musicGain = ctx.createGain();
      musicGain.gain.setValueAtTime(this.musicVolume * 0.12, ctx.currentTime);
      musicGain.connect(ctx.destination);
      this.musicGain = musicGain;

      const sfxGain = ctx.createGain();
      sfxGain.gain.setValueAtTime(this.sfxVolume * 0.25, ctx.currentTime);
      sfxGain.connect(ctx.destination);
      this.sfxGain = sfxGain;

      // Cozy ambient drone chord: D3 (146.83Hz), A3 (220Hz), F#3 (185Hz) with warm lowpass
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = this.currentShift === 'dead' ? 240 : 320;
      filter.frequency.setValueAtTime(initialCutoff, ctx.currentTime);
      this.ambientFilter = filter;
      filter.connect(musicGain);
      // Subtle LFO modulation on cutoff for breathing feel
      this.ambientLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.ambientLfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);
      this.ambientLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      this.ambientLfo.start();

      const freqs = [146.83, this.currentShift === 'dead' ? 174.61 : 185.0, 220.0];
      this.ambientOscillators = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });

      this.isStarted = true;
    } catch {
      // AudioContext creation not permitted or blocked
    }
  }

  public playPlacementSfx(): void {
    if (this.isDestroyed || !this.ctx || this.sfxVolume <= 0 || !this.sfxGain) return;
    try {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12); // A4

      gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio glitches
    }
  }

  public playDeliverySfx(success = true): void {
    if (this.isDestroyed || !this.ctx || this.sfxVolume <= 0 || !this.sfxGain) return;
    try {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const freqs = success ? [523.25, 659.25, 783.99] : [392.0, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(this.sfxVolume * 0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // Ignore audio glitches
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.musicVolume * 0.12, this.ctx.currentTime);
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
    }
  }

  public setShift(shift: 'living' | 'dead'): void {
    this.currentShift = shift;
    if (!this.ctx || !this.ambientFilter || this.ambientOscillators.length < 3) return;
    const now = this.ctx.currentTime;
    const midFreq = shift === 'dead' ? 174.61 : 185.0;
    const targetCutoff = shift === 'dead' ? 240 : 320;
    this.ambientOscillators[1].frequency.setTargetAtTime(midFreq, now, 1.2);
    this.ambientFilter.frequency.setTargetAtTime(targetCutoff, now, 1.5);
  }

  private handleVisibilityChange(): void {
    if (!this.ctx || this.isDestroyed) return;
    if (document.hidden) {
      if (this.ctx.state === 'running') {
        void this.ctx.suspend();
      }
    } else {
      if (this.ctx.state === 'suspended' && this.isStarted) {
        void this.ctx.resume();
      }
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointerdown', this.gestureHandler);
      window.removeEventListener('keydown', this.gestureHandler);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore
      }
    });
    this.ambientOscillators = [];
    if (this.ambientLfo) {
      try {
        this.ambientLfo.stop();
        this.ambientLfo.disconnect();
      } catch {
        // Ignore
      }
      this.ambientLfo = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      void this.ctx.close();
    }
    this.ctx = null;
  }
}
