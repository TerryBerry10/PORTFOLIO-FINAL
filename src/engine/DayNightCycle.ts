import { TimeOfDay } from '../types/world';

export interface DayNightPalette {
  skyTop: string;
  skyBottom: string;
  mountainFar: string;
  mountainNear: string;
  hillsFar: string;
  hillsNear: string;
  ambientLight: string;
  ambientLightAlpha: number;
  sunMoonColor: string;
  sunMoonSize: number;
  waterColor: string;
  waterReflectionAlpha: number;
  lanternGlow: number;
  starAlpha: number;
}

export class DayNightCycle {
  private currentMode: TimeOfDay = 'night';
  private targetMode: TimeOfDay = 'night';

  private palettes: Record<TimeOfDay, DayNightPalette> = {
    night: {
      skyTop: '#000000',          // Pure deep cosmic obsidian
      skyBottom: '#040711',       // Deep starlight midnight
      mountainFar: '#080d1a',     // Distant mountains
      mountainNear: '#0a1120',    // Mid mountain ridge
      hillsFar: '#060b14',        // Distant forest ridge
      hillsNear: '#040810',       // Deep obsidian night terrain
      ambientLight: '#f472b6',    // Soft sakura ambient bloom
      ambientLightAlpha: 0.015,
      sunMoonColor: '#fef08a',    // Radiant golden celestial moon
      sunMoonSize: 34,
      waterColor: '#03060d',      // Mirror obsidian lake
      waterReflectionAlpha: 0.9,
      lanternGlow: 1.0,
      starAlpha: 1.0,
    },
    sunset: {
      skyTop: '#000000',
      skyBottom: '#040711',
      mountainFar: '#080d1a',
      mountainNear: '#0a1120',
      hillsFar: '#060b14',
      hillsNear: '#040810',
      ambientLight: '#f472b6',
      ambientLightAlpha: 0.015,
      sunMoonColor: '#fef08a',
      sunMoonSize: 34,
      waterColor: '#03060d',
      waterReflectionAlpha: 0.9,
      lanternGlow: 1.0,
      starAlpha: 1.0,
    },
    day: {
      skyTop: '#000000',
      skyBottom: '#040711',
      mountainFar: '#080d1a',
      mountainNear: '#0a1120',
      hillsFar: '#060b14',
      hillsNear: '#040810',
      ambientLight: '#f472b6',
      ambientLightAlpha: 0.015,
      sunMoonColor: '#fef08a',
      sunMoonSize: 34,
      waterColor: '#03060d',
      waterReflectionAlpha: 0.9,
      lanternGlow: 1.0,
      starAlpha: 1.0,
    }
  };

  public setTime(_mode: TimeOfDay = 'night') {
    this.targetMode = 'night';
  }

  public getTime(): TimeOfDay {
    return 'night';
  }

  public getPalette(): DayNightPalette {
    return this.palettes.night;
  }

  public update(_dt: number) {
    this.currentMode = 'night';
    this.targetMode = 'night';
  }
}
