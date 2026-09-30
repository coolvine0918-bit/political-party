/**
 * Web Audio API 기반 동물의 숲 스타일 효과음 생성기
 */

class SoundPlayer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // sound on by default
    try {
      this.isMuted = localStorage.getItem('ac_sound_muted') === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('ac_sound_muted', String(this.isMuted));
    } catch {}
    if (!this.isMuted) {
      this.playBlip();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 귀여운 나뭇잎/버튼 터치음
   */
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * 임시저장 성공 챠임 (도-미-솔 멜로디)
   */
  public playSaveChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  /**
   * 제출 및 결과 발표 팡파레
   */
  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chords = [
        { freq: 440, time: 0 },
        { freq: 554.37, time: 0.12 },
        { freq: 659.25, time: 0.24 },
        { freq: 880, time: 0.36 },
        { freq: 1108.73, time: 0.52 }
      ];

      const now = this.ctx.currentTime;
      chords.forEach(({ freq, time }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.18, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + time);
        osc.stop(now + time + 0.45);
      });
    } catch {}
  }

  public playBlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const sound = new SoundPlayer();
