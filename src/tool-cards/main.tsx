import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TOOLS_DATA } from './data/toolsData';
import { ToolItem } from './types';
import { CardGrid } from './components/CardGrid';
import './index.css';

const TOOL_HREFS: Record<string, string> = {
  'image-compressor': '/image-compress/',
  'focus-room': '/focus/',
  'qr-generator': '/qr/',
  'pdf-compressor': '/compress-pdf/',
  'bg-remover': '/bgremover/',
  'invoice-generator': '/invoice/',
};

const BOOKMARK_KEY = 'tool_card_bookmarks';

function ToolCardsMount() {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch {
      /* ignore */
    }
  }, [bookmarks]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openTool = (tool: ToolItem) => {
    const href = TOOL_HREFS[tool.id];
    if (href) window.location.href = href;
  };

  return (
    <CardGrid
      tools={TOOLS_DATA}
      theme="dark"
      variant="glow"
      layout="grid"
      bookmarks={bookmarks}
      onToggleBookmark={toggleBookmark}
      onOpenDetails={openTool}
    />
  );
}

const rootEl = document.getElementById('tool-card-grid-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ToolCardsMount />
    </React.StrictMode>,
  );
}
