export interface ScrapItem {
  id: number;
  type: 'highlight' | 'evidence';
  text: string;
  at: number;
  rev: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
}

export type NoteType = 'Claim' | 'Summary' | 'Question' | 'Interpretation' | 'Idea' | 'Reference';

export interface Note {
  id: number;
  title: string;
  type: NoteType;
  tags: string[];
  body: string;
  q?: number[];
  ev?: ScrapItem[];
  archived?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  paras: string[];
  snippet?: string;
}

export interface SelectionState {
  text: string;
  x: number;
  y: number;
}

export interface ToastState {
  msg: string;
  undo?: () => void;
  openS?: () => void;
}

export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja';

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  joinedDate: string;
}
