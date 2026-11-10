import { useState } from 'react';
import { Icon } from './Icon';

interface BulkActionBarProps {
  selectedCount: number;
  isArchivedView?: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onAddTag: (tag: string) => void;
  onExport: () => void;
  onDeselectAll: () => void;
}

export function BulkActionBar({
  selectedCount,
  isArchivedView = false,
  onDelete,
  onArchive,
  onAddTag,
  onExport,
  onDeselectAll
}: BulkActionBarProps) {
  const [showTagPrompt, setShowTagPrompt] = useState(false);
  const [tagInput, setTagInput] = useState('');

  if (selectedCount === 0) return null;

  const handleTagSubmit = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean) {
      onAddTag(clean);
    }
    setTagInput('');
    setShowTagPrompt(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        transform: 'translateX(-50%)',
        zIndex: 70,
        background: 'var(--ink)',
        color: 'var(--bg)',
        borderRadius: 12,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '94vw',
        animation: 'pop 0.18s ease'
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, paddingRight: 4, whiteSpace: 'nowrap' }}>
        {selectedCount} selected
      </div>

      <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }} />

      <button
        type="button"
        onClick={onArchive}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--bg)'
        }}
        className="hover:bg-white/10"
      >
        <Icon name="archive" size={14} />
        <span style={{ display: 'none' }} className="sm:inline">
          {isArchivedView ? 'Restore' : 'Archive'}
        </span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          color: '#f87171'
        }}
        className="hover:bg-white/10"
      >
        <Icon name="trash" size={14} />
        <span style={{ display: 'none' }} className="sm:inline">Delete</span>
      </button>

      {showTagPrompt ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTagSubmit();
              if (e.key === 'Escape') setShowTagPrompt(false);
            }}
            placeholder="Tag name…"
            autoFocus
            style={{
              padding: '4px 8px',
              fontSize: 12,
              borderRadius: 6,
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              color: 'var(--bg)',
              outline: 'none',
              width: 90
            }}
          />
          <button
            type="button"
            onClick={handleTagSubmit}
            style={{ color: 'var(--bg)', padding: '4px 6px', fontSize: 12 }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowTagPrompt(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--bg)'
          }}
          className="hover:bg-white/10"
        >
          <Icon name="tags" size={14} />
          <span style={{ display: 'none' }} className="sm:inline">Tag</span>
        </button>
      )}

      <button
        type="button"
        onClick={onExport}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--bg)'
        }}
        className="hover:bg-white/10"
      >
        <Icon name="download" size={14} />
        <span style={{ display: 'none' }} className="sm:inline">Export</span>
      </button>

      <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }} />

      <button
        type="button"
        onClick={onDeselectAll}
        aria-label="Cancel multi-select"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 8px',
          borderRadius: 6,
          color: 'var(--mute)'
        }}
        className="hover:text-white hover:bg-white/10"
      >
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
