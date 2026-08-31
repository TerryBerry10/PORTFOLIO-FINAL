export interface SoundTrackSettings {
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  isMuted: boolean;
}

export type SfxCue = 
  | 'footstep' 
  | 'interact' 
  | 'openModal' 
  | 'closeModal' 
  | 'zoneEnter' 
  | 'fireflyCatch' 
  | 'sliderChange' 
  | 'windChime' 
  | 'secretFound' 
  | 'waterStep'
  | 'buttonHover';
