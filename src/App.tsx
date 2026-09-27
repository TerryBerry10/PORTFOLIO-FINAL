import React, { useState, useEffect, useRef } from 'react';
import { WorldEngine } from './engine/WorldEngine';
import { TimeOfDay, WeatherType, ZoneId } from './types/world';
import { Project } from './types/project';
import { projects } from './data/projects';
import { AudioEngine } from './engine/AudioEngine';
import { requestFullscreen, toggleFullscreen } from './utils/fullscreen';

// World & Canvas Components
import { WorldCanvas } from './components/world/WorldCanvas';
import { WorldMapModal } from './components/world/WorldMapModal';
import { TouchControls } from './components/world/TouchControls';

// UI Shell Components
import { Header } from './components/ui/Header';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WorldCenterHeroOverlay } from './components/ui/WorldCenterHeroOverlay';
import { QuickViewModal } from './components/ui/QuickViewModal';
import { RecruiterViewModal } from './components/ui/RecruiterViewModal';
import { DevConsole } from './components/ui/DevConsole';
import { PhotoMode } from './components/ui/PhotoMode';

// Portfolio Modals
import { ProjectsGalleryModal } from './components/portfolio/ProjectsGalleryModal';
import { ProjectBreakdownModal } from './components/portfolio/ProjectBreakdownModal';
import { SkillsWorkshopModal } from './components/sections/SkillsWorkshopModal';
import { JourneyTreeModal } from './components/sections/JourneyTreeModal';
import { LabExperimentsModal } from './components/sections/LabExperimentsModal';
import { LevelDesignModal } from './components/sections/LevelDesignModal';
import { ResumeModal } from './components/sections/ResumeModal';
import { CampfireContactModal } from './components/sections/CampfireContactModal';
import { MiniGamesModal } from './components/sections/MiniGamesModal';
import { InteractiveSpiritCursor } from './components/common/InteractiveSpiritCursor';

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [engine, setEngine] = useState<WorldEngine | null>(null);

  // Environmental state (Locked to Night with glowing Breeze)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [weather, setWeather] = useState<WeatherType>('breeze');
  const [isMuted, setIsMuted] = useState(false);
  const [dreamMode, setDreamMode] = useState(false);

  // UI Modes
  const [devMode, setDevMode] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(1.0);

  // Active Zone & Modals
  const [activeZoneId, setActiveZoneId] = useState<ZoneId | null>(null);
  const [activeModal, setActiveModal] = useState<
    'gallery' | 'breakdown' | 'skills' | 'journey' | 'levels' | 'lab' | 'resume' | 'contact' | 'map' | 'quickView' | 'recruiter' | 'minigames' | null
  >(null);
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  // Telemetry for DEV console
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    frameTime: 16.6,
  });

  // Handle Zone Interactions (when user triggers 'E' or interacts with world zone)
  const handleInteractTrigger = (zoneId: ZoneId) => {
    switch (zoneId) {
      case 'home':
        setActiveModal('journey');
        break;
      case 'workshop':
        setActiveModal('gallery');
        break;
      case 'forest':
        setActiveModal('minigames');
        break;
      case 'tree':
        setActiveModal('journey');
        break;
      case 'lake':
        setActiveModal('skills');
        break;
      case 'lab':
        setActiveModal('lab');
        break;
      case 'campfire':
        setActiveModal('contact');
        break;
      case 'skyIsland':
        setActiveModal('resume');
        break;
    }
  };

  const handleOpenBreakdown = (project: Project) => {
    setSelectedProject(project);
    setActiveModal('breakdown');
  };

  const handleFastTravel = (zoneId: ZoneId) => {
    if (engine) {
      engine.fastTravelToZone(zoneId);
    }
  };

  const handleToggleMute = () => {
    const muted = AudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleZoomChange = (zoom: number) => {
    setCameraZoom(zoom);
    if (engine) {
      engine.camera.zoom = zoom;
    }
  };

  // Keyboard shortcut 'DEV' & 'ESC'
  useEffect(() => {
    let keyBuffer = '';
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else if (photoMode) {
          setPhotoMode(false);
        } else if (devMode) {
          setDevMode(false);
        } else {
          setActiveModal('quickView');
        }
      }

      if (e.code === 'KeyF') {
        toggleFullscreen();
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-3);
      if (keyBuffer === 'dev') {
        setDevMode(prev => !prev);
        AudioEngine.playSfx('secretFound');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeModal, photoMode, devMode]);

  // Automatic fullscreen trigger on first user gesture
  useEffect(() => {
    const triggerAutoFullscreen = () => {
      requestFullscreen();
    };

    window.addEventListener('click', triggerAutoFullscreen, { once: true });
    window.addEventListener('keydown', triggerAutoFullscreen, { once: true });
    window.addEventListener('touchstart', triggerAutoFullscreen, { once: true });

    return () => {
      window.removeEventListener('click', triggerAutoFullscreen);
      window.removeEventListener('keydown', triggerAutoFullscreen);
      window.removeEventListener('touchstart', triggerAutoFullscreen);
    };
  }, []);

  // Periodic Telemetry sync
  useEffect(() => {
    if (!devMode || !engine) return;
    const interval = setInterval(() => {
      setTelemetry({
        fps: engine.fps,
        frameTime: engine.frameTime,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [devMode, engine]);

  // Header direct section navigation
  const handleNavigateSection = (section: string) => {
    switch (section) {
      case 'world':
        setActiveModal(null);
        break;
      case 'projects':
        setActiveModal('gallery');
        break;
      case 'levels':
        setActiveModal('levels');
        break;
      case 'about':
        setActiveModal('journey');
        break;
      case 'lab':
        setActiveModal('lab');
        break;
      case 'resume':
        setActiveModal('resume');
        break;
      case 'contact':
        setActiveModal('contact');
        break;
      case 'home':
        handleFastTravel('home');
        break;
    }
  };

  const getActiveZoneLabel = () => {
    if (!activeZoneId || !engine) return null;
    const zone = engine.renderer.zones.find(z => z.id === activeZoneId);
    return zone?.interactLabel || 'Interact';
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020408] font-sans">
      
      {/* 1. Centered Hero Landing Screen */}
      {!isLoaded && (
        <LoadingScreen
          onEnter={() => setIsLoaded(true)}
          onViewProjects={() => {
            setIsLoaded(true);
            setActiveModal('gallery');
          }}
          onViewResume={() => {
            setIsLoaded(true);
            setActiveModal('resume');
          }}
        />
      )}

      {/* 2. World Canvas Engine */}
      <WorldCanvas
        onEngineReady={eng => setEngine(eng)}
        onZoneChange={zone => setActiveZoneId(zone)}
        onInteractTrigger={handleInteractTrigger}
        timeOfDay={timeOfDay}
        weather={weather}
      />

      {/* 3. Global Header UI */}
      {isLoaded && !photoMode && (
        <Header
          timeOfDay={timeOfDay}
          onTimeChange={setTimeOfDay}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenQuickView={() => setActiveModal('quickView')}
          onOpenRecruiter={() => setActiveModal('recruiter')}
          onOpenMap={() => setActiveModal('map')}
          onTogglePhotoMode={() => setPhotoMode(true)}
          onToggleDevMode={() => setDevMode(prev => !prev)}
          onNavigateSection={handleNavigateSection}
          devMode={devMode}
        />
      )}

      {/* 4. Center Hero Overlay with dynamic WASD 2-second fade */}
      <WorldCenterHeroOverlay isVisible={isLoaded && !photoMode && !activeModal} />

      {/* 5. Virtual Mobile Touch Joystick & Action Button */}
      {isLoaded && !photoMode && !activeModal && (
        <TouchControls
          onMove={(x, y, isRunning) => engine?.player.setInputVector(x, y, isRunning)}
          onInteract={() => engine?.interact()}
          activeZoneLabel={getActiveZoneLabel()}
        />
      )}

      {/* 7. Photo Mode Overlay */}
      {photoMode && (
        <PhotoMode
          onClose={() => {
            setPhotoMode(false);
            handleZoomChange(1.0);
          }}
          onZoomChange={handleZoomChange}
          zoom={cameraZoom}
        />
      )}

      {/* 9. Developer Mode Telemetry Overlay */}
      {devMode && engine && (
        <DevConsole
          fps={telemetry.fps}
          frameTime={telemetry.frameTime}
          playerState={engine.player.state}
          activeZoneId={activeZoneId}
          timeOfDay={timeOfDay}
          weather={weather}
          onClose={() => setDevMode(false)}
        />
      )}

      {/* 10. Modals / Field Journals / Section Overlays */}
      {activeModal === 'gallery' && (
        <ProjectsGalleryModal
          onClose={() => setActiveModal(null)}
          onOpenBreakdown={handleOpenBreakdown}
        />
      )}

      {activeModal === 'breakdown' && (
        <ProjectBreakdownModal
          project={selectedProject}
          onClose={() => setActiveModal('gallery')}
        />
      )}

      {activeModal === 'skills' && (
        <SkillsWorkshopModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'journey' && (
        <JourneyTreeModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'lab' && (
        <LabExperimentsModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'levels' && (
        <LevelDesignModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'resume' && (
        <ResumeModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'contact' && (
        <CampfireContactModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'map' && engine && (
        <WorldMapModal
          zones={engine.renderer.zones}
          activeZoneId={activeZoneId}
          onFastTravel={handleFastTravel}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'quickView' && (
        <QuickViewModal
          onClose={() => setActiveModal(null)}
          onOpenBreakdown={handleOpenBreakdown}
          onOpenSkills={() => setActiveModal('skills')}
          onOpenJourney={() => setActiveModal('journey')}
          onOpenLab={() => setActiveModal('lab')}
          onOpenLevels={() => setActiveModal('levels')}
          onOpenResume={() => setActiveModal('resume')}
          onOpenContact={() => setActiveModal('contact')}
        />
      )}

      {activeModal === 'recruiter' && (
        <RecruiterViewModal
          onClose={() => setActiveModal(null)}
          onOpenBreakdown={handleOpenBreakdown}
          onOpenResume={() => setActiveModal('resume')}
        />
      )}

      {activeModal === 'minigames' && (
        <MiniGamesModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Interactive Ghibli Spirit Firefly Cursor with trailing stardust */}
      <InteractiveSpiritCursor />
    </div>
  );
}

export default App;
