import { AppLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../i18n/translations';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenOnboarding: () => void;
  fontSize: 'standard' | 'comfort' | 'large';
  onSelectFontSize: (size: 'standard' | 'comfort' | 'large') => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  language,
  onSelectLanguage,
  theme,
  onToggleTheme,
  onOpenOnboarding,
  fontSize,
  onSelectFontSize
}: SettingsModalProps) {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>{t.settings}</h2>
          <button type="button" className="btn ghost" onClick={onClose} aria-label="Close settings">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* UI Languages */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            {t.languages}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`btn ${language === opt.code ? 'pri' : 'ghost'}`}
                onClick={() => onSelectLanguage(opt.code)}
                style={{ justifyContent: 'center', fontSize: 13, padding: '6px' }}
              >
                {opt.native}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance & Theme */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Appearance
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className={`btn ${theme === 'light' ? 'pri' : 'ghost'}`}
              onClick={() => {
                if (theme !== 'light') onToggleTheme();
              }}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Icon name="sun" size={15} />
              <span>{t.lightMode}</span>
            </button>
            <button
              type="button"
              className={`btn ${theme === 'dark' ? 'pri' : 'ghost'}`}
              onClick={() => {
                if (theme !== 'dark') onToggleTheme();
              }}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Icon name="moon" size={15} />
              <span>{t.darkMode}</span>
            </button>
          </div>
        </div>

        {/* Reading Font Size */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Prose & Reader Size
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(
              [
                ['standard', 'Default (16px)'],
                ['comfort', 'Comfort (18px)'],
                ['large', 'Large (20px)']
              ] as const
            ).map(([sz, label]) => (
              <button
                key={sz}
                type="button"
                className={`btn ${fontSize === sz ? 'pri' : 'ghost'}`}
                onClick={() => onSelectFontSize(sz)}
                style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '6px' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Onboarding Tour Link */}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--mute)' }}>Need a refresher?</span>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
          >
            <Icon name="sparkles" size={14} />
            <span>{t.onboarding}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
