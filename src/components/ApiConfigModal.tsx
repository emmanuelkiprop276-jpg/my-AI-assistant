import React, { useEffect, useState } from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  Key, 
  Volume2, 
  Image as ImageIcon, 
  Code2, 
  CreditCard, 
  Database,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ApiStatus } from '../types';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/status')
        .then((res) => res.json())
        .then((data) => {
          setStatus(data);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Status check failed:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#080d24] border border-blue-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                ENG MANUH AI System Architecture & API Guide
              </h3>
              <p className="text-xs text-slate-400">
                Detailed breakdown of models, keys, and browser APIs utilized in this application.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm text-slate-200">
          {/* Real-time Server Diagnostic Pill */}
          <div className="p-4 rounded-2xl bg-[#0d1435] border border-blue-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="font-bold text-white text-xs sm:text-sm block">
                  Backend API Engine: {status?.status === 'online' ? 'Online & Responsive' : 'Checking status...'}
                </span>
                <span className="text-[11px] text-slate-400">
                  Express Server + Vite Proxy active on Port 3000
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                status?.geminiConfigured
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-blue-950/70 border-blue-500 text-blue-300'
              }`}>
                {status?.geminiConfigured ? 'GEMINI_API_KEY Active' : 'Intelligent Engine Active'}
              </span>
            </div>
          </div>

          {/* Detailed Feature breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Feature API Requirements & Configuration Status
            </h4>

            {/* 1. AI Chat Interface */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>1. AI Chat Interface (Gemini 3.8 Flash)</span>
                </div>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded">
                  Server-side @google/genai
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong> All requests route through the backend <code className="text-blue-300">/api/chat</code> endpoint.
                It uses the latest <strong>gemini-3.8-flash</strong> model with conversation history memory.
                <br />
                <strong>Configuration:</strong> Reads <code className="text-purple-300">process.env.GEMINI_API_KEY</code> securely on the server. Never exposed to browser bundles.
              </p>
            </div>

            {/* 2. ICT & Programming Study Assistant */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>2. ICT & Programming Assistant</span>
                </div>
                <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded">
                  Integrated Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong> Leverages specialized system instructions targeting Computer Science pedagogy, line-by-line AST parsing, Big-O complexity calculators, and OSI / TCP subnetting algorithms.
                <br />
                <strong>Configuration:</strong> Included natively via the <code className="text-blue-300">/api/ict-study</code> server endpoint with interactive client quiz states.
              </p>
            </div>

            {/* 3. AI Image Generation */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  <span>3. AI Image Generation</span>
                </div>
                <span className="text-[11px] font-mono text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded">
                  gemini-3.1-flash-lite-image
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong> Calls <code className="text-blue-300">/api/generate-image</code> which uses <strong>gemini-3.1-flash-lite-image</strong> to return Base64 inline PNG images, alongside client-side creative vector rendering for instant fallbacks.
                <br />
                <strong>Configuration:</strong> Requires <code className="text-purple-300">GEMINI_API_KEY</code> with image generation permissions.
              </p>
            </div>

            {/* 4. Voice Input & Spoken Response */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>4. Voice Input & Spoken Audio Output</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                  Zero Extra Key Required!
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong>
                <br />
                • <strong>Voice Input:</strong> Uses the browser-standard <code>Web Speech API (webkitSpeechRecognition)</code>. Users grant microphone permission and speech is transcribed into the prompt input automatically.
                <br />
                • <strong>Spoken Response:</strong> Uses the browser-standard <code>window.speechSynthesis</code> engine with natural voices, custom rate, and pitch controls.
              </p>
            </div>

            {/* 5. Chat History & Persistence */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>5. Chat History & New Conversation</span>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded">
                  HTML5 LocalStorage
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong> Session logs, conversation titles, and message history are automatically persisted in client browser storage. You can rename, delete, switch conversations, and export to Markdown files without any external database needed.
              </p>
            </div>

            {/* 6. Subscriptions & Payments */}
            <div className="p-3.5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>6. Free and Premium Subscriptions</span>
                </div>
                <span className="text-[11px] font-mono text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded">
                  Stripe / M-Pesa Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Production integration:</strong> To accept live commercial payments, configure <strong>Stripe Checkout</strong> or <strong>M-Pesa Daraja API</strong> by creating webhook routes and setting <code className="text-purple-300">STRIPE_SECRET_KEY</code>.
                <br />
                <strong>Current state:</strong> Provides a complete interactive simulator with plan switches (Free, Pro, Enterprise), monthly/annual discounts, and instant tier upgrades.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#060a17] rounded-b-3xl flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All API calls encrypted over HTTPS</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
