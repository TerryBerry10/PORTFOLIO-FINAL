import React, { useEffect } from 'react';
import { X, Star, GitFork, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { AudioEngine } from '../../engine/AudioEngine';
import { developerInfo } from '../../data/developerInfo';
import { useGithub, githubUser, timeAgo, languageColors, GithubRepo } from '../../data/github';

interface GithubModalProps {
  onClose: () => void;
}

const RepoCard: React.FC<{ repo: GithubRepo }> = ({ repo }) => (
  <a
    href={repo.html_url}
    target="_blank"
    rel="noreferrer"
    className="group flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/70 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all"
  >
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-amber-300 break-all transition-colors">
        {repo.name}
      </h3>
      <ExternalLink className="w-4 h-4 shrink-0 text-paper-400 group-hover:text-amber-300 transition-colors" />
    </div>
    <p className="text-sm text-paper-300 leading-relaxed line-clamp-3 flex-1">
      {repo.description || <span className="text-paper-400/60 italic">No description</span>}
    </p>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-paper-400">
      {repo.language && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: languageColors[repo.language] ?? '#9ca3af' }} />
          {repo.language}
        </span>
      )}
      {repo.stargazers_count > 0 && (
        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
      )}
      {repo.forks_count > 0 && (
        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
      )}
      <span>Updated {timeAgo(repo.pushed_at)}</span>
      {repo.archived && <span className="text-paper-400/70">Archived</span>}
    </div>
  </a>
);

export const GithubModal: React.FC<GithubModalProps> = ({ onClose }) => {
  const { profile, repos, status } = useGithub();

  useEffect(() => {
    AudioEngine.playSfx('openModal');
  }, []);

  const handleClose = () => {
    AudioEngine.playSfx('closeModal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[94dvh] flex flex-col my-auto rounded-3xl border border-white/20 bg-[#0d0f14]/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4 sm:py-5 border-b border-white/15">
          <div className="flex items-center gap-3 min-w-0">
            {profile ? (
              <img src={profile.avatar_url} alt="" className="w-11 h-11 rounded-xl border border-white/20 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <GithubIcon className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-mono font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> // CODE ON GITHUB
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{profile?.name || developerInfo.name}</h2>
              <p className="font-mono text-xs text-paper-400 truncate">@{githubUser}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-colors shrink-0"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {profile && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-paper-300">
              <span><strong className="text-white">{profile.public_repos}</strong> public repos</span>
              <span><strong className="text-white">{profile.followers}</strong> followers</span>
            </div>
          )}

          {status === 'loading' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-36 rounded-2xl bg-white/[0.05] border border-white/10 animate-pulse" />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-2">
              <p className="text-sm text-paper-200">Couldn't load repositories from GitHub right now.</p>
              <p className="text-xs text-paper-400">You can still browse them directly on GitHub.</p>
            </div>
          )}

          {status === 'ready' && repos.length === 0 && (
            <p className="text-sm text-paper-300 text-center py-6">No public repositories yet.</p>
          )}

          {repos.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {repos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <a
              href={developerInfo.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> View full profile on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
