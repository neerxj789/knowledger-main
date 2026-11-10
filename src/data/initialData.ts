import { Article, Note, ScrapItem } from '../types';

export const DEFAULT_ARTICLE: Article = {
  id: 'commonplace-book',
  title: 'Commonplace book',
  url: 'https://en.wikipedia.org/wiki/Commonplace_book',
  paras: [
    'A commonplace book is a way to compile knowledge, usually by writing information into a notebook. Such books are essentially scrapbooks filled with items of every kind: recipes, quotes, letters, poems, tables of weights and measures, proverbs, prayers and legal formulas.',
    'Commonplaces are used by readers, writers, students and scholars as an aid for remembering useful concepts or facts they have learned. Each one is organised under headings so that an entry can be found again when it is needed.',
    'In early modern Europe, students were taught to keep such books as part of their education. The practice shaped how people read: with a pen in hand, looking for passages worth copying and sorting them by theme.',
    'Writers later adapted the method with indexes and cross-references, so that a single idea could be traced across many entries and many years. The commonplace book became a lifelong companion for thinking on paper.'
  ]
};

export const ARTICLES: Article[] = [DEFAULT_ARTICLE];

// "no mock data except one welcom note"
export const NOTES0: Note[] = [
  {
    id: 1,
    title: 'Welcome to Knowledger',
    type: 'Claim',
    tags: ['getting-started', 'commonplace', 'method'],
    body: 'A commonplace book is a lifelong companion for thinking on paper. When reading articles in the Research Browser, select any phrase or sentence to highlight or save it as evidence. You can then transform your scraps into structured claims, arguments, or questions.\n\nTip: Hold and press any note card in the list to trigger multi-selection, where you can bulk archive, delete, or export entries.',
    q: [],
    ev: [],
    archived: false,
    createdAt: Date.now() - 36e5,
    updatedAt: Date.now()
  }
];

export const SCRAP0: ScrapItem[] = [];

export const NOTE_TYPES: Note['type'][] = [
  'Claim',
  'Summary',
  'Question',
  'Interpretation',
  'Idea',
  'Reference'
];
