import { useState } from 'react';
import { Icon } from './Icon';
import { AppLanguage, UserProfile } from '../types';
import { LANGUAGE_OPTIONS } from '../i18n/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (p: Partial<UserProfile>) => void;
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export function OnboardingModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  language,
  onSelectLanguage
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [tempName, setTempName] = useState(userProfile.name);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Knowledger',
      subtitle: 'The modern commonplace book for thinkers and researchers.',
      icon: 'bookmark',
      content: (
        <div style={{ textAlign: 'center', lineHeight: 1.7, fontSize: 14 }}>
          <p style={{ margin: '0 0 14px' }}>
            For centuries, scholars like Erasmus, Locke, and Woolf kept commonplace books—scrapbooks of quotes, ideas, and reflections compiled with a pen in hand.
          </p>
          <p style={{ margin: 0, color: 'var(--mute)' }}>
            Knowledger brings this timeless practice into the digital realm with an integrated Wikipedia research browser and a structured thinking canvas.
          </p>
        </div>
      )
    },
    {
      title: 'Live Research & Highlighting',
      subtitle: 'Read, search Wikipedia, and capture evidence directly.',
      icon: 'compass',
      content: (
        <div style={{ textAlign: 'center', lineHeight: 1.7, fontSize: 14 }}>
          <p style={{ margin: '0 0 14px' }}>
            Open the <strong>Research Browser</strong> in your top navigation. Search any topic on Wikipedia in real time, and navigate history using the <strong>chevron arrows</strong>.
          </p>
          <div
            style={{
              background: 'var(--sunk)',
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              fontFamily: 'var(--serif)',
              fontSize: 14,
              fontStyle: 'italic',
              margin: '0 auto',
              maxWidth: 380
            }}
          >
            &ldquo;Highlight text in the reader to save quotes as evidence or turn them into claims with a single tap.&rdquo;
          </div>
        </div>
      )
    },
    {
      title: 'Hold & Select for Bulk Actions',
      subtitle: 'Organize your knowledge archive efficiently.',
      icon: 'check-square',
      content: (
        <div style={{ textAlign: 'center', lineHeight: 1.7, fontSize: 14 }}>
          <p style={{ margin: '0 0 14px' }}>
            <strong>Press and hold</strong> on any note in the list or grid to activate multi-select mode.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap',
              margin: '12px 0'
            }}
          >
            <span className="btn ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
              <Icon name="archive" size={13} /> Archive
            </span>
            <span className="btn ghost danger" style={{ fontSize: 12, padding: '4px 8px' }}>
              <Icon name="trash" size={13} /> Delete
            </span>
            <span className="btn ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
              <Icon name="download" size={13} /> Export
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--mute)' }}>
            Easily organize, tag, or restore archived notes whenever needed.
          </p>
        </div>
      )
    },
    {
      title: 'Personalize Your Notebook',
      subtitle: 'Set up your scholar profile and language.',
      icon: 'user',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--mute)', marginBottom: 4 }}>
              Your Name / Moniker
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g. Erasmus, Ada, Scholar"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--line-strong)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: 14
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--mute)', marginBottom: 4 }}>
              Interface Language
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onSelectLanguage(opt.code)}
                  className={`btn ${language === opt.code ? 'pri' : 'ghost'}`}
                  style={{ justifyContent: 'center', fontSize: 13, padding: '6px 8px' }}
                >
                  {opt.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (tempName.trim()) {
        onUpdateProfile({ name: tempName.trim() });
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, padding: '28px 26px' }}
      >
        {/* Top progress dots & close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 22 : 8,
                  height: 6,
                  borderRadius: 99,
                  background: i === step ? 'var(--accent)' : 'var(--line-strong)',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            aria-label="Skip tour"
            style={{ fontSize: 12, color: 'var(--mute)', padding: '2px 6px' }}
          >
            Skip
          </button>
        </div>

        {/* Step Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}
          >
            <Icon name={currentStep.icon} size={24} />
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 6 }}>{currentStep.title}</h2>
          <div style={{ fontSize: 13, color: 'var(--mute)' }}>{currentStep.subtitle}</div>
        </div>

        {/* Step Content */}
        <div style={{ minHeight: 140, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentStep.content}
        </div>

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn ghost"
            onClick={handlePrev}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.3 : 1 }}
          >
            <Icon name="chevron-left" size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn pri"
            onClick={handleNext}
            style={{ padding: '8px 18px' }}
          >
            <span>{step === steps.length - 1 ? 'Start Thinking' : 'Next'}</span>
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
