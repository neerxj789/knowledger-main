import { AppLanguage } from '../types';

export interface Translations {
  appName: string;
  notes: string;
  recentNotes: string;
  scrapbook: string;
  library: string;
  research: string;
  researchBrowser: string;
  newNote: string;
  search: string;
  searchWikipedia: string;
  settings: string;
  languages: string;
  account: string;
  onboarding: string;
  archive: string;
  archivedNotes: string;
  restore: string;
  delete: string;
  confirmDelete: string;
  cancel: string;
  copy: string;
  cut: string;
  save: string;
  highlight: string;
  turnIntoNote: string;
  darkMode: string;
  lightMode: string;
  selectedCount: string;
  deselectAll: string;
  addTag: string;
  exportNotes: string;
  profile: string;
  statistics: string;
  noNotes: string;
  welcomeTitle: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appName: 'Knowledger',
    notes: 'Notes',
    recentNotes: 'Recent notes',
    scrapbook: 'Scrapbook',
    library: 'Library',
    research: 'Research',
    researchBrowser: 'Research Browser',
    newNote: 'New note',
    search: 'Search notes…',
    searchWikipedia: 'Search Wikipedia…',
    settings: 'Settings',
    languages: 'Language',
    account: 'Account',
    onboarding: 'Quick Tour',
    archive: 'Archive',
    archivedNotes: 'Archived notes',
    restore: 'Restore',
    delete: 'Delete',
    confirmDelete: 'Confirm delete',
    cancel: 'Cancel',
    copy: 'Copy',
    cut: 'Cut',
    save: 'Save',
    highlight: 'Highlight',
    turnIntoNote: 'Turn into note',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    selectedCount: 'selected',
    deselectAll: 'Deselect all',
    addTag: 'Add tag',
    exportNotes: 'Export notes',
    profile: 'Scholar Profile',
    statistics: 'Reading & Note Statistics',
    noNotes: 'No notes found.',
    welcomeTitle: 'Welcome to Knowledger'
  },
  es: {
    appName: 'Knowledger',
    notes: 'Notas',
    recentNotes: 'Notas recientes',
    scrapbook: 'Cuaderno',
    library: 'Biblioteca',
    research: 'Investigación',
    researchBrowser: 'Navegador de investigación',
    newNote: 'Nueva nota',
    search: 'Buscar notas…',
    searchWikipedia: 'Buscar en Wikipedia…',
    settings: 'Configuración',
    languages: 'Idioma',
    account: 'Cuenta',
    onboarding: 'Guía rápida',
    archive: 'Archivar',
    archivedNotes: 'Notas archivadas',
    restore: 'Restaurar',
    delete: 'Eliminar',
    confirmDelete: 'Confirmar eliminación',
    cancel: 'Cancelar',
    copy: 'Copiar',
    cut: 'Cortar',
    save: 'Guardar',
    highlight: 'Resaltar',
    turnIntoNote: 'Convertir en nota',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    selectedCount: 'seleccionadas',
    deselectAll: 'Deseleccionar todo',
    addTag: 'Añadir etiqueta',
    exportNotes: 'Exportar notas',
    profile: 'Perfil de investigador',
    statistics: 'Estadísticas de lectura',
    noNotes: 'No se encontraron notas.',
    welcomeTitle: 'Bienvenido a Knowledger'
  },
  fr: {
    appName: 'Knowledger',
    notes: 'Notes',
    recentNotes: 'Notes récentes',
    scrapbook: 'Cahier de notes',
    library: 'Bibliothèque',
    research: 'Recherche',
    researchBrowser: 'Navigateur de recherche',
    newNote: 'Nouvelle note',
    search: 'Rechercher des notes…',
    searchWikipedia: 'Rechercher sur Wikipédia…',
    settings: 'Paramètres',
    languages: 'Langue',
    account: 'Compte',
    onboarding: 'Visite guidée',
    archive: 'Archiver',
    archivedNotes: 'Notes archivées',
    restore: 'Restaurer',
    delete: 'Supprimer',
    confirmDelete: 'Confirmer la suppression',
    cancel: 'Annuler',
    copy: 'Copier',
    cut: 'Couper',
    save: 'Enregistrer',
    highlight: 'Surligner',
    turnIntoNote: 'Transformer en note',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    selectedCount: 'sélectionné(s)',
    deselectAll: 'Tout désélectionner',
    addTag: 'Ajouter une étiquette',
    exportNotes: 'Exporter les notes',
    profile: 'Profil de recherche',
    statistics: 'Statistiques de lecture',
    noNotes: 'Aucune note trouvée.',
    welcomeTitle: 'Bienvenue sur Knowledger'
  },
  de: {
    appName: 'Knowledger',
    notes: 'Notizen',
    recentNotes: 'Aktuelle Notizen',
    scrapbook: 'Sammelbuch',
    library: 'Bibliothek',
    research: 'Recherche',
    researchBrowser: 'Recherche-Browser',
    newNote: 'Neue Notiz',
    search: 'Notizen suchen…',
    searchWikipedia: 'Wikipedia durchsuchen…',
    settings: 'Einstellungen',
    languages: 'Sprache',
    account: 'Konto',
    onboarding: 'Einführung',
    archive: 'Archivieren',
    archivedNotes: 'Archivierte Notizen',
    restore: 'Wiederherstellen',
    delete: 'Löschen',
    confirmDelete: 'Löschen bestätigen',
    cancel: 'Abbrechen',
    copy: 'Kopieren',
    cut: 'Ausschneiden',
    save: 'Speichern',
    highlight: 'Hervorheben',
    turnIntoNote: 'In Notiz umwandeln',
    darkMode: 'Dunkelmodus',
    lightMode: 'Hellmodus',
    selectedCount: 'ausgewählt',
    deselectAll: 'Auswahl aufheben',
    addTag: 'Tag hinzufügen',
    exportNotes: 'Notizen exportieren',
    profile: 'Gelehrtenprofil',
    statistics: 'Lese- & Notizstatistiken',
    noNotes: 'Keine Notizen gefunden.',
    welcomeTitle: 'Willkommen bei Knowledger'
  },
  it: {
    appName: 'Knowledger',
    notes: 'Note',
    recentNotes: 'Note recenti',
    scrapbook: 'Zibaldone',
    library: 'Biblioteca',
    research: 'Ricerca',
    researchBrowser: 'Browser di ricerca',
    newNote: 'Nuova nota',
    search: 'Cerca note…',
    searchWikipedia: 'Cerca su Wikipedia…',
    settings: 'Impostazioni',
    languages: 'Lingua',
    account: 'Account',
    onboarding: 'Guida rapida',
    archive: 'Archivia',
    archivedNotes: 'Note archiviate',
    restore: 'Ripristina',
    delete: 'Elimina',
    confirmDelete: 'Conferma eliminazione',
    cancel: 'Annulla',
    copy: 'Copia',
    cut: 'Taglia',
    save: 'Salva',
    highlight: 'Evidenzia',
    turnIntoNote: 'Converti in nota',
    darkMode: 'Modalità scura',
    lightMode: 'Modalità chiara',
    selectedCount: 'selezionati',
    deselectAll: 'Deseleziona tutto',
    addTag: 'Aggiungi tag',
    exportNotes: 'Esporta note',
    profile: 'Profilo accademico',
    statistics: 'Statistiche di lettura',
    noNotes: 'Nessuna nota trovata.',
    welcomeTitle: 'Benvenuto in Knowledger'
  },
  ja: {
    appName: 'Knowledger',
    notes: 'ノート',
    recentNotes: '最近のノート',
    scrapbook: 'スクラップブック',
    library: 'ライブラリ',
    research: '調査',
    researchBrowser: 'リサーチブラウザ',
    newNote: '新規ノート',
    search: 'ノートを検索…',
    searchWikipedia: 'Wikipediaを検索…',
    settings: '設定',
    languages: '言語',
    account: 'アカウント',
    onboarding: 'クイックツアー',
    archive: 'アーカイブ',
    archivedNotes: 'アーカイブ済みノート',
    restore: '復元',
    delete: '削除',
    confirmDelete: '削除を確認',
    cancel: 'キャンセル',
    copy: 'コピー',
    cut: '切り取り',
    save: '保存',
    highlight: 'ハイライト',
    turnIntoNote: 'ノートに変換',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    selectedCount: '件選択中',
    deselectAll: '選択解除',
    addTag: 'タグ追加',
    exportNotes: 'ノートのエクスポート',
    profile: '研究者プロフィール',
    statistics: '読書・ノート統計',
    noNotes: 'ノートが見つかりません。',
    welcomeTitle: 'Knowledgerへようこそ'
  }
};

export const LANGUAGE_OPTIONS: { code: AppLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'ja', label: 'Japanese', native: '日本語' }
];
