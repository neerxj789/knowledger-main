import { useState } from 'react';
import { Note, ScrapItem, UserProfile, AppLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../i18n/translations';
import { Icon } from './Icon';

interface AccountViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: Partial<UserProfile>) => void;
  notes: Note[];
  scrap: ScrapItem[];
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onOpenOnboarding: () => void;
  onExportNotes: () => void;
  onExportMarkdown: () => void;
  onClearData: () => void;
}

export function AccountView({
  userProfile,
  onUpdateProfile,
  notes,
  scrap,
  language,
  onSelectLanguage,
  onOpenOnboarding,
  onExportNotes,
  onExportMarkdown,
  onClearData
}: AccountViewProps) {
  const t = TRANSLATIONS[language];
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(userProfile.name);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const activeNotesCount = notes.filter((n) => !n.archived).length;
  const archivedNotesCount = notes.filter((n) => n.archived).length;
  const quotesCount = notes.reduce((acc, n) => acc + (n.ev ? n.ev.length : 0), 0);

  const handleSaveName = () => {
    if (nameVal.trim()) {
      onUpdateProfile({ name: nameVal.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 28, marginBottom: 20 }}>{t.account}</h2>

      {/* Profile Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 20,
          marginBottom: 24
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--serif)',
            fontSize: 24,
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          {userProfile.name.charAt(0).toUpperCase() || 'K'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditingName ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--accent)',
                  background: 'var(--surface)',
                  color: 'var(--ink)'
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
              />
              <button type="button" className="btn pri text-xs" onClick={handleSaveName}>
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>{userProfile.name}</h3>
              <button
                type="button"
                className="btn ghost text-xs"
                onClick={() => setIsEditingName(true)}
                title="Edit name"
                style={{ padding: '2px 6px', color: 'var(--mute)' }}
              >
                <Icon name="edit" size={13} />
              </button>
            </div>
          )}
          <div style={{ fontSize: 13, color: 'var(--mute)', marginTop: 2 }}>
            {userProfile.email} · {userProfile.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>
            Member since {userProfile.joinedDate}
          </div>
        </div>
      </div>

      {/* Reading & Commonplace Statistics */}
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.statistics}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 28
        }}
      >
        <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--serif)', color: 'var(--accent)' }}>
            {activeNotesCount}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Active Notes</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--serif)' }}>
            {scrap.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Highlights Saved</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--serif)' }}>
            {quotesCount}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Evidence Linked</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--serif)', color: 'var(--mute)' }}>
            {archivedNotesCount}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Archived</div>
        </div>
      </div>

      {/* Language Preferences */}
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.languages}</h3>
      <div className="card" style={{ marginBottom: 28, padding: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 12 }}>
          Choose your interface language:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              className={`btn ${language === opt.code ? 'pri' : 'ghost'}`}
              onClick={() => onSelectLanguage(opt.code)}
              style={{ justifyContent: 'center', fontSize: 13 }}
            >
              {opt.native}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management & Export */}
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Notebook Data & Export</h3>
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Export as JSON</div>
            <div style={{ fontSize: 12, color: 'var(--mute)' }}>Complete backup of all notes, tags, and citations.</div>
          </div>
          <button type="button" className="btn" onClick={onExportNotes}>
            <Icon name="download" size={14} />
            <span>Export JSON</span>
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--line)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Export as Markdown</div>
            <div style={{ fontSize: 12, color: 'var(--mute)' }}>Readable markdown for Obsidian, Logseq, or publishing.</div>
          </div>
          <button type="button" className="btn" onClick={onExportMarkdown}>
            <Icon name="file-text" size={14} />
            <span>Export Markdown</span>
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--line)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Onboarding Tour</div>
            <div style={{ fontSize: 12, color: 'var(--mute)' }}>Re-run the interactive introduction to Knowledger.</div>
          </div>
          <button type="button" className="btn ghost" onClick={onOpenOnboarding}>
            <Icon name="sparkles" size={14} />
            <span>Take Tour</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <h3 style={{ fontSize: 16, marginBottom: 12, color: '#c94242' }}>Reset Data</h3>
      <div className="card" style={{ borderColor: 'rgba(201, 66, 66, 0.3)', padding: 16 }}>
        {showClearConfirm ? (
          <div>
            <div style={{ fontSize: 13, marginBottom: 12, color: 'var(--ink)' }}>
              Are you sure? This will reset your notebook to the initial welcome note and clear your scrapbook.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn pri"
                style={{ background: '#c94242', borderColor: '#c94242' }}
                onClick={() => {
                  setShowClearConfirm(false);
                  onClearData();
                }}
              >
                Yes, Reset Notebook
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#c94242' }}>Clear All Notes & Scraps</div>
              <div style={{ fontSize: 12, color: 'var(--mute)' }}>Resets notebook to default state.</div>
            </div>
            <button
              type="button"
              className="btn danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <Icon name="trash" size={14} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
