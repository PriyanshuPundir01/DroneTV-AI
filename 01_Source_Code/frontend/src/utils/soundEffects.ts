// Synthesized Web Audio API sound effects for futuristic vibe coding UI
// Zero external files, ultra-lightweight, runs completely in-browser

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Sound starts muted or unmuted depending on preference; default unmuted for vibe coding feel
    try {
      const saved = localStorage.getItem('dronetv_sound_muted');
      this.isMuted = saved === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('dronetv_sound_muted', String(this.isMuted));
    } catch {}
    if (!this.isMuted) {
      this.playSuccess();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soft hover acquisition tick
  public playHoverTick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch {}
  }

  // Futuristic short mechanical click / blip
  public playClick(freq = 880): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  // Soft token typewriter tick
  public playTypeTick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const randomFreq = 1200 + Math.random() * 400;
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {}
  }

  // Success chime / lock-on
  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.035, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
    } catch {}
  }

  // Radar ping
  public playRadarPing(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // Futuristic boot sequence tone
  public playBootSequence(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Rising drone motor spool + harmonic chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);

      // Chime sequence
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + 0.4 + idx * 0.12);

        chimeGain.gain.setValueAtTime(0.025, now + 0.4 + idx * 0.12);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4 + idx * 0.12 + 0.25);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now + 0.4 + idx * 0.12);
        chimeOsc.stop(now + 0.4 + idx * 0.12 + 0.25);
      });
    } catch {}
  }
}

export const soundFx = new SoundEffectsManager();
