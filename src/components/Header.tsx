import React from 'react';
import { 
  Bot, 
  Code2, 
  Sparkles, 
  Image as ImageIcon, 
  Crown, 
  Info, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Zap,
  Cpu
} from 'lucide-react';
import { ActiveTab, UserSubscription } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: UserSubscription;
  openSubscriptionModal: () => void;
  openApiDocsModal: () => void;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  openSubscriptionModal,
  openApiDocsModal,
  autoSpeak,
  setAutoSpeak,
  mobileMenuOpen,
  setMobileMenuOpen,
  toggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b1a]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition lg:hidden cursor-pointer"
            title="Chat History"
            aria-label="Toggle chat history"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Prominent ENG MANUH AI branding */}
          <div 
            onClick={() => setActiveTab('chat')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
                <div className="w-full h-full bg-[#090d24] rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:text-purple-300 transition-transform group-hover:scale-110" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#070b1a]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-violet-400 font-heading">
                  ENG MANUH AI
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  v3.8
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block font-medium">
                Professional AI & ICT Study Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0b112c]/90 border border-slate-800 p-1 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('ict-study')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'ict-study'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>ICT Study Lab</span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-500/30 text-purple-200 rounded">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab('image-gen')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'image-gen'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI Images</span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Pricing</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Spoken Voice Auto-Speech Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
              autoSpeak
                ? 'bg-purple-950/70 border-purple-600 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={autoSpeak ? 'Voice output enabled (will read responses)' : 'Voice output muted'}
            aria-label="Toggle voice output"
          >
            {autoSpeak ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px]">Speech ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Muted</span>
              </>
            )}
          </button>

          {/* User Subscription Badge / Upgrade button */}
          <button
            onClick={openSubscriptionModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
              subscription.tier === 'pro'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-900/50'
                : 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600 hover:to-purple-600 text-blue-200 hover:text-white border border-blue-500/40'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${subscription.tier === 'pro' ? 'text-amber-300' : 'text-blue-400'}`} />
            <span>{subscription.tier === 'pro' ? 'PRO PLAN' : 'FREE TIER'}</span>
          </button>

          {/* Architecture / API setup modal trigger */}
          <button
            onClick={openApiDocsModal}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-blue-400 transition cursor-pointer"
            title="API Architecture & Configuration Info"
            aria-label="Open API configurations"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Mobile navigation menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Bar */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              setActiveTab('chat');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>AI Chat</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ict-study');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'ict-study'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>ICT Study Lab</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('image-gen');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'image-gen'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span>AI Images</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('subscription');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'subscription'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Subscriptions</span>
          </button>
        </div>
      )}
    </header>
  );
};
