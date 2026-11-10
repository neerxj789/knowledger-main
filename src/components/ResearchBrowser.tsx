import React, { useState, useEffect, useRef } from 'react';
import { Article, ScrapItem, SelectionState } from '../types';
import { Icon } from './Icon';
import { Reader } from './Reader';

interface WikipediaSearchResult {
  title: string;
  snippet: string;
}

interface ResearchBrowserProps {
  currentArticle: Article;
  onSelectArticle: (article: Article) => void;
  scrap: ScrapItem[];
  onSel: (sel: SelectionState | null) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ResearchBrowser({
  currentArticle,
  onSelectArticle,
  scrap,
  onSel,
  onClose,
  isMobile = false
}: ResearchBrowserProps) {
  const [query, setQuery] = useState(currentArticle.title);
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  // Article navigation history with chevron arrows
  const [history, setHistory] = useState<Article[]>([currentArticle]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync query when currentArticle changes from external select
  useEffect(() => {
    setQuery(currentArticle.title);
  }, [currentArticle.title]);

  // Handle outside click to close search dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch Wikipedia search results
  const fetchWikipediaSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        trimmed
      )}&utf8=&format=json&origin=*`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = data.query?.search || [];
        setSearchResults(
          items.map((it: { title: string; snippet: string }) => ({
            title: it.title,
            snippet: it.snippet.replace(/<\/?[^>]+(>|$)/g, '')
          }))
        );
        setShowResultsDropdown(true);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchWikipediaSearch(val);
    }, 350);
  };

  // Load selected Wikipedia article
  const loadArticleByTitle = async (title: string) => {
    setShowResultsDropdown(false);
    setQuery(title);
    setIsLoadingArticle(true);

    try {
      // Try Wikipedia summary REST endpoint first
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`;
      const res = await fetch(summaryUrl);
      if (res.ok) {
        const data = await res.json();
        let paragraphs: string[] = [];

        // Also fetch introductory extract for richer depth if possible
        try {
          const fullExtractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&exintro=true&titles=${encodeURIComponent(
            title
          )}&format=json&origin=*`;
          const extRes = await fetch(fullExtractUrl);
          if (extRes.ok) {
            const extData = await extRes.json();
            const pages = extData.query?.pages || {};
            const firstPageKey = Object.keys(pages)[0];
            const extractText = pages[firstPageKey]?.extract;
            if (extractText) {
              paragraphs = extractText
                .split('\n')
                .map((p: string) => p.trim())
                .filter((p: string) => p.length > 0);
            }
          }
        } catch {
          // Fall back to summary extract
        }

        if (paragraphs.length === 0 && data.extract) {
          paragraphs = [data.extract];
        }

        const newArticle: Article = {
          id: data.titles?.canonical || title,
          title: data.title || title,
          url:
            data.content_urls?.desktop?.page ||
            `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
          paras:
            paragraphs.length > 0
              ? paragraphs
              : [
                  `Information on ${title}. In historical notebooks, entries gathered on this subject assisted scholars in synthesis.`,
                  'Select any portion of text to capture evidence or save as a highlight.'
                ]
        };

        // Add to history
        const newHist = history.slice(0, historyIndex + 1);
        newHist.push(newArticle);
        setHistory(newHist);
        setHistoryIndex(newHist.length - 1);

        onSelectArticle(newArticle);
        return;
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingArticle(false);
    }

    // Local fallback article
    const fallbackArticle: Article = {
      id: `wiki-${Date.now()}`,
      title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      paras: [
        `Article summary for "${title}". Scholars and researchers use commonplace notebooks to compile quotes and thoughts on this topic.`,
        'Highlight any sentence here to attach it directly to your notes as evidence.'
      ]
    };
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(fallbackArticle);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);

    onSelectArticle(fallbackArticle);
    setIsLoadingArticle(false);
  };

  // Chevron navigation: Back
  const canGoBack = historyIndex > 0;
  const handleHistoryBack = () => {
    if (canGoBack) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const prevArticle = history[prevIdx];
      setQuery(prevArticle.title);
      onSelectArticle(prevArticle);
    }
  };

  // Chevron navigation: Forward
  const canGoForward = historyIndex < history.length - 1;
  const handleHistoryForward = () => {
    if (canGoForward) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const nextArticle = history[nextIdx];
      setQuery(nextArticle.title);
      onSelectArticle(nextArticle);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      {/* Research Browser Header Bar */}
      <div className="rbar" ref={containerRef} style={{ position: 'relative' }}>
        {/* Chevron Arrows for Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            type="button"
            className="btn ghost"
            disabled={!canGoBack}
            onClick={handleHistoryBack}
            title="Previous article"
            aria-label="Previous article"
            style={{ padding: '6px', opacity: canGoBack ? 1 : 0.3 }}
          >
            <Icon name="chevron-left" size={17} />
          </button>
          <button
            type="button"
            className="btn ghost"
            disabled={!canGoForward}
            onClick={handleHistoryForward}
            title="Next article"
            aria-label="Next article"
            style={{ padding: '6px', opacity: canGoForward ? 1 : 0.3 }}
          >
            <Icon name="chevron-right" size={17} />
          </button>
        </div>

        {/* Search input with live Wikipedia search */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 10, color: 'var(--mute)', pointerEvents: 'none', display: 'flex' }}>
            <Icon name="search" size={15} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowResultsDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadArticleByTitle(query);
              }
            }}
            placeholder="Search Wikipedia topics…"
            aria-label="Search Wikipedia"
            style={{
              paddingLeft: 32,
              paddingRight: isSearching ? 32 : 10,
              width: '100%'
            }}
          />
          {isSearching && (
            <span
              style={{
                position: 'absolute',
                right: 10,
                color: 'var(--mute)',
                fontSize: 11
              }}
            >
              …
            </span>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            aria-label="Close research browser"
            style={{ padding: '6px 8px' }}
          >
            <Icon name={isMobile ? 'x' : 'panel-right-close'} size={16} />
          </button>
        )}

        {/* Live Search Results Dropdown */}
        {showResultsDropdown && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--line-strong)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 40,
              maxHeight: 280,
              overflowY: 'auto',
              marginTop: 4
            }}
          >
            <div style={{ padding: '6px 12px', fontSize: 11, color: 'var(--mute)', fontWeight: 600, borderBottom: '1px solid var(--line)' }}>
              WIKIPEDIA RESULTS
            </div>
            {searchResults.map((res, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadArticleByTitle(res.title)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                  display: 'block'
                }}
                className="hover:bg-slate-100 dark:hover:bg-neutral-800"
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  {res.title}
                </div>
                {res.snippet && (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--mute)',
                      marginTop: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {res.snippet}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reader View */}
      <Reader
        article={currentArticle}
        scrap={scrap}
        onSel={onSel}
        isLoading={isLoadingArticle}
      />
    </div>
  );
}
