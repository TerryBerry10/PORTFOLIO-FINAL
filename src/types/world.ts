export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'clear' | 'breeze' | 'rain' | 'snow' | 'fog';

export type ZoneId = 
  | 'home' 
  | 'workshop' 
  | 'forest' 
  | 'tree' 
  | 'lake' 
  | 'lab' 
  | 'campfire' 
  | 'skyIsland';

export interface WorldZone {
  id: ZoneId;
  name: string;
  subtitle: string;
  description: string;
  x: number; // World coordinate X
  y: number; // World coordinate Y
  radius: number; // Interaction radius
  icon: string;
  themeColor: string;
  interactLabel: string;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  facing: 'left' | 'right' | 'up' | 'down';
  actionState: 'idle' | 'walk' | 'run' | 'interact' | 'sit';
  isMoving: boolean;
  isRunning: boolean;
  activeZone: ZoneId | null;
  footstepTimer: number;
}

export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  zoom: number;
  targetZoom: number;
  shakeIntensity: number;
}

export interface WorldParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  type: 'dust' | 'leaf' | 'firefly' | 'ember' | 'rain' | 'ripple' | 'sparkle' | 'snow';
  rotation?: number;
  rotationSpeed?: number;
}

export interface WorldState {
  timeOfDay: TimeOfDay;
  timeProgress: number; // 0 to 1
  weather: WeatherType;
  windSpeed: number;
  dreamMode: boolean;
  devMode: boolean;
  photoMode: boolean;
  recruiterMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  activeModal: string | null;
  selectedProjectId: string | null;
}
