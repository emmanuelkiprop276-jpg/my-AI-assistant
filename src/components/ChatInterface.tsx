import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Terminal, 
  Code2, 
  RefreshCw, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Cpu, 
  AlertCircle,
  Share2,
  Trash2,
  BookOpen,
  Network,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Message, ConversationSession, UserSubscription } from '../types';
import { MarkdownView } from './MarkdownView';
import { VoiceRecognitionManager, VoiceSpeaker } from '../utils/speech';

interface ChatInterfaceProps {
  currentSession: ConversationSession;
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onNewSession: (mode?: 'general' | 'ict-study') => void;
  autoSpeak: boolean;
  onOpenICTTab: () => void;
  subscription: UserSubscription;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentSession,
  onSendMessage,
  isLoading,
  onNewSession,
  autoSpeak,
  onOpenICTTab,
  subscription,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceManagerRef = useRef<VoiceRecognitionManager | null>(null);

  // Initialize Speech Recognition once
  useEffect(() => {
    voiceManagerRef.current = new VoiceRecognitionManager();
    return () => {
      VoiceSpeaker.stop();
      if (voiceManagerRef.current) {
        voiceManagerRef.current.stop();
      }
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession.messages, isLoading]);

  // Handle voice recognition toggling
  const handleToggleVoice = () => {
    if (!voiceManagerRef.current || !voiceManagerRef.current.isSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }

    if (isListening) {
      voiceManagerRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      setIsListening(true);
      voiceManagerRef.current.start(
        (transcript, isFinal) => {
          setInputText((prev) => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return isFinal ? `${prev}${separator}${transcript}` : transcript;
          });
        },
        (error) => {
          console.warn('Voice recognition error:', error);
          setIsListening(false);
          setSpeechError(`Voice input error: ${error}`);
          setTimeout(() => setSpeechError(null), 4000);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    // Stop listening if active
    if (isListening && voiceManagerRef.current) {
      voiceManagerRef.current.stop();
      setIsListening(false);
    }

    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (currentlySpeakingId === msgId) {
      VoiceSpeaker.stop();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(msgId);
      VoiceSpeaker.speak(text, {
        onEnd: () => setCurrentlySpeakingId(null),
        onError: () => setCurrentlySpeakingId(null),
      });
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Starter Prompts
  const quickPrompts = [
    {
      title: 'OSI 7 Layers Model',
      category: 'Computer Networks',
      icon: Network,
      prompt: 'Explain the OSI 7-layer model with real-world protocol examples and diagrams.',
    },
    {
      title: 'Python Binary Search',
      category: 'Algorithms',
      icon: Terminal,
      prompt: 'Write an optimized Python Binary Search implementation and explain its Big-O time and space complexity.',
    },
    {
      title: 'Database Normalization',
      category: 'ICT Systems',
      icon: BookOpen,
      prompt: 'Explain 1NF, 2NF, 3NF, and BCNF database normalization with clear sample tables.',
    },
    {
      title: 'Cybersecurity Principles',
      category: 'Security',
      icon: ShieldCheck,
      prompt: 'What are the core pillars of the CIA Triad and how is public key cryptography (RSA/ECC) applied in HTTPS?',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-65px)] bg-[#050814] relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main chat messages container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-5">
        {currentSession.messages.length === 0 ? (
          /* Attractive Home Screen / Welcome State */
          <div className="max-w-3xl mx-auto py-6 sm:py-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Hero Banner */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-600/40 text-blue-300 text-xs font-medium shadow-lg shadow-blue-900/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>Next-Gen Engineering & ICT Intelligence</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  ENG MANUH AI
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Your premier companion for conversational AI, ICT curriculum mastery,
                multi-language programming debugging, voice synthesis, and generative images.
              </p>
            </div>

            {/* Quick Starters Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Popular ICT & Engineering Starters
                </span>
                <span className="text-slate-500 text-[11px]">Click any to ask</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(item.prompt)}
                      className="group p-3.5 rounded-2xl bg-[#090e24]/90 hover:bg-[#0f173b] border border-slate-800 hover:border-blue-500/50 text-left transition-all duration-200 shadow-lg hover:shadow-blue-500/10 cursor-pointer flex items-start gap-3"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-blue-300 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ICT Lab Callout Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-blue-950/60 border border-indigo-700/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Need deep code debugging or interactive ICT Quizzes?
                  </h4>
                  <p className="text-xs text-slate-300">
                    Explore the specialized ICT Study Lab with syntax analyzers and exam simulators.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenICTTab}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-purple-900/40 cursor-pointer whitespace-nowrap"
              >
                Launch ICT Lab →
              </button>
            </div>
          </div>
        ) : (
          /* Active Messages Stream */
          <div className="max-w-4xl mx-auto space-y-5">
            {currentSession.messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isSpeaking = currentlySpeakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    isAssistant ? 'items-start' : 'items-start justify-end'
                  }`}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1.5px] shadow-md shadow-blue-500/20 shrink-0">
                      <div className="w-full h-full bg-[#080d21] rounded-[10px] flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble Content */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 shadow-xl transition-all ${
                      msg.isError
                        ? 'bg-rose-950/30 border border-rose-500/60 text-rose-100'
                        : isAssistant
                        ? 'bg-[#0b102b] border border-slate-800/90 text-slate-100'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500/30'
                    }`}
                  >
                    {/* Header info bar */}
                    <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800/60 text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span
                          className={
                            msg.isError
                              ? 'text-rose-400 font-heading flex items-center gap-1'
                              : isAssistant
                              ? 'text-blue-400 font-heading'
                              : 'text-blue-100 font-heading'
                          }
                        >
                          {msg.isError ? (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>ENG MANUH AI (Error)</span>
                            </>
                          ) : isAssistant ? (
                            'ENG MANUH AI'
                          ) : (
                            'You'
                          )}
                        </span>
                        {isAssistant && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                              msg.isError
                                ? 'bg-rose-900/50 text-rose-300 border-rose-700/50'
                                : 'bg-blue-950 text-blue-300 border-blue-800/50'
                            }`}
                          >
                            {msg.modelTag || 'gemini-3.8-flash'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        {/* Audio Speak button (only for non-error assistant messages) */}
                        {isAssistant && !msg.isError && (
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.content)}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              isSpeaking
                                ? 'bg-purple-600 text-white'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-purple-300'
                            }`}
                            title={isSpeaking ? 'Stop speaking' : 'Read answer aloud'}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Message Body */}
                    {isAssistant ? (
                      <div>
                        <MarkdownView content={msg.content} />
                        {msg.isError && (
                          <div className="mt-3 pt-2.5 border-t border-rose-800/40 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-rose-300/80">
                              Failed to generate response. You can retry the question.
                            </span>
                            <button
                              onClick={() => {
                                const msgs = currentSession.messages;
                                const idx = msgs.findIndex((m) => m.id === msg.id);
                                const prevUser = msgs
                                  .slice(0, idx)
                                  .reverse()
                                  .find((m) => m.role === 'user');
                                if (prevUser) {
                                  onSendMessage(prevUser.content);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>

                  {/* User Avatar */}
                  {!isAssistant && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3.5 animate-in fade-in">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1.5px] shadow-md shadow-blue-500/20 shrink-0">
                  <div className="w-full h-full bg-[#080d21] rounded-[10px] flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-blue-400 animate-spin" />
                  </div>
                </div>
                <div className="rounded-2xl px-4 py-3 bg-[#0b102b] border border-slate-800 text-slate-300 flex items-center gap-2.5">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ENG MANUH AI is computing answer...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="max-w-xl mx-auto px-4 py-2 bg-amber-950/80 border border-amber-600/50 rounded-xl text-amber-200 text-xs flex items-center gap-2 mb-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Bottom Sticky Input Section */}
      <div className="p-3 sm:p-4 bg-[#070b1a]/95 backdrop-blur-md border-t border-slate-800/90 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          {/* Active Voice Listening Visualizer */}
          {isListening && (
            <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-between text-xs text-purple-200 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-1 bg-purple-400 rounded-full wave-bar-1" />
                  <span className="w-1 bg-purple-300 rounded-full wave-bar-2" />
                  <span className="w-1 bg-purple-400 rounded-full wave-bar-3" />
                  <span className="w-1 bg-purple-200 rounded-full wave-bar-4" />
                  <span className="w-1 bg-purple-400 rounded-full wave-bar-5" />
                </div>
                <span className="font-semibold">Listening to your voice... Speak now</span>
              </div>
              <button
                onClick={handleToggleVoice}
                className="text-[11px] bg-purple-900/80 hover:bg-purple-800 px-2 py-0.5 rounded text-white cursor-pointer"
              >
                Stop Mic
              </button>
            </div>
          )}

          {/* Form input container */}
          <form
            onSubmit={handleSend}
            className="flex items-end gap-2 bg-[#0a0f26] border border-slate-700/70 focus-within:border-blue-500 rounded-2xl p-2 sm:p-2.5 shadow-xl transition-all"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak your question'}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-400" />}
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ENG MANUH AI anything... (Programming, ICT networks, algorithms, systems)"
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 resize-none max-h-36 focus:outline-none py-1.5 px-2"
            />

            {/* Clear / Reset session button if messages exist */}
            {currentSession.messages.length > 0 && (
              <button
                type="button"
                onClick={() => onNewSession('general')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer hidden sm:block shrink-0"
                title="Start new conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Micro-footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Engine: <strong className="text-slate-400 font-mono">Gemini 3.8 Flash</strong>
            </span>
            <span className="hidden xs:inline">
              Press <kbd className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send, <kbd className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded text-[10px]">Shift+Enter</kbd> for newline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
