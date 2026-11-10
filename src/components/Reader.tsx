import React from 'react';
import { Article, ScrapItem, SelectionState } from '../types';
import { Icon } from './Icon';

interface ReaderProps {
  article: Article;
  scrap: ScrapItem[];
  onSel: (sel: SelectionState | null) => void;
  isLoading?: boolean;
}

export function Reader({ article, scrap, onSel, isLoading = false }: ReaderProps) {
  // Highlight matching snippets from scrap items
  const renderParagraph = (text: string, pIndex: number) => {
    const matchingScraps = scrap.filter((s) => s.text && text.includes(s.text));
    if (matchingScraps.length === 0) {
      return text;
    }

    interface Match {
      start: number;
      end: number;
      text: string;
      id: number;
    }

    const matches: Match[] = [];
    matchingScraps.forEach((s) => {
      let idx = text.indexOf(s.text);
      while (idx !== -1) {
        matches.push({
          start: idx,
          end: idx + s.text.length,
          text: s.text,
          id: s.id
        });
        idx = text.indexOf(s.text, idx + s.text.length);
      }
    });

    matches.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let currentIdx = 0;

    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      if (m.start < currentIdx) continue;
      if (m.start > currentIdx) {
        elements.push(text.slice(currentIdx, m.start));
      }
      elements.push(
        <mark key={`mark-${pIndex}-${m.id}-${i}`}>{m.text}</mark>
      );
      currentIdx = m.end;
    }

    if (currentIdx < text.length) {
      elements.push(text.slice(currentIdx));
    }

    return elements;
  };

  const handleSelection = () => {
    setTimeout(() => {
      const s = window.getSelection();
      if (!s || s.rangeCount === 0) {
        onSel(null);
        return;
      }
      const t = s.toString().trim();
      if (t.length < 3) {
        onSel(null);
        return;
      }
      const r = s.getRangeAt(0).getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        onSel(null);
        return;
      }

      onSel({
        text: t,
        x: Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160),
        y: Math.max(r.top - 56, 10)
      });
    }, 15);
  };

  if (isLoading) {
    return (
      <div className="reader" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ textAlign: 'center', color: 'var(--mute)' }}>
          <div style={{ animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>
            <Icon name="compass" size={28} />
          </div>
          <div style={{ marginTop: 12, fontSize: 13 }}>Fetching from Wikipedia…</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="reader"
      onMouseUp={handleSelection}
      onTouchEnd={handleSelection}
    >
      <h1>{article.title}</h1>
      <div className="src">
        <Icon name="book-open" size={14} />
        <span>
          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              en.wikipedia.org · Reader view
            </a>
          ) : (
            'en.wikipedia.org · Reader view'
          )}
        </span>
      </div>
      {article.paras && article.paras.length > 0 ? (
        article.paras.map((p, i) => (
          <p key={i}>{renderParagraph(p, i)}</p>
        ))
      ) : (
        <p style={{ color: 'var(--mute)', fontStyle: 'italic' }}>
          No text content available for this section.
        </p>
      )}
    </div>
  );
}
