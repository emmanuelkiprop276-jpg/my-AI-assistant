import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Download, 
  Edit2, 
  Check, 
  X, 
  Code2, 
  Bot, 
  Clock, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { ConversationSession } from '../types';

interface ChatSidebarProps {
  sessions: ConversationSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: (mode?: 'general' | 'ict-study') => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAllSessions: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  isOpen,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartRename = (session: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleExportSession = (session: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `# ${session.title}\nDate: ${new Date(session.createdAt).toLocaleString()}\nMode: ${session.mode}\n\n` +
      session.messages.map(m => `### ${m.role === 'user' ? 'You' : 'ENG MANUH AI'}\n${m.content}\n`).join('\n---\n\n');
    
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-[#070b1a] border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top actions */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewSession('general');
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-900/30 transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="px-3.5 py-2">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[#0b112c] border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Chats ({sessions.length})</span>
            {sessions.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all conversation history?')) {
                    onClearAllSessions();
                  }
                }}
                className="text-slate-500 hover:text-red-400 transition lowercase font-normal"
                title="Clear all"
              >
                clear all
              </button>
            )}
          </div>

          {filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
              <p>No conversations found.</p>
              <p className="mt-1 text-[11px]">Click "New Conversation" to start chatting with ENG MANUH AI.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isSelected = session.id === currentSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#10173b] border-blue-500/50 text-white shadow-md'
                      : 'border-transparent hover:bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-1.5 rounded-lg ${
                      session.mode === 'ict-study' 
                        ? 'bg-purple-950/80 text-purple-400 border border-purple-800/50' 
                        : 'bg-blue-950/80 text-blue-400 border border-blue-800/50'
                    }`}>
                      {session.mode === 'ict-study' ? (
                        <Code2 className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-slate-900 text-xs text-white px-2 py-0.5 rounded border border-blue-500 focus:outline-none w-full"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(session.id, e as any);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={(e) => handleSaveRename(session.id, e)}
                            className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="truncate font-medium">{session.title}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(session.updatedAt || session.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions on hover */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                      <button
                        onClick={(e) => handleExportSession(session, e)}
                        className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded"
                        title="Export Markdown"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060a16] text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <Sparkles className="w-3 h-3" /> ENG MANUH AI
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Memory Saved</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Conversations are preserved securely in your local browser storage.
          </p>
        </div>
      </aside>
    </>
  );
};
