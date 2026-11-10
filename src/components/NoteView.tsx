import { useState, useRef, useEffect } from 'react';
import { Note, NoteType, ScrapItem } from '../types';
import { NOTE_TYPES } from '../data/initialData';
import { Icon } from './Icon';

interface NoteViewProps {
  note: Note;
  edit: (updates: Partial<Note>) => void;
  onDeleteNote: (id: number) => void;
  onArchiveNote?: (id: number) => void;
  onDuplicateNote?: (note: Note) => void;
}

const fmt = (t: number) =>
  new Date(t).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

export function NoteView({
  note,
  edit,
  onDeleteNote,
  onArchiveNote,
  onDuplicateNote
}: NoteViewProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== note.title) {
      titleRef.current.innerText = note.title;
    }
    if (bodyRef.current && bodyRef.current.innerText !== note.body) {
      bodyRef.current.innerText = note.body;
    }
    setShowTypeMenu(false);
    setIsAddingTag(false);
    setShowDeleteConfirm(false);
  }, [note.id]);

  useEffect(() => {
    if (isAddingTag && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [isAddingTag]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !note.tags.includes(trimmed)) {
      edit({ tags: [...note.tags, trimmed] });
    }
    setTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    edit({ tags: note.tags.filter((t) => t !== tagToRemove) });
  };

  const handleRemoveEvidence = (scrapId: number) => {
    if (!note.ev) return;
    edit({ ev: note.ev.filter((item) => item.id !== scrapId) });
  };

  return (
    <div className="page" key={note.id}>
      {/* Top note toolbar for actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12
        }}
      >
        <div>
          {note.archived && (
            <span className="chip" style={{ background: 'var(--sunk)', color: 'var(--mute)' }}>
              <Icon name="archive" size={12} /> Archived
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onArchiveNote && (
            <button
              type="button"
              className="btn ghost text-xs"
              onClick={() => onArchiveNote(note.id)}
              title={note.archived ? 'Restore note' : 'Archive note'}
              style={{ padding: '5px 9px', color: 'var(--mute)' }}
            >
              <Icon name="archive" size={13} />
              <span>{note.archived ? 'Restore' : 'Archive'}</span>
            </button>
          )}

          {onDuplicateNote && (
            <button
              type="button"
              className="btn ghost text-xs"
              onClick={() => onDuplicateNote(note)}
              title="Duplicate note"
              style={{ padding: '5px 9px', color: 'var(--mute)' }}
            >
              <Icon name="copy" size={13} />
              <span>Duplicate</span>
            </button>
          )}

          <button
            type="button"
            className="btn ghost danger text-xs"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete note"
            style={{ padding: '5px 9px' }}
          >
            <Icon name="trash" size={13} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Delete confirmation banner */}
      {showDeleteConfirm && (
        <div
          style={{
            background: 'var(--sunk)',
            border: '1px solid var(--line-strong)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--ink)' }}>
            Delete <strong>&ldquo;{note.title || 'Untitled'}&rdquo;</strong>? This cannot be undone.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn text-xs"
              style={{ padding: '4px 10px' }}
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn pri text-xs"
              style={{ padding: '4px 10px', background: '#c94242', borderColor: '#c94242' }}
              onClick={() => {
                setShowDeleteConfirm(false);
                onDeleteNote(note.id);
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Note Title */}
      <div
        ref={titleRef}
        className="title"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Note title"
        data-placeholder="Untitled Note"
        onBlur={(e) => {
          const newTitle = e.currentTarget.innerText.trim();
          edit({ title: newTitle || 'Untitled note' });
        }}
      >
        {note.title}
      </div>

      {/* Note Metadata: Type, Tags, Add Tag */}
      <div className="meta">
        {/* Type selector chip */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="chip on chip-btn"
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            title="Change note type"
          >
            <span>{note.type}</span>
            <Icon name="chevron-down" size={12} />
          </button>

          {showTypeMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                boxShadow: 'var(--shadow)',
                zIndex: 20,
                minWidth: 140,
                padding: '4px 0',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {NOTE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: note.type === type ? 'var(--accent)' : 'var(--ink)',
                    background: note.type === type ? 'var(--sunk)' : 'transparent'
                  }}
                  onClick={() => {
                    edit({ type: type as NoteType });
                    setShowTypeMenu(false);
                  }}
                >
                  <span>{type}</span>
                  {note.type === type && <Icon name="check" size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Existing tags */}
        {note.tags.map((t) => (
          <span className="chip" key={t}>
            <span>#{t}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              style={{
                marginLeft: 2,
                cursor: 'pointer',
                display: 'inline-flex',
                color: 'var(--mute)'
              }}
              title={`Remove #${t}`}
              aria-label={`Remove tag ${t}`}
            >
              <Icon name="x" size={11} />
            </button>
          </span>
        ))}

        {/* Add Tag */}
        {isAddingTag ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setIsAddingTag(false);
              }}
              onBlur={handleAddTag}
              placeholder="tag name…"
              style={{
                fontSize: 12,
                padding: '2px 8px',
                borderRadius: 99,
                border: '1px solid var(--accent)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                width: 90,
                outline: 'none'
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            className="chip chip-btn"
            onClick={() => setIsAddingTag(true)}
            title="Add a tag"
            style={{ border: '1px dashed var(--line-strong)' }}
          >
            <Icon name="plus" size={11} />
            <span>Tag</span>
          </button>
        )}
      </div>

      {/* Note Body */}
      <div
        ref={bodyRef}
        className="body"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Note content"
        data-placeholder="Start typing your reflections, notes, or synthesis here..."
        onBlur={(e) => edit({ body: e.currentTarget.innerText })}
      >
        {note.body}
      </div>

      {/* Attached Evidence / Quotes */}
      {note.ev &&
        note.ev.map((i: ScrapItem) => (
          <div className="quote group" key={i.id}>
            {i.text}
            <small>
              {(i.sourceTitle || 'Wikipedia') + ' · saved ' + fmt(i.at)}
            </small>
            <button
              type="button"
              className="del-btn"
              onClick={() => handleRemoveEvidence(i.id)}
              title="Remove evidence quote"
              aria-label="Remove quote"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        ))}
    </div>
  );
}
