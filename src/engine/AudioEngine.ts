import { SfxCue, SoundTrackSettings } from '../types/audio';

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  
  // Ambient nodes
  private windNode: AudioNode | null = null;
  private rainNode: AudioNode | null = null;
  private fireNode: AudioNode | null = null;
  private musicInterval: number | null = null;

  private settings: SoundTrackSettings = {
    masterVolume: 0.7,
    sfxVolume: 0.8,
    ambientVolume: 0.5,
    isMuted: false,
  };

  private pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C D E G A C D E
  private isInitialized = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.settings.isMuted ? 0 : this.settings.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.settings.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startAmbientGenerators();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser.", e);
    }
  }

  public toggleMute(): boolean {
    this.settings.isMuted = !this.settings.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.settings.isMuted ? 0 : this.settings.masterVolume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.settings.isMuted;
  }

  public setMasterVolume(val: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.settings.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.settings.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getSettings(): SoundTrackSettings {
    return { ...this.settings };
  }

  // Plays procedural procedural sound cues
  public playSfx(cue: SfxCue) {
    if (!this.isInitialized || !this.ctx || !this.sfxGain || this.settings.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    switch (cue) {
      case 'footstep': {
        // Subtle low thud with soft pitch variation
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const freq = 75 + Math.random() * 20;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.09);
        break;
      }

      case 'waterStep': {
        // High soft water ripple drop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const freq = 450 + Math.random() * 150;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + 0.12);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.13);
        break;
      }

      case 'interact': {
        // Ascending harmonic chime chord (pentatonic)
        [0, 2, 4].forEach((noteIdx, i) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const freq = this.pentatonicNotes[noteIdx % this.pentatonicNotes.length] * 1.5;
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + i * 0.06);

          gain.gain.setValueAtTime(0.001, t + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.2, t + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.6);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + i * 0.06);
          osc.stop(t + i * 0.06 + 0.65);
        });
        break;
      }

      case 'openModal': {
        // Warm paper-like bell
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.25); // E5

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.45);
        break;
      }

      case 'closeModal': {
        // Soft descending release
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392.00, t); // G4
        osc.frequency.exponentialRampToValueAtTime(261.63, t + 0.2); // C4

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.22);
        break;
      }

      case 'fireflyCatch': {
        // Magical twinkle chime
        const note = this.pentatonicNotes[Math.floor(Math.random() * this.pentatonicNotes.length)] * 2;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.55);
        break;
      }

      case 'sliderChange': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);

        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case 'buttonHover': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, t);

        gain.gain.setValueAtTime(0.02, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
        break;
      }

      case 'secretFound': {
        // Pentatonic arpeggio fanfare
        [0, 2, 4, 7].forEach((n, i) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const freq = this.pentatonicNotes[n % this.pentatonicNotes.length] * 2;
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + i * 0.1);

          gain.gain.setValueAtTime(0.001, t + i * 0.1);
          gain.gain.linearRampToValueAtTime(0.25, t + i * 0.1 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.8);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + i * 0.1);
          osc.stop(t + i * 0.1 + 0.85);
        });
        break;
      }
    }
  }

  // Starts procedural ambient generator
  private startAmbientGenerators() {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Procedural Wind (Pink Noise filtered)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.ambientGain);
    whiteNoise.start();

    // 2. Slow soothing background pentatonic melody chime generator
    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.ambientGain || this.settings.isMuted) return;
      if (Math.random() > 0.4) {
        const note = this.pentatonicNotes[Math.floor(Math.random() * this.pentatonicNotes.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

        osc.connect(gain);
        gain.connect(this.ambientGain);
        osc.start(t);
        osc.stop(t + 2.6);
      }
    }, 3800);
  }

  public updateWeatherAudio(weather: string, windSpeed: number) {
    // Dynamic updates based on environment weather
  }
}

export const AudioEngine = new AudioEngineClass();
