import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatInterface } from './components/ChatInterface';
import { ICTStudyAssistant } from './components/ICTStudyAssistant';
import { ImageGenerationStudio } from './components/ImageGenerationStudio';
import { SubscriptionSection } from './components/SubscriptionSection';
import { ApiConfigModal } from './components/ApiConfigModal';
import { ConversationSession, Message, ActiveTab, UserSubscription } from './types';
import { VoiceSpeaker } from './utils/speech';

const STORAGE_KEY_SESSIONS = 'eng_manuh_sessions_v1';
const STORAGE_KEY_SUB = 'eng_manuh_subscription_v1';
const STORAGE_KEY_AUTOSPEAK = 'eng_manuh_autospeak_v1';

export default function App() {
  // 1. Sessions State with LocalStorage persistence
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved sessions:', e);
    }

    // Default first session
    const initialSession: ConversationSession = {
      id: 'session-default-1',
      title: 'Welcome to ENG MANUH AI',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'general',
      messages: [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `### 👋 Welcome to ENG MANUH AI!

I am your dedicated Engineering & Artificial Intelligence Assistant. Here is what we can do together:

1. **AI Chat & Reasoning**: Ask any question in natural language and receive deep, structured answers.
2. **ICT & Programming Study Lab**: Code explanations, bug fixes, algorithmic complexity analysis, and networking subnets.
3. **AI Image Generation**: Turn prompts into visuals in our dedicated Art Studio.
4. **Voice Mode**: Tap the **Mic** button to speak your questions, and listen to spoken answers anytime.

*How can I assist your engineering journey today?*`,
          timestamp: Date.now(),
          modelTag: 'gemini-3.8-flash',
        },
      ],
    };
    return [initialSession];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-default-1';
  });

  // 2. Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUB);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      tier: 'free',
      status: 'active',
      queriesRemainingToday: 50,
      imagesRemainingToday: 5,
    };
  });

  // 3. UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 4. Voice Auto-speak toggle
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTOSPEAK) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Save sessions to storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Could not save sessions to storage:', e);
    }
  }, [sessions]);

  // Save subscription to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subscription));
    } catch (e) {}
  }, [subscription]);

  // Save autoSpeak setting
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTOSPEAK, String(autoSpeak));
    } catch (e) {}
  }, [autoSpeak]);

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    // Update session immediately with user message
    const updatedMessages = [...currentSession.messages, userMessage];
    
    // Auto title if first user message
    let newTitle = currentSession.title;
    if (currentSession.messages.length <= 1) {
      newTitle = text.slice(0, 36).trim() + (text.length > 36 ? '...' : '');
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? {
              ...s,
              title: newTitle,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => !m.isError)
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
          mode: currentSession.mode,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON response (HTTP ${response.status})`);
      }

      if (!response.ok || !data || !data.success || !data.reply) {
        const errorMsg =
          data?.details ||
          data?.error ||
          `Unable to generate response from Gemini AI (HTTP ${response.status}).`;
        throw new Error(errorMsg);
      }

      const assistantMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        modelTag: data.source || 'gemini-3.8-flash',
        isError: false,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: Date.now(),
              }
            : s
        )
      );

      // Decrement queries count on successful generation
      setSubscription((prev) => ({
        ...prev,
        queriesRemainingToday: Math.max(0, prev.queriesRemainingToday - 1),
      }));

      // Speak response if autoSpeak is enabled
      if (autoSpeak) {
        VoiceSpeaker.speak(data.reply);
      }
    } catch (err: any) {
      console.error('Chat error occurred:', err);
      const detailedErrorText =
        err?.message || 'Failed to receive a valid response from the Gemini AI engine.';

      const errorMessage: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **AI Service Notice**: ${detailedErrorText}`,
        timestamp: Date.now(),
        modelTag: 'gemini-error',
        isError: true,
        errorDetails: detailedErrorText,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...s.messages, errorMessage],
                updatedAt: Date.now(),
              }
            : s
        )
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  // Create new session
  const handleNewSession = (mode: 'general' | 'ict-study' = 'general') => {
    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      title: mode === 'ict-study' ? 'ICT Study Session' : 'New AI Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('chat');
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === 0) {
      const fresh: ConversationSession = {
        id: `session-${Date.now()}`,
        title: 'New Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: 'general',
        messages: [],
      };
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
    } else {
      setSessions(filtered);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
    }
  };

  // Rename session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    const fresh: ConversationSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'general',
      messages: [],
    };
    setSessions([fresh]);
    setCurrentSessionId(fresh.id);
  };

  // Upgrade subscription tier
  const handleUpgradeTier = (tier: 'free' | 'pro' | 'enterprise') => {
    setSubscription({
      tier,
      status: 'active',
      queriesRemainingToday: tier === 'free' ? 50 : 999999,
      imagesRemainingToday: tier === 'free' ? 5 : 999999,
      renewsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* 1. Header with prominent ENG MANUH AI branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        openSubscriptionModal={() => setActiveTab('subscription')}
        openApiDocsModal={() => setIsApiDocsOpen(true)}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 2. Main Content Body with Sidebar (for chat) or specialized full-screen tabs */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' && (
          <>
            {/* Chat History Sidebar */}
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSession.id}
              onSelectSession={(id) => setCurrentSessionId(id)}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onRenameSession={handleRenameSession}
              onClearAllSessions={handleClearAllSessions}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* AI Chat Interface */}
            <ChatInterface
              currentSession={currentSession}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              onNewSession={handleNewSession}
              autoSpeak={autoSpeak}
              onOpenICTTab={() => setActiveTab('ict-study')}
              subscription={subscription}
            />
          </>
        )}

        {/* ICT and Programming Study Assistant Tab */}
        {activeTab === 'ict-study' && (
          <ICTStudyAssistant
            subscription={subscription}
            onOpenSubscriptionModal={() => setActiveTab('subscription')}
          />
        )}

        {/* AI Image Generation Studio Tab */}
        {activeTab === 'image-gen' && (
          <ImageGenerationStudio
            subscription={subscription}
            onOpenSubscriptionModal={() => setActiveTab('subscription')}
          />
        )}

        {/* Free and Premium Subscription Section Tab */}
        {activeTab === 'subscription' && (
          <SubscriptionSection
            subscription={subscription}
            onUpgrade={handleUpgradeTier}
          />
        )}
      </main>

      {/* 3. API Architecture & Configuration Explainer Modal */}
      <ApiConfigModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />
    </div>
  );
}
