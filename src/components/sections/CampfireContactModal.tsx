import React, { useState } from 'react';
import { developerInfo } from '../../data/developerInfo';
import { X, Mail, Flame, Send, Check, Copy, Sparkles, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon, UnityIcon } from '../common/Icons';
import { AudioEngine } from '../../engine/AudioEngine';

interface CampfireContactModalProps {
  onClose: () => void;
}

export const CampfireContactModal: React.FC<CampfireContactModalProps> = ({ onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerInfo.email);
    setCopiedEmail(true);
    AudioEngine.playSfx('interact');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSent(true);
    AudioEngine.playSfx('secretFound');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-4xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Flame className="w-6 h-6 fill-current text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// THE COZY CAMPFIRE · CONTACT & COLLABORATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                Let&apos;s Build Something Extraordinary
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              AudioEngine.playSfx('closeModal');
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans">
            Based in <strong className="text-amber-300">{developerInfo.location}</strong> — {developerInfo.status}. Whether you are looking to hire a gameplay engineer, technical artist, or collaborate on innovative game projects, the campfire is always warm.
          </p>

          {/* Social Links & Direct Email Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Email Card */}
            <div className="bg-black/45 backdrop-blur-xl p-4 rounded-2xl border border-white/15 hover:border-amber-400/60 transition-all flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Direct Email</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-white">{developerInfo.email}</div>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer border border-white/15"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
              </button>
            </div>

            {/* GitHub Card */}
            <a
              href={developerInfo.links.github}
              target="_blank"
              rel="noreferrer"
              className="bg-black/45 backdrop-blur-xl p-4 rounded-2xl border border-white/15 hover:border-amber-400/60 transition-all flex items-center justify-between shadow-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-paper-400 uppercase font-bold">GitHub Repositories</div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">github.com/Nigatron911</div>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>

            {/* Unity Play Card */}
            {developerInfo.links.unityPlay && (
              <a
                href={developerInfo.links.unityPlay}
                target="_blank"
                rel="noreferrer"
                className="bg-black/45 backdrop-blur-xl p-4 rounded-2xl border border-white/15 hover:border-amber-400/60 transition-all flex items-center justify-between shadow-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                    <UnityIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Unity Play Shipped Games</div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Dottie · Bait · Astral Rally</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}

            {/* LinkedIn Card */}
            <a
              href={developerInfo.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="bg-black/45 backdrop-blur-xl p-4 rounded-2xl border border-white/15 hover:border-amber-400/60 transition-all flex items-center justify-between shadow-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-paper-400 uppercase font-bold">LinkedIn Network</div>
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">linkedin.com/in/vinaysankar</div>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </div>

          {/* Quick Message Form */}
          <div className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold font-sans text-white">Send a Message Around the Fire</h3>
            </div>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-center space-y-2 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-white">Message Transmitted!</h4>
                <p className="text-xs text-amber-200">
                  Thank you! Vinay Sankar has received your note and will reply promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-paper-300 mb-1.5 uppercase">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Studio Lead / Recruiter"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-paper-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-paper-300 mb-1.5 uppercase">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-paper-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-paper-300 mb-1.5 uppercase">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your game project, technical role, or collaboration idea..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-paper-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs sm:text-sm font-black tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <span className="text-amber-300 font-bold">// BANGALORE, INDIA (UTC+5:30)</span>
          <span>CAMPFIRE TRANSMISSION SYSTEM</span>
        </div>
      </div>
    </div>
  );
};
