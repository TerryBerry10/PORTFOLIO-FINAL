import { Project } from '../types/project';

export const OPEN_GAME_TV_EVENT = 'open-game-tv';

/** Opens the retro TV player for a project from anywhere in the UI. */
export const openGameTV = (projectId: string) => {
  window.dispatchEvent(new CustomEvent<string>(OPEN_GAME_TV_EVENT, { detail: projectId }));
};

/** Resolves an embeddable iframe URL, converting Unity Play page links to their frame endpoint. */
export const getEmbedUrl = (project: Project): string | null => {
  if (project.embedUrl) return project.embedUrl;
  const match = project.playableUrl?.match(/play\.unity\.com\/(?:[a-z]{2}\/)?games\/([0-9a-f-]{36})/i);
  if (match) return `https://play.unity.com/api/v1/games/game/${match[1]}/build/latest/frame`;
  return null;
};
