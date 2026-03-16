// src/utils/feedback.ts

class FeedbackManager {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Sonido sutil de "clic" clínico (frecuencia alta, duración corta)
  playClick() {
    this.initAudio();
    const osc = this.audioCtx!.createOscillator();
    const gain = this.audioCtx!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.audioCtx!.currentTime); // Nota La5
    gain.gain.setValueAtTime(0.1, this.audioCtx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx!.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx!.destination);

    osc.start();
    osc.stop(this.audioCtx!.currentTime + 0.1);
  }

  // Vibración táctica
  vibrate(pattern: number | number[] = 10) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Feedback de éxito (al terminar una escala)
  success() {
    this.playClick();
    this.vibrate([30, 50, 30]); // Triple pulso corto
  }

  // Feedback de alerta (para resultados críticos en rojo)
  warning() {
    this.vibrate([100, 100, 100, 100]); // Pulso largo de alerta
  }
}

export const feedback = new FeedbackManager();