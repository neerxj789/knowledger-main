import { useState } from 'react';
import { ScrapItem } from '../types';
import { Icon } from './Icon';

interface ScrapbookProps {
  scrap: ScrapItem[];
  toNote: (item: ScrapItem) => void;
  onDeleteScrap?: (id: number) => void;
  onToggleReview?: (id: number) => void;
}

const fmt = (t: number) =>
  new Date(t).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

export function Scrapbook({
  scrap,
  toNote,
  onDeleteScrap,
  onToggleReview
}: ScrapbookProps) {
  const [f, setF] = useState<'all' | 'highlight' | 'new' | 'evidence'>('all');

  const list = scrap.filter((i) => {
    if (f === 'all') return true;
    if (f === 'new') return !i.rev;
    return i.type === f;
  });

  return (
    <div>
      <div className="filters">
        {(
          [
            ['all', 'All'],
            ['highlight', 'Highlights'],
            ['new', 'Unreviewed']
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            className={'chip' + (f === k ? ' on' : '')}
            onClick={() => setF(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="empty">
          <Icon name="bookmark" size={32} />
          <div style={{ marginTop: 12 }}>Nothing here yet.</div>
          <div>Select text in the reader and choose Save or Highlight.</div>
        </div>
      )}

      {list.map((i) => (
        <div className="card group" key={i.id}>
          <q>{i.text}</q>
          <div className="m">
            <span>{fmt(i.at)}</span>
            <a
              href={i.sourceUrl || 'https://en.wikipedia.org/wiki/Commonplace_book'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {i.sourceTitle || 'Commonplace book'}
            </a>
            {!i.rev && (
              <span
                className="chip accent cursor-pointer"
                title="Click to mark as reviewed"
                onClick={() => onToggleReview && onToggleReview(i.id)}
              >
                New
              </span>
            )}
            <span style={{ flex: 1 }} />
            {onDeleteScrap && (
              <button
                type="button"
                className="btn ghost text-xs"
                title="Remove snippet"
                onClick={() => onDeleteScrap(i.id)}
                aria-label="Delete scrap"
                style={{ padding: '5px 8px' }}
              >
                <Icon name="trash" size={13} />
              </button>
            )}
            <button
              type="button"
              className="btn"
              onClick={() => toNote(i)}
            >
              <span>Turn into note</span>
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
