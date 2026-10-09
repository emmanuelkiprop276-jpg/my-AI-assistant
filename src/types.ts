export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelTag?: string;
  isStreaming?: boolean;
  isError?: boolean;
  errorDetails?: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: 'general' | 'ict-study';
  messages: Message[];
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
  createdAt: number;
  model: string;
}

export type ActiveTab = 'chat' | 'ict-study' | 'image-gen' | 'subscription' | 'api-docs';

export interface UserSubscription {
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'trial';
  queriesRemainingToday: number;
  imagesRemainingToday: number;
  renewsAt?: string;
}

export interface ApiStatus {
  status: string;
  appName: string;
  geminiConfigured: boolean;
  activeModels: {
    chat: string;
    studyAssistant: string;
    imageGeneration: string;
    voice: string;
  };
  capabilities: string[];
}
