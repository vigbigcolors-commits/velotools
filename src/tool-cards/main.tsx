import React from 'react';
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

function ToolCardsMount() {
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
