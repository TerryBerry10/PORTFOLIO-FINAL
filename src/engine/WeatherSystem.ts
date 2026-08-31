import { WeatherType } from '../types/world';

export class WeatherSystem {
  private currentWeather: WeatherType = 'breeze';
  private windSpeed = 1.3;
  private fogDensity = 0.05;

  // Automated organic weather progression cycle
  private weatherSequence: { type: WeatherType; duration: number }[] = [
    { type: 'breeze', duration: 42 }, // Aesthetic Cherry Blossom (Sakura) Petal Fall
    { type: 'clear', duration: 38 },  // Starry Night Calm with Shooting Stars & Fireflies
    { type: 'snow', duration: 36 },   // Magical Snow Flurry with Ground Accumulation
    { type: 'rain', duration: 30 },   // Moonlit Rain & Ground Splash Ripples
  ];
  private sequenceIndex = 0;
  private weatherTimer = 0;
  public onWeatherChanged?: (weather: WeatherType) => void;

  constructor() {
    this.setWeather('breeze');
  }

  public update(dt: number) {
    this.weatherTimer += dt;
    const currentPhase = this.weatherSequence[this.sequenceIndex];
    if (this.weatherTimer >= currentPhase.duration) {
      this.weatherTimer = 0;
      this.sequenceIndex = (this.sequenceIndex + 1) % this.weatherSequence.length;
      const nextWeather = this.weatherSequence[this.sequenceIndex].type;
      this.setWeather(nextWeather);
      this.onWeatherChanged?.(nextWeather);
    }
  }

  public setWeather(weather: WeatherType) {
    this.currentWeather = weather;
    switch (weather) {
      case 'clear':
        this.windSpeed = 0.6;
        this.fogDensity = 0.0;
        break;
      case 'breeze':
        this.windSpeed = 1.3; // Soft gentle sakura breeze
        this.fogDensity = 0.03;
        break;
      case 'rain':
        this.windSpeed = 1.6;
        this.fogDensity = 0.22;
        break;
      case 'snow':
        this.windSpeed = 1.0;
        this.fogDensity = 0.12;
        break;
      case 'fog':
        this.windSpeed = 0.4;
        this.fogDensity = 0.55;
        break;
    }
  }

  public getWeather(): WeatherType {
    return this.currentWeather;
  }

  public getWindSpeed(): number {
    return this.windSpeed;
  }

  public getFogDensity(): number {
    return this.fogDensity;
  }

  public renderWeatherEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _time: number
  ) {
    if (this.currentWeather === 'fog' || this.currentWeather === 'rain' || this.currentWeather === 'snow') {
      ctx.save();
      // Soft, seamlessly blended full-screen atmospheric gradient with no harsh edges
      const mistGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (this.currentWeather === 'rain') {
        mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0.04)');
        mistGrad.addColorStop(0.5, 'rgba(30, 58, 95, 0.08)');
        mistGrad.addColorStop(1, 'rgba(15, 23, 42, 0.12)');
      } else if (this.currentWeather === 'snow') {
        mistGrad.addColorStop(0, 'rgba(224, 242, 254, 0.03)');
        mistGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.06)');
        mistGrad.addColorStop(1, 'rgba(224, 242, 254, 0.08)');
      } else {
        mistGrad.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
        mistGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.15)');
        mistGrad.addColorStop(1, 'rgba(148, 163, 184, 0.22)');
      }
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }
}
