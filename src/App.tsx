import React, { useState, useEffect, useRef } from 'react';
import { Note, ScrapItem, SelectionState, ToastState, Article, AppLanguage, UserProfile } from './types';
import { DEFAULT_ARTICLE, NOTES0, SCRAP0 } from './data/initialData';
import { TRANSLATIONS } from './i18n/translations';
import { Icon } from './components/Icon';
import { Scrapbook } from './components/Scrapbook';
import { NoteView } from './components/NoteView';
import { ResearchBrowser } from './components/ResearchBrowser';
import { OnboardingModal } from './components/OnboardingModal';
import { AccountView } from './components/AccountView';
import { SettingsModal } from './components/SettingsModal';
import { BulkActionBar } from './components/BulkActionBar';

const useWide = () => {
  const q = '(min-width: 1024px)';
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.matchMedia(q).matches : true
  );
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setW(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return w;
};

export default function App() {
  const wide = useWide();

  // App Language
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      return (localStorage.getItem('knowledger_lang') as AppLanguage) || 'en';
    } catch {
      return 'en';
    }
  });
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Font size preference
  const [fontSize, setFontSize] = useState<'standard' | 'comfort' | 'large'>(() => {
    try {
      return (localStorage.getItem('knowledger_font_size') as 'standard' | 'comfort' | 'large') || 'standard';
    } catch {
      return 'standard';
    }
  });

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('knowledger_profile');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Fellow Scholar',
            email: 'scholar@commonplace.org',
            title: 'Knowledge Synthesizer',
            joinedDate: 'November 2026'
          };
    } catch {
      return {
        name: 'Fellow Scholar',
        email: 'scholar@commonplace.org',
        title: 'Knowledge Synthesizer',
        joinedDate: 'November 2026'
      };
    }
  });

  // "no mock data except one welcom note"
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('knowledger_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return NOTES0;
    } catch {
      return NOTES0;
    }
  });

  const [scrap, setScrap] = useState<ScrapItem[]>(() => {
    try {
      const saved = localStorage.getItem('knowledger_scrap');
      return saved ? JSON.parse(saved) : SCRAP0;
    } catch {
      return SCRAP0;
    }
  });

  const [nid, setNid] = useState<number>(() => notes[0]?.id || 1);

  // Views & navigation
  const [view, setView] = useState<'note' | 'scrap' | 'account' | 'archive'>('note');
  const [screen, setScreen] = useState<'home' | 'library' | 'scrapbook' | 'editor' | 'account' | 'archive'>('home');
  const [list, setList] = useState(false);
  const [panelWidth, setPanelWidth] = useState(480);
  const [openResearch, setOpenResearch] = useState(true);
  const [mobileDrawer, setMobileDrawer] = useState<'closed' | 'peek' | 'half' | 'full'>('closed');
  const [sel, setSel] = useState<SelectionState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('knowledger_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // Wikipedia Articles
  const [currentArticle, setCurrentArticle] = useState<Article>(DEFAULT_ARTICLE);

  // Search & Filter
  const [noteSearch, setNoteSearch] = useState('');
  const [showNoteSearch, setShowNoteSearch] = useState(false);

  // Multi-Select (Hold & Select)
  const [selectedNoteIds, setSelectedNoteIds] = useState<number[]>([]);
  const isSelectMode = selectedNoteIds.length > 0;
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & Drawers
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // First-time onboarding check
  useEffect(() => {
    try {
      const done = localStorage.getItem('knowledger_onboarding_done');
      if (!done) {
        setIsOnboardingOpen(true);
        localStorage.setItem('knowledger_onboarding_done', 'true');
      }
    } catch {}
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('knowledger_theme', theme);
    } catch {}
  }, [theme]);

  // Sync font size
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'comfort') {
      root.style.fontSize = '17px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18.5px';
    } else {
      root.style.fontSize = '15px';
    }
    try {
      localStorage.setItem('knowledger_font_size', fontSize);
    } catch {}
  }, [fontSize]);

  // Sync language
  useEffect(() => {
    try {
      localStorage.setItem('knowledger_lang', language);
    } catch {}
  }, [language]);

  // Sync profile
  useEffect(() => {
    try {
      localStorage.setItem('knowledger_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  // Sync notes
  useEffect(() => {
    try {
      localStorage.setItem('knowledger_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  // Sync scrap
  useEffect(() => {
    try {
      localStorage.setItem('knowledger_scrap', JSON.stringify(scrap));
    } catch {}
  }, [scrap]);

  // Toast feedback
  const say = (msg: string, undo?: () => void, openS?: () => void) => {
    setToast({ msg, undo, openS });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4800);
  };

  // Active note
  const visibleNotes = notes.filter((n) => view === 'archive' ? !!n.archived : !n.archived);
  const activeNote = notes.find((n) => n.id === nid) || visibleNotes[0];

  const editNote = (partial: Partial<Note>) => {
    if (!activeNote) return;
    setNotes((ns) =>
      ns.map((n) =>
        n.id === activeNote.id
          ? { ...n, ...partial, updatedAt: Date.now() }
          : n
      )
    );
  };

  // CRUD: Create new note
  const createNewNote = (initial?: Partial<Note>) => {
    const newNote: Note = {
      id: Date.now(),
      title: initial?.title || 'Untitled note',
      type: initial?.type || 'Claim',
      tags: initial?.tags || [],
      body: initial?.body || '',
      q: [],
      ev: initial?.ev || [],
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((prev) => [newNote, ...prev]);
    setNid(newNote.id);
    setView('note');
    if (!wide) {
      setScreen('editor');
    }
    say(t.newNote + ' created', () => {
      setNotes((prev) => prev.filter((n) => n.id !== newNote.id));
    });
  };

  // CRUD: Delete note
  const deleteNote = (id: number) => {
    const noteToDelete = notes.find((n) => n.id === id);
    if (!noteToDelete) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (nid === id) {
      const remaining = notes.filter((n) => n.id !== id && !n.archived);
      if (remaining.length > 0) {
        setNid(remaining[0].id);
      }
    }
    say(`Note "${noteToDelete.title}" deleted`, () => {
      setNotes((prev) => [noteToDelete, ...prev]);
      setNid(noteToDelete.id);
    });
  };

  // CRUD: Archive / Restore note
  const toggleArchiveNote = (id: number) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const willArchive = !target.archived;
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: willArchive } : n))
    );
    say(willArchive ? 'Note moved to Archive' : 'Note restored to notebook', () => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, archived: !willArchive } : n))
      );
    });
  };

  // CRUD: Duplicate note
  const duplicateNote = (noteToDup: Note) => {
    const dup: Note = {
      ...noteToDup,
      id: Date.now(),
      title: `${noteToDup.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((prev) => [dup, ...prev]);
    setNid(dup.id);
    say('Note duplicated');
  };

  // Multi-select / Hold handlers
  const handlePointerDown = (id: number) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      // Trigger hold selection
      setSelectedNoteIds((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
      say('Multi-select active');
    }, 450);
  };

  const handlePointerUpOrLeave = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleNoteCardClick = (id: number) => {
    if (isSelectMode) {
      setSelectedNoteIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setNid(id);
      setView('note');
      if (!wide) setScreen('editor');
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    const count = selectedNoteIds.length;
    const deleted = notes.filter((n) => selectedNoteIds.includes(n.id));
    setNotes((prev) => prev.filter((n) => !selectedNoteIds.includes(n.id)));
    setSelectedNoteIds([]);
    say(`${count} note(s) deleted`, () => {
      setNotes((prev) => [...deleted, ...prev]);
    });
  };

  const handleBulkArchive = () => {
    const willRestore = view === 'archive';
    const count = selectedNoteIds.length;
    setNotes((prev) =>
      prev.map((n) =>
        selectedNoteIds.includes(n.id) ? { ...n, archived: !willRestore } : n
      )
    );
    setSelectedNoteIds([]);
    say(willRestore ? `${count} note(s) restored` : `${count} note(s) archived`);
  };

  const handleBulkAddTag = (tag: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (selectedNoteIds.includes(n.id)) {
          return {
            ...n,
            tags: n.tags.includes(tag) ? n.tags : [...n.tags, tag]
          };
        }
        return n;
      })
    );
    setSelectedNoteIds([]);
    say(`Tag #${tag} added to selected notes`);
  };

  const handleBulkExport = () => {
    const exportData = notes.filter((n) => selectedNoteIds.includes(n.id));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledger-selection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    say('Exported selected notes');
  };

  // Export all notes as JSON
  const handleExportJSON = () => {
    const data = {
      profile: userProfile,
      notes,
      scrap,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledger-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    say('Notebook backup exported as JSON');
  };

  // Export notes as Markdown
  const handleExportMarkdown = () => {
    let md = `# Knowledger Commonplace Book\n*Exported by ${userProfile.name} on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    notes.forEach((n) => {
      md += `## ${n.title}\n`;
      md += `**Type:** ${n.type} | **Tags:** ${n.tags.map((t) => `#${t}`).join(' ')}\n\n`;
      md += `${n.body}\n\n`;
      if (n.ev && n.ev.length > 0) {
        md += `### Evidence & Quotes\n`;
        n.ev.forEach((e) => {
          md += `> "${e.text}"\n> — *${e.sourceTitle || 'Wikipedia'}*\n\n`;
        });
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledger-notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    say('Notebook exported as Markdown');
  };

  // Clear data
  const handleClearData = () => {
    setNotes(NOTES0);
    setScrap([]);
    setNid(NOTES0[0].id);
    setView('note');
    say('Notebook reset to initial welcome note');
  };

  // Save selected text from reader
  const save = (type: 'highlight' | 'evidence') => {
    if (!sel) return;
    const it: ScrapItem = {
      id: Date.now(),
      type,
      text: sel.text,
      at: Date.now(),
      rev: false,
      sourceTitle: currentArticle.title,
      sourceUrl: currentArticle.url
    };
    setScrap((s) => [it, ...s]);
    window.getSelection()?.removeAllRanges();
    setSel(null);
    say(
      type === 'highlight' ? 'Highlighted and saved' : 'Saved to Scrapbook',
      () => setScrap((s) => s.filter((x) => x.id !== it.id)),
      () => {
        if (wide) setView('scrap');
        else {
          setMobileDrawer('closed');
          setScreen('editor');
          setView('scrap');
        }
      }
    );
  };

  // Turn scrap into note
  const toNote = (i: ScrapItem) => {
    const title = i.text.split(' ').slice(0, 6).join(' ') + '…';
    const n: Note = {
      id: Date.now(),
      title,
      type: 'Claim',
      tags: [],
      body: '',
      q: [],
      ev: [i],
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((ns) => [n, ...ns]);
    setScrap((s) => s.map((x) => (x.id === i.id ? { ...x, rev: true } : x)));
    setNid(n.id);
    setView('note');
    if (!wide) setScreen('editor');
    say('Note created from Scrapbook item');
  };

  // Selection toolbar actions
  const act = {
    copy: () => {
      if (!sel) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(sel.text).catch(() => {});
      }
      setSel(null);
      say('Copied to clipboard');
    },
    cut: () => {
      if (!sel) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(sel.text).catch(() => {});
      }
      setSel(null);
      say('Cut copied. Source text stays in the reader.');
    },
    tr: () => {
      setSel(null);
      say('Translation saved to note scratchpad');
    },
    more: () => {
      setSel(null);
      say('Selection actions: Save, Copy, Cut, Highlight available');
    }
  };

  // Resize grip for desktop
  const handleGripMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (ev: MouseEvent) => {
      setPanelWidth(
        Math.min(
          Math.max(window.innerWidth - ev.clientX, 320),
          window.innerWidth * 0.52
        )
      );
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Filter notes
  const filteredNotes = visibleNotes.filter((n) => {
    if (!noteSearch.trim()) return true;
    const term = noteSearch.toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.body.toLowerCase().includes(term) ||
      n.tags.some((tg) => tg.toLowerCase().includes(term)) ||
      n.type.toLowerCase().includes(term)
    );
  });

  // Render Selection Toolbar
  const renderSelectionToolbar = () => {
    if (!sel) return null;
    return (
      <div
        className="seltb"
        style={{ left: sel.x, top: sel.y }}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <button type="button" onClick={() => save('evidence')}>
          <Icon name="bookmark" size={14} />
          <span>Save</span>
        </button>
        <button type="button" onClick={act.copy}>
          <Icon name="copy" size={14} />
          <span>Copy</span>
        </button>
        <button type="button" onClick={act.cut}>
          <Icon name="scissors" size={14} />
          <span>Cut</span>
        </button>
        <div className="sep" />
        <button type="button" onClick={() => save('highlight')}>
          <Icon name="highlighter" size={14} />
          <span>Highlight</span>
        </button>
        <button type="button" onClick={act.tr}>
          <Icon name="languages" size={14} />
          <span>Translate</span>
        </button>
        <button type="button" onClick={act.more} aria-label="More">
          <Icon name="more-horizontal" size={14} />
        </button>
      </div>
    );
  };

  // Render Toast
  const renderToast = () => {
    if (!toast) return null;
    return (
      <div className="toast" role="status">
        <span>{toast.msg}</span>
        {toast.openS && (
          <button
            type="button"
            onClick={() => {
              toast.openS?.();
              setToast(null);
            }}
          >
            Open
          </button>
        )}
        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              toast.undo?.();
              setToast(null);
            }}
          >
            Undo
          </button>
        )}
      </div>
    );
  };

  // Segmented control (Note / Scrapbook)
  const renderSeg = () => (
    <div className="seg">
      {(['note', 'scrap'] as const).map((k) => (
        <button
          key={k}
          type="button"
          className={view === k ? 'on' : ''}
          onClick={() => setView(k)}
        >
          {k === 'note' ? t.notes : t.scrapbook}
        </button>
      ))}
    </div>
  );

  // Hamburger Drawer Component
  const renderHamburgerMenu = () => {
    if (!isHamburgerOpen) return null;
    return (
      <div
        className="modal-overlay"
        style={{ justifyContent: 'flex-start', padding: 0 }}
        onClick={() => setIsHamburgerOpen(false)}
      >
        <div
          style={{
            width: 290,
            height: '100%',
            background: 'var(--surface)',
            borderRight: '1px solid var(--line)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            animation: 'slideInLeft 0.2s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="brand" style={{ padding: 0 }}>
              <div className="mark">K</div>
              <span>Knowledger</span>
            </div>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setIsHamburgerOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          {/* Quick Profile Summary */}
          <div
            className="card cursor-pointer"
            style={{ marginBottom: 16, padding: '10px 12px' }}
            onClick={() => {
              setView('account');
              setScreen('account');
              setIsHamburgerOpen(false);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontFamily: 'var(--serif)'
                }}
              >
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userProfile.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mute)' }}>View Account & Stats</div>
              </div>
              <Icon name="chevron-right" size={14} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflowY: 'auto' }}>
            <button
              type="button"
              className={`nav ${view === 'note' && screen !== 'account' && screen !== 'archive' ? 'on' : ''}`}
              onClick={() => {
                setView('note');
                setScreen('home');
                setIsHamburgerOpen(false);
              }}
            >
              <Icon name="file-text" size={17} />
              <span>{t.notes}</span>
            </button>

            <button
              type="button"
              className={`nav ${view === 'scrap' ? 'on' : ''}`}
              onClick={() => {
                setView('scrap');
                setScreen('scrapbook');
                setIsHamburgerOpen(false);
              }}
            >
              <Icon name="bookmark" size={17} />
              <span>{t.scrapbook}</span>
              {scrap.length > 0 && <span className="count">{scrap.length}</span>}
            </button>

            <button
              type="button"
              className={`nav ${view === 'archive' ? 'on' : ''}`}
              onClick={() => {
                setView('archive');
                setScreen('archive');
                setIsHamburgerOpen(false);
              }}
            >
              <Icon name="archive" size={17} />
              <span>{t.archivedNotes}</span>
            </button>

            <button
              type="button"
              className="nav"
              onClick={() => {
                if (wide) setOpenResearch(true);
                else setMobileDrawer('half');
                setIsHamburgerOpen(false);
              }}
            >
              <Icon name="compass" size={17} />
              <span>{t.researchBrowser}</span>
            </button>

            <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }} />

            <button
              type="button"
              className="nav"
              onClick={() => {
                setIsHamburgerOpen(false);
                setIsSettingsOpen(true);
              }}
            >
              <Icon name="settings" size={17} />
              <span>{t.settings}</span>
            </button>

            <button
              type="button"
              className="nav"
              onClick={() => {
                setIsHamburgerOpen(false);
                setIsSettingsOpen(true);
              }}
            >
              <Icon name="globe" size={17} />
              <span>{t.languages}</span>
            </button>

            <button
              type="button"
              className="nav"
              onClick={() => {
                setIsHamburgerOpen(false);
                setIsOnboardingOpen(true);
              }}
            >
              <Icon name="sparkles" size={17} />
              <span>{t.onboarding}</span>
            </button>
          </div>

          {/* Theme switcher */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <button
              type="button"
              className="nav"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
              <span>{theme === 'light' ? t.darkMode : t.lightMode}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Floating Action Button ("the plus/new button should be floating in place of scrapbook")
  const renderFloatingNewButton = () => (
    <button
      type="button"
      className="pill"
      onClick={() => createNewNote()}
      title="Create new note"
      aria-label="New Note"
    >
      <Icon name="plus" size={18} />
      <span>{t.newNote}</span>
    </button>
  );

  // DESKTOP LAYOUT
  if (wide) {
    const navItems = [
      { name: t.notes, icon: 'file-text', act: () => setView('note') },
      { name: t.scrapbook, icon: 'bookmark', count: scrap.length, act: () => setView('scrap') },
      { name: t.archivedNotes, icon: 'archive', act: () => setView('archive') },
      { name: t.account, icon: 'user', act: () => setView('account') },
      { name: t.settings, icon: 'settings', act: () => setIsSettingsOpen(true) },
      { name: t.onboarding, icon: 'sparkles', act: () => setIsOnboardingOpen(true) }
    ];

    return (
      <div className="desk">
        {/* Sidebar */}
        <aside className="side">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
            <div className="brand" style={{ padding: '4px 0 18px' }}>
              <div className="mark">K</div>
              <span>{t.appName}</span>
            </div>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setIsHamburgerOpen(true)}
              title="More options"
              aria-label="Menu"
              style={{ padding: '4px 6px' }}
            >
              <Icon name="menu" size={18} />
            </button>
          </div>

          {navItems.map((item) => {
            const isSelected =
              (item.name === t.notes && view === 'note') ||
              (item.name === t.scrapbook && view === 'scrap') ||
              (item.name === t.archivedNotes && view === 'archive') ||
              (item.name === t.account && view === 'account');

            return (
              <button
                key={item.name}
                type="button"
                className={`nav ${isSelected ? 'on' : ''}`}
                onClick={item.act}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.name}</span>
                {item.count != null && item.count > 0 && (
                  <span className="count">{item.count}</span>
                )}
              </button>
            );
          })}

          {/* Recent Notes Header with Quick Add & Search */}
          <div className="side-header">
            <h3>{view === 'archive' ? t.archivedNotes : t.recentNotes}</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setShowNoteSearch(!showNoteSearch)}
                title="Search notes"
                aria-label="Search notes"
                style={{ padding: '3px 6px' }}
              >
                <Icon name="search" size={13} />
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => createNewNote()}
                title="Create new note"
                style={{ padding: '3px 6px' }}
              >
                <Icon name="plus" size={13} />
              </button>
            </div>
          </div>

          {/* Search Input in Sidebar */}
          {showNoteSearch && (
            <div style={{ padding: '4px 8px 8px' }}>
              <input
                type="text"
                placeholder={t.search}
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 10px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid var(--line-strong)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Notes list with hold-to-select support */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredNotes.length === 0 ? (
              <div style={{ padding: '16px 12px', fontSize: 13, color: 'var(--mute)', textAlign: 'center' }}>
                {t.noNotes}
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = selectedNoteIds.includes(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onPointerDown={() => handlePointerDown(n.id)}
                    onPointerUp={handlePointerUpOrLeave}
                    onPointerLeave={handlePointerUpOrLeave}
                    className={`note-item ${
                      isSelected
                        ? 'on ring-1 ring-amber-600'
                        : n.id === activeNote?.id && view === 'note'
                        ? 'on'
                        : ''
                    }`}
                    onClick={() => handleNoteCardClick(n.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      {isSelectMode ? (
                        <span style={{ color: isSelected ? 'var(--accent)' : 'var(--mute)' }}>
                          <Icon name={isSelected ? 'check-square' : 'square'} size={15} />
                        </span>
                      ) : (
                        <Icon name="file-text" size={14} />
                      )}
                      <span>{n.title || 'Untitled note'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Theme switcher */}
          <div className="theme-btn">
            <button
              type="button"
              className="nav"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
              <span>{theme === 'light' ? t.darkMode : t.lightMode}</span>
            </button>
          </div>
        </aside>

        {/* Main Document / Workspace Area */}
        <main className="main">
          {/* Main Navbar ("main nachar should have research browser as well") */}
          <div className="bar">
            {renderSeg()}

            <span className="sp" />

            {/* Research Browser Header Trigger */}
            <button
              type="button"
              className={`btn ${openResearch ? 'ghost' : 'pri'}`}
              onClick={() => setOpenResearch(!openResearch)}
              title="Open Wikipedia Research Browser"
            >
              <Icon name="compass" size={15} />
              <span>{t.researchBrowser}</span>
            </button>

            <button
              type="button"
              className="btn ghost"
              onClick={() => setIsHamburgerOpen(true)}
              aria-label="Menu"
              style={{ padding: '6px 8px' }}
            >
              <Icon name="menu" size={17} />
            </button>
          </div>

          <div className="doc">
            {view === 'account' ? (
              <AccountView
                userProfile={userProfile}
                onUpdateProfile={(p) => setUserProfile((prev) => ({ ...prev, ...p }))}
                notes={notes}
                scrap={scrap}
                language={language}
                onSelectLanguage={setLanguage}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onExportNotes={handleExportJSON}
                onExportMarkdown={handleExportMarkdown}
                onClearData={handleClearData}
              />
            ) : view === 'scrap' ? (
              <div className="page">
                <h2 style={{ marginBottom: 20, fontSize: 26 }}>{t.scrapbook}</h2>
                <Scrapbook
                  scrap={scrap}
                  toNote={toNote}
                  onDeleteScrap={(id) => setScrap((prev) => prev.filter((s) => s.id !== id))}
                  onToggleReview={(id) =>
                    setScrap((prev) =>
                      prev.map((s) => (s.id === id ? { ...s, rev: !s.rev } : s))
                    )
                  }
                />
              </div>
            ) : activeNote ? (
              <NoteView
                note={activeNote}
                edit={editNote}
                onDeleteNote={deleteNote}
                onArchiveNote={toggleArchiveNote}
                onDuplicateNote={duplicateNote}
              />
            ) : (
              <div className="page empty">
                <Icon name="file-text" size={36} />
                <div style={{ marginTop: 14 }}>{t.noNotes}</div>
                <button
                  type="button"
                  className="btn pri"
                  style={{ marginTop: 12 }}
                  onClick={() => createNewNote()}
                >
                  <Icon name="plus" size={14} />
                  <span>{t.newNote}</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right Research Sidebar with live Wikipedia API and Chevron history */}
        {openResearch && (
          <aside className="research" style={{ width: panelWidth }}>
            <div className="grip" onMouseDown={handleGripMouseDown} />
            <ResearchBrowser
              currentArticle={currentArticle}
              onSelectArticle={setCurrentArticle}
              scrap={scrap}
              onSel={setSel}
              onClose={() => setOpenResearch(false)}
            />
          </aside>
        )}

        {/* Floating Action Button */}
        {renderFloatingNewButton()}

        {/* Multi-Select Floating Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedNoteIds.length}
          isArchivedView={view === 'archive'}
          onDelete={handleBulkDelete}
          onArchive={handleBulkArchive}
          onAddTag={handleBulkAddTag}
          onExport={handleBulkExport}
          onDeselectAll={() => setSelectedNoteIds([])}
        />

        {/* Modals & Toolbars */}
        {renderHamburgerMenu()}
        {renderSelectionToolbar()}
        {renderToast()}

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          userProfile={userProfile}
          onUpdateProfile={(p) => setUserProfile((prev) => ({ ...prev, ...p }))}
          language={language}
          onSelectLanguage={setLanguage}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          language={language}
          onSelectLanguage={setLanguage}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          fontSize={fontSize}
          onSelectFontSize={setFontSize}
        />
      </div>
    );
  }

  // MOBILE LAYOUT
  const ht = { closed: 0, peek: 96, half: '55%', full: '92%' }[mobileDrawer];

  const renderMobileHome = () => (
    <div className="mob">
      {/* Mobile Top Bar with Research Browser button and Hamburger menu */}
      <div className="mtop">
        <button
          type="button"
          className="btn ghost"
          onClick={() => setIsHamburgerOpen(true)}
          aria-label="Open menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <h1>
          {screen === 'home'
            ? t.notes
            : screen === 'library'
            ? t.library
            : screen === 'account'
            ? t.account
            : t.scrapbook}
        </h1>

        {screen === 'home' && (
          <button
            type="button"
            className="btn"
            onClick={() => setList(!list)}
            aria-label="Toggle view"
          >
            <Icon name={list ? 'layout-grid' : 'list'} size={15} />
          </button>
        )}

        {/* Main Header Research Browser */}
        <button
          type="button"
          className="btn pri"
          onClick={() => setMobileDrawer('half')}
          title="Open Research Browser"
        >
          <Icon name="compass" size={15} />
          <span>{t.research}</span>
        </button>
      </div>

      <div className="mscroll">
        {screen === 'home' && (
          <div className={list ? 'listv' : 'masonry'}>
            {filteredNotes.map((n) => {
              const isSelected = selectedNoteIds.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onPointerDown={() => handlePointerDown(n.id)}
                  onPointerUp={handlePointerUpOrLeave}
                  onPointerLeave={handlePointerUpOrLeave}
                  onClick={() => handleNoteCardClick(n.id)}
                  className={`card ${isSelected ? 'ring-2 ring-amber-600' : ''}`}
                  style={{ position: 'relative' }}
                >
                  {isSelectMode && (
                    <div style={{ position: 'absolute', top: 10, right: 10, color: isSelected ? 'var(--accent)' : 'var(--mute)' }}>
                      <Icon name={isSelected ? 'check-square' : 'square'} size={18} />
                    </div>
                  )}
                  <h3>{n.title || 'Untitled note'}</h3>
                  <p>{n.body}</p>
                  <div className="meta" style={{ margin: '10px 0 0' }}>
                    <span className="chip">{n.type}</span>
                    {n.tags.slice(0, 2).map((tg) => (
                      <span className="chip" key={tg}>#{tg}</span>
                    ))}
                    {(n.ev?.length || 0) > 0 && (
                      <span className="chip">{n.ev?.length} quotes</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {screen === 'scrapbook' && (
          <Scrapbook
            scrap={scrap}
            toNote={toNote}
            onDeleteScrap={(id) => setScrap((prev) => prev.filter((s) => s.id !== id))}
            onToggleReview={(id) =>
              setScrap((prev) =>
                prev.map((s) => (s.id === id ? { ...s, rev: !s.rev } : s))
              )
            }
          />
        )}

        {screen === 'account' && (
          <AccountView
            userProfile={userProfile}
            onUpdateProfile={(p) => setUserProfile((prev) => ({ ...prev, ...p }))}
            notes={notes}
            scrap={scrap}
            language={language}
            onSelectLanguage={setLanguage}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onExportNotes={handleExportJSON}
            onExportMarkdown={handleExportMarkdown}
            onClearData={handleClearData}
          />
        )}

        {screen === 'library' && (
          <div className="card" onClick={() => setMobileDrawer('half')}>
            <h3>{currentArticle.title}</h3>
            <p>Wikipedia · {currentArticle.url}</p>
            <div style={{ marginTop: 12 }}>
              <button type="button" className="btn pri" style={{ width: '100%', justifyContent: 'center' }}>
                <Icon name="compass" size={15} />
                <span>Open in Research Browser</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <nav className="tabs">
        {(
          [
            { k: 'home', l: t.notes, icon: 'file-text' },
            { k: 'library', l: t.library, icon: 'library' },
            { k: 'scrapbook', l: t.scrapbook, icon: 'bookmark' },
            { k: 'account', l: t.account, icon: 'user' }
          ] as const
        ).map(({ k, l, icon }) => (
          <button
            key={k}
            type="button"
            className={screen === k ? 'on' : ''}
            onClick={() => setScreen(k)}
          >
            <Icon name={icon} size={20} />
            <span>{l}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderMobileEditor = () => (
    <div className="mob">
      <div className="mtop">
        <button
          type="button"
          className="btn ghost"
          onClick={() => setScreen('home')}
          aria-label="Back"
        >
          <Icon name="arrow-left" size={18} />
        </button>
        {renderSeg()}
        <span style={{ flex: 1 }} />
        {/* Research browser button in navbar */}
        <button
          type="button"
          className="btn pri"
          onClick={() => setMobileDrawer('half')}
        >
          <Icon name="compass" size={15} />
          <span>{t.research}</span>
        </button>
      </div>

      <div className="mscroll">
        {view === 'note' && activeNote ? (
          <NoteView
            note={activeNote}
            edit={editNote}
            onDeleteNote={(id) => {
              deleteNote(id);
              setScreen('home');
            }}
            onArchiveNote={toggleArchiveNote}
            onDuplicateNote={duplicateNote}
          />
        ) : (
          <Scrapbook
            scrap={scrap}
            toNote={toNote}
            onDeleteScrap={(id) => setScrap((prev) => prev.filter((s) => s.id !== id))}
            onToggleReview={(id) =>
              setScrap((prev) =>
                prev.map((s) => (s.id === id ? { ...s, rev: !s.rev } : s))
              )
            }
          />
        )}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {screen === 'editor' ? renderMobileEditor() : renderMobileHome()}

      {/* Floating Plus/New button in place of scrapbook */}
      {mobileDrawer === 'closed' && renderFloatingNewButton()}

      {/* Slide-up Research Drawer on mobile */}
      {mobileDrawer !== 'closed' && (
        <div className="drawer" style={{ height: ht }}>
          <div
            className="handle"
            onClick={() =>
              setMobileDrawer(
                mobileDrawer === 'full'
                  ? 'half'
                  : mobileDrawer === 'half'
                  ? 'peek'
                  : 'full'
              )
            }
          />
          <ResearchBrowser
            currentArticle={currentArticle}
            onSelectArticle={setCurrentArticle}
            scrap={scrap}
            onSel={setSel}
            onClose={() => setMobileDrawer('closed')}
            isMobile
          />
        </div>
      )}

      {/* Multi-Select Bulk Action Bar on mobile */}
      <BulkActionBar
        selectedCount={selectedNoteIds.length}
        isArchivedView={screen === 'archive'}
        onDelete={handleBulkDelete}
        onArchive={handleBulkArchive}
        onAddTag={handleBulkAddTag}
        onExport={handleBulkExport}
        onDeselectAll={() => setSelectedNoteIds([])}
      />

      {/* Modals & Toolbars */}
      {renderHamburgerMenu()}
      {renderSelectionToolbar()}
      {renderToast()}

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(p) => setUserProfile((prev) => ({ ...prev, ...p }))}
        language={language}
        onSelectLanguage={setLanguage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onSelectLanguage={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        fontSize={fontSize}
        onSelectFontSize={setFontSize}
      />
    </div>
  );
}
