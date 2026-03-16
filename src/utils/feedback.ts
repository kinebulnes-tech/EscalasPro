// src/utils/feedback.ts

class FeedbackManager {
  private audioCtx: AudioContext | null = null;

  // ✅ IMPORTANTE: Debe ser public y async para que el modal la vea
  public async resumeAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  public playClick() {
    if (!this.audioCtx || this.audioCtx.state !== 'running') {
      // Intentamos despertar el audio si no está corriendo
      this.resumeAudio().catch(() => {}); 
    }
    
    try {
      if (this.audioCtx) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      console.log("Audio no disponible aún");
    }
  }

  public vibrate(pattern: number | number[] = 10) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  public success() {
    this.playClick();
    this.vibrate([30, 50, 30]);
  }

  public warning() {
    this.playClick();
    this.vibrate([100, 100, 100, 100]);
  }
}

export const feedback = new FeedbackManager();