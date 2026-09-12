// Chat types

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'command' | 'confirmation' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  language?: string;
  metadata?: {
    commandAction?: string;
    commandStatus?: 'pending' | 'confirmed' | 'rejected' | 'executed';
  };
}

export interface ConversationSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatConfig {
  maxHistoryTurns: number;
  streamingEnabled: boolean;
  language: string;
}
