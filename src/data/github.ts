import { useEffect, useState } from 'react';
import { developerInfo } from './developerInfo';

// Live data from the public GitHub API (no token; 60 requests/hour per visitor, cached per session).
export const githubUser = developerInfo.links.github.replace(/\/+$/, '').split('/').pop() as string;

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics?: string[];
}

export interface GithubData {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  status: 'loading' | 'ready' | 'error';
}

const CACHE_KEY = `gh:${githubUser}`;
let inflight: Promise<GithubData> | null = null;

function readCache(): GithubData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as GithubData) : null;
  } catch {
    return null;
  }
}

async function load(): Promise<GithubData> {
  const cached = readCache();
  if (cached) return cached;

  const api = `https://api.github.com/users/${githubUser}`;
  const [profileRes, reposRes] = await Promise.all([
    fetch(api),
    fetch(`${api}/repos?per_page=100&sort=pushed`),
  ]);
  if (!profileRes.ok || !reposRes.ok) throw new Error(`GitHub API ${profileRes.status}/${reposRes.status}`);

  const profile = (await profileRes.json()) as GithubProfile;
  const repos = ((await reposRes.json()) as GithubRepo[])
    .filter(r => !r.fork)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at));

  const data: GithubData = { profile, repos, status: 'ready' };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (private mode); just skip caching.
  }
  return data;
}

export function useGithub(): GithubData {
  const [data, setData] = useState<GithubData>(() => readCache() ?? { profile: null, repos: [], status: 'loading' });

  useEffect(() => {
    if (data.status === 'ready') return;
    let alive = true;
    inflight ??= load();
    inflight
      .then(d => alive && setData(d))
      .catch(() => {
        inflight = null;
        if (alive) setData({ profile: null, repos: [], status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, [data.status]);

  return data;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** The repo whose name matches a game's title or id (e.g. "Astral-Rally" for "Astral Rally"), if one is public. */
export function findRepoFor(repos: GithubRepo[], ...names: string[]): GithubRepo | undefined {
  const wanted = names.map(normalize);
  return repos.find(r => wanted.includes(normalize(r.name)));
}

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// Colours GitHub uses for common languages.
export const languageColors: Record<string, string> = {
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  ShaderLab: '#222c37',
  HLSL: '#aace60',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  GDScript: '#355570',
  Java: '#b07219',
};
