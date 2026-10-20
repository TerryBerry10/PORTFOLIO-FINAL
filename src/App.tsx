import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { WorldEngine } from './engine/WorldEngine';
import { TimeOfDay, WeatherType, ZoneId } from './types/world';
import { Project } from './types/project';
import { projects } from './data/projects';
import { AudioEngine } from './engine/AudioEngine';
import { toggleFullscreen } from './utils/fullscreen';

// World & Canvas Components
import { WorldCanvas } from './components/world/WorldCanvas';
const WorldMapModal = lazy(() => import('./components/world/WorldMapModal').then(m => ({ default: m.WorldMapModal })));
import { TouchControls } from './components/world/TouchControls';

// UI Shell Components
import { Header } from './components/ui/Header';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WorldCenterHeroOverlay } from './components/ui/WorldCenterHeroOverlay';
const QuickViewModal = lazy(() => import('./components/ui/QuickViewModal').then(m => ({ default: m.QuickViewModal })));
const RecruiterViewModal = lazy(() => import('./components/ui/RecruiterViewModal').then(m => ({ default: m.RecruiterViewModal })));
const DevConsole = lazy(() => import('./components/ui/DevConsole').then(m => ({ default: m.DevConsole })));
import { PhotoMode } from './components/ui/PhotoMode';

// Portfolio Modals
const ProjectsGalleryModal = lazy(() => import('./components/portfolio/ProjectsGalleryModal').then(m => ({ default: m.ProjectsGalleryModal })));
const ProjectBreakdownModal = lazy(() => import('./components/portfolio/ProjectBreakdownModal').then(m => ({ default: m.ProjectBreakdownModal })));
const SkillsWorkshopModal = lazy(() => import('./components/sections/SkillsWorkshopModal').then(m => ({ default: m.SkillsWorkshopModal })));
const JourneyTreeModal = lazy(() => import('./components/sections/JourneyTreeModal').then(m => ({ default: m.JourneyTreeModal })));
const LabExperimentsModal = lazy(() => import('./components/sections/LabExperimentsModal').then(m => ({ default: m.LabExperimentsModal })));
const ResumeModal = lazy(() => import('./components/sections/ResumeModal').then(m => ({ default: m.ResumeModal })));
const CampfireContactModal = lazy(() => import('./components/sections/CampfireContactModal').then(m => ({ default: m.CampfireContactModal })));
const MiniGamesModal = lazy(() => import('./components/sections/MiniGamesModal').then(m => ({ default: m.MiniGamesModal })));
const RetroTVPlayer = lazy(() => import('./components/portfolio/RetroTVPlayer').then(m => ({ default: m.RetroTVPlayer })));
const UpcomingBillboardModal = lazy(() => import('./components/world/UpcomingBillboardModal').then(m => ({ default: m.UpcomingBillboardModal })));
import { OPEN_GAME_TV_EVENT, openGameTV } from './utils/gameTV';
import { Billboard } from './data/billboards';
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
    'gallery' | 'breakdown' | 'skills' | 'journey' | 'lab' | 'resume' | 'contact' | 'map' | 'quickView' | 'recruiter' | 'minigames' | null
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

  // Prefetch section chunks during idle time so the first open is instant
  useEffect(() => {
    if (!isLoaded) return;
    const warm = () => {
      import('./components/portfolio/ProjectsGalleryModal');
      import('./components/portfolio/ProjectBreakdownModal');
      import('./components/sections/ResumeModal');
      import('./components/ui/QuickViewModal');
      import('./components/ui/RecruiterViewModal');
      import('./components/portfolio/RetroTVPlayer');
      import('./components/sections/JourneyTreeModal');
      import('./components/sections/CampfireContactModal');
      import('./components/sections/SkillsWorkshopModal');
      import('./components/sections/LabExperimentsModal');
      import('./components/sections/MiniGamesModal');
      import('./components/world/WorldMapModal');
    };
    const ric = (window as any).requestIdleCallback as ((cb: () => void) => number) | undefined;
    const id = ric ? ric(warm) : window.setTimeout(warm, 1500);
    return () => (ric ? (window as any).cancelIdleCallback(id) : clearTimeout(id));
  }, [isLoaded]);

  // Retro TV game player (opened from any PLAY button via openGameTV)
  const [tvProjectId, setTvProjectId] = useState<string | null>(null);

  // Promo airship banners in the sky
  const [upcomingBillboard, setUpcomingBillboard] = useState<Billboard | null>(null);
  const handleBillboardInteract = (billboard: Billboard) => {
    if (billboard.kind === 'released' && billboard.projectId) openGameTV(billboard.projectId);
    else setUpcomingBillboard(billboard);
  };
  useEffect(() => {
    const onOpen = (e: Event) => setTvProjectId((e as CustomEvent<string>).detail);
    window.addEventListener(OPEN_GAME_TV_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GAME_TV_EVENT, onOpen);
  }, []);

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
          onOpenBreakdown={handleOpenBreakdown}
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
        onBillboardInteract={handleBillboardInteract}
        timeOfDay={timeOfDay}
        weather={weather}
        paused={!!activeModal || !!tvProjectId || !!upcomingBillboard}
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

      <Suspense fallback={null}>
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

      {upcomingBillboard && (
        <UpcomingBillboardModal
          billboard={upcomingBillboard}
          onClose={() => setUpcomingBillboard(null)}
          onFollow={() => {
            setUpcomingBillboard(null);
            setActiveModal('contact');
          }}
        />
      )}

      {tvProjectId && (
        <RetroTVPlayer
          key={tvProjectId}
          projectId={tvProjectId}
          onClose={() => setTvProjectId(null)}
        />
      )}

      </Suspense>

      {/* Interactive Ghibli Spirit Firefly Cursor with trailing stardust */}
      <InteractiveSpiritCursor />
    </div>
  );
}

export default App;
