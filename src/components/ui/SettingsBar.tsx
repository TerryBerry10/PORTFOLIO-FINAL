import React from 'react';
import { WeatherType } from '../../types/world';
import { Wind, Moon, Sparkles, Snowflake, CloudRain } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface SettingsBarProps {
  weather: WeatherType;
  onWeatherChange: (weather: WeatherType) => void;
  timeOfDay: string;
  onTimeChange: (time: any) => void;
  dreamMode: boolean;
  onToggleDreamMode: () => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  weather,
  onWeatherChange
}) => {
  const handleWeather = (w: WeatherType) => {
    AudioEngine.playSfx('buttonHover');
    onWeatherChange(w);
  };

  return (
    <div className="fixed bottom-4 left-4 z-30 hidden lg:flex items-center gap-2 pointer-events-auto select-none">
      <div className="bg-[#0e1713]/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border-2 border-moss-700/60 shadow-[0_8px_35px_rgba(0,0,0,0.8)] flex items-center gap-3.5 text-xs font-mono">
        
        {/* Starry Night Mode Indicator */}
        <div className="flex items-center gap-1.5 text-gold-300 font-bold">
          <Moon className="w-4 h-4 fill-current text-gold-400" />
          <span className="text-[11px] tracking-wider font-mono">STARRY NIGHT</span>
        </div>

        <div className="h-4 w-px bg-moss-700/70" />

        {/* Weather Controls */}
        <div className="flex items-center gap-1.5">
          {/* Breeze (Default) */}
          <button
            onClick={() => handleWeather('breeze')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              weather === 'breeze'
                ? 'bg-gradient-to-r from-gold-500 to-emerald-500 text-charcoal-950 shadow-[0_0_16px_rgba(250,204,21,0.6)] scale-[1.03]'
                : 'text-moss-200 hover:text-paper-50 hover:bg-moss-800/60'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>BREEZE</span>
          </button>
          
          {/* Snow */}
          <button
            onClick={() => handleWeather('snow')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              weather === 'snow'
                ? 'bg-gradient-to-r from-sky-300 to-blue-400 text-charcoal-950 shadow-[0_0_16px_rgba(186,230,253,0.7)] scale-[1.03]'
                : 'text-moss-200 hover:text-paper-50 hover:bg-moss-800/60'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>SNOW</span>
          </button>

          {/* Rain */}
          <button
            onClick={() => handleWeather('rain')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              weather === 'rain'
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-charcoal-950 shadow-[0_0_16px_rgba(96,165,250,0.7)] scale-[1.03]'
                : 'text-moss-200 hover:text-paper-50 hover:bg-moss-800/60'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>RAIN</span>
          </button>

          {/* Calm */}
          <button
            onClick={() => handleWeather('clear')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              weather === 'clear'
                ? 'bg-gold-400 text-charcoal-950 font-bold shadow-[0_0_14px_rgba(250,204,21,0.5)] scale-[1.03]'
                : 'text-moss-200 hover:text-paper-50 hover:bg-moss-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>CALM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
