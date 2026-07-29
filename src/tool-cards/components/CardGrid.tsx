import React from 'react';
import { ToolItem, ThemeStyle, CardVariant, LayoutMode } from '../types';
import { ToolCard } from './ToolCard';
import { Sparkles } from 'lucide-react';

interface CardGridProps {
  tools: ToolItem[];
  theme: ThemeStyle;
  variant: CardVariant;
  layout: LayoutMode;
  onOpenDetails: (tool: ToolItem) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  tools,
  theme,
  variant,
  layout,
  onOpenDetails,
}) => {
  if (tools.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No tools match your search</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Try adjusting your search query or selecting a different category filter.
        </p>
      </div>
    );
  }

  const getGridClass = () => {
    if (layout === 'compact') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    }
    if (layout === 'list') {
      return 'flex flex-col gap-4';
    }
    // Default 3 column grid
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <div className={getGridClass()}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            theme={theme}
            variant={variant}
            layout={layout}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </main>
  );
};
