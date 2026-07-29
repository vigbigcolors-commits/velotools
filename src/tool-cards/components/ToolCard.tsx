import React from 'react';
import {
  Flame,
  Clock,
  Zap,
  Lock,
  Sparkles,
  Star,
  Image as ImageIcon,
  QrCode,
  FileText,
  Layers,
  Receipt,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
  Wand2,
} from 'lucide-react';
import { ToolItem, ThemeStyle, CardVariant, LayoutMode } from '../types';

interface ToolCardProps {
  tool: ToolItem;
  theme: ThemeStyle;
  variant: CardVariant;
  layout: LayoutMode;
  onOpenDetails: (tool: ToolItem) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  theme,
  variant,
  layout,
  onOpenDetails,
}) => {

  // Render main large expressive 3D icon
  const renderLargeIcon = (name: string) => {
    const props = { className: 'w-7 h-7 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3' };
    switch (name) {
      case 'Image':
        return <ImageIcon {...props} />;
      case 'Clock':
        return <Clock {...props} />;
      case 'QrCode':
        return <QrCode {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  // Render badge status icon
  const renderBadgeIcon = (badgeType: string) => {
    const iconProps = { className: 'w-3.5 h-3.5' };
    switch (badgeType) {
      case 'popular':
        return <Flame {...iconProps} className="w-3.5 h-3.5 text-emerald-400" />;
      case 'deepwork':
        return <Clock {...iconProps} className="w-3.5 h-3.5 text-rose-400" />;
      case 'instant':
        return <Zap {...iconProps} className="w-3.5 h-3.5 text-cyan-400" />;
      case 'private':
        return <Lock {...iconProps} className="w-3.5 h-3.5 text-amber-400" />;
      case 'ai':
        return <Sparkles {...iconProps} className="w-3.5 h-3.5 text-violet-400" />;
      case 'featured':
        return <Star {...iconProps} className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />;
      default:
        return <CheckCircle2 {...iconProps} />;
    }
  };

  // Render Unique Graphic Interactive Widget for each tool card!
  const renderCardVisualWidget = () => {
    switch (tool.id) {
      case 'image-compressor':
        return (
          <div className="vt-widget w-full my-4 p-4.5 p-5 rounded-xl bg-slate-950/90 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-sm font-mono mb-3">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Original: 4.2 MB
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
                ➔ 420 KB (-90%)
              </span>
            </div>
            <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 w-[90%] group-hover:w-[96%]" />
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-slate-400 font-sans">
              <span>Client-side WebP/AVIF</span>
              <span className="text-emerald-300 font-semibold">15 images batch</span>
            </div>
          </div>
        );

      case 'focus-room':
        return (
          <div className="vt-widget w-full my-4 p-5 rounded-xl bg-slate-950/90 border border-rose-500/20 group-hover:border-rose-500/40 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/45 text-rose-400 font-mono text-base font-extrabold shadow-[0_0_22px_rgba(244,63,94,0.35)] shrink-0">
                25:00
              </div>
              <div className="min-w-0">
                <p className="vt-widget-title text-[15px] font-bold text-slate-100">Pomodoro & Lofi Mix</p>
                <p className="vt-widget-sub text-xs text-slate-400 mt-1">Rain & White Noise Streams</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-11 px-3 py-2 bg-rose-950/40 rounded-lg border border-rose-500/25 shrink-0">
              <span className="w-1.5 bg-rose-400 rounded-full h-5" />
              <span className="w-1.5 bg-rose-400/85 rounded-full h-10" />
              <span className="w-1.5 bg-rose-400/70 rounded-full h-4" />
              <span className="w-1.5 bg-rose-400 rounded-full h-8" />
              <span className="w-1.5 bg-rose-400/80 rounded-full h-6" />
              <span className="w-1.5 bg-rose-400/90 rounded-full h-9" />
            </div>
          </div>
        );

      case 'qr-generator':
        return (
          <div className="vt-widget w-full my-4 p-5 rounded-xl bg-slate-950/90 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-[72px] h-[72px] bg-cyan-950/80 rounded-xl p-2.5 border border-cyan-500/35 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_18px_rgba(6,182,212,0.25)]">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-400">
                  <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z" fill="currentColor" opacity="0.3" />
                  <path d="M10 3h1v1h-1zM10 6h1v1h-1zM13 3h1v1h-1zM10 10h4v1h-4zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" fill="currentColor" />
                </svg>
                <div className="absolute inset-x-1 top-1/2 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_#22d3ee]" />
              </div>
              <div className="min-w-0">
                <p className="vt-widget-title text-[15px] font-bold text-slate-100">Custom Vector QR</p>
                <p className="vt-widget-sub text-xs text-slate-400 mt-1">WiFi, vCard, SMS & URL presets</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-300 px-3 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 font-semibold shrink-0">
              SVG / PNG
            </span>
          </div>
        );

      case 'pdf-compressor':
        return (
          <div className="vt-widget w-full my-4 p-5 rounded-xl bg-slate-950/90 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/35 text-amber-400 shrink-0 shadow-[0_0_18px_rgba(245,158,11,0.22)]">
                <FileCheck2 className="w-8 h-8 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="vt-widget-title text-[15px] font-bold text-slate-100">20 PDFs Batch Engine</p>
                <p className="vt-widget-sub text-xs text-slate-400 mt-1">Screen, Web & Print DPI presets</p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-300 px-3 py-2 bg-amber-500/10 rounded-lg border border-amber-500/30 font-bold flex items-center gap-1.5 shrink-0">
              <Lock className="w-4 h-4 text-amber-400" />
              In-Browser
            </span>
          </div>
        );

      case 'bg-remover':
        return (
          <div className="vt-widget w-full my-4 p-4 rounded-xl bg-slate-950/90 border border-violet-500/20 group-hover:border-violet-500/40 transition-colors">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-400 min-h-[64px]">
                <div className="w-5 h-5 rounded-md bg-slate-700 shrink-0" />
                <span className="font-medium">Original Photo</span>
              </div>
              <div className="p-4 rounded-xl bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px] bg-slate-950 border border-violet-500/45 flex items-center gap-2.5 text-violet-300 font-bold min-h-[64px] shadow-[0_0_16px_rgba(139,92,246,0.15)]">
                <Wand2 className="w-5 h-5 text-violet-400 shrink-0" />
                <span>AI Transparent PNG</span>
              </div>
            </div>
          </div>
        );

      case 'invoice-generator':
        return (
          <div className="vt-widget w-full my-4 p-5 rounded-xl bg-slate-950/90 border border-sky-500/20 group-hover:border-sky-500/40 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/35 text-sky-400 font-mono font-bold text-sm shrink-0 shadow-[0_0_14px_rgba(14,165,233,0.2)]">
                #INV-2026
              </div>
              <div className="min-w-0">
                <p className="vt-widget-title text-[15px] font-bold text-slate-100">$1,250.00 Auto-Tax</p>
                <p className="vt-widget-sub text-xs text-slate-400 mt-1">10 PDF Templates & 20+ Currencies</p>
              </div>
            </div>
            <span className="text-xs uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 shrink-0">
              PAID
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  // Background card style
  const getCardBgStyle = () => {
    if (theme === 'glass-light') {
      return 'bg-white border border-slate-200/90 shadow-md hover:shadow-2xl text-slate-900';
    }
    if (theme === 'cyberpunk') {
      return 'bg-zinc-950 border border-cyan-500/30 text-zinc-100 shadow-[0_0_20px_rgba(6,182,212,0.15)]';
    }
    if (theme === 'minimal-dark') {
      return 'bg-zinc-900 border border-zinc-800 text-zinc-100';
    }
    // Default dark slate
    return 'bg-slate-900 border border-slate-800/80 text-slate-100 shadow-xl';
  };

  return (
    <div
      id={`tool-card-${tool.id}`}
      role="link"
      tabIndex={0}
      onClick={() => onOpenDetails(tool)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails(tool);
        }
      }}
      className={`group relative rounded-2xl p-6 transition-transform duration-200 ease-out cursor-pointer overflow-hidden flex flex-col justify-between will-change-auto hover:-translate-y-1.5 ${getCardBgStyle()} ${tool.cardTheme.borderHover} ${
        layout === 'compact' ? 'min-h-[280px]' : layout === 'list' ? 'flex-row items-center gap-6 min-h-[160px]' : 'min-h-[390px]'
      }`}
    >
      {/* Soft accent wash on hover (CSS-only, no mouse tracking) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(420px circle at 20% 15%, ${tool.accentGlow}, transparent 55%)`,
        }}
      />

      {/* Unique Card Decorative Background Grid Pattern */}
      <div className="pointer-events-none absolute right-2 top-2 opacity-15 group-hover:opacity-30 transition-opacity">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col h-full justify-between">
        {/* Top Header Section */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-5">
            {/* Expressive 3D Icon Container */}
            <div className="relative">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl ${tool.iconBgGradient} transform transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1`}
              >
                {renderLargeIcon(tool.iconName)}
              </div>
              {/* Subtle back-glow */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-25 group-hover:opacity-55 transition-opacity -z-10"
                style={{ backgroundColor: tool.accentGlow }}
              />
            </div>

            {/* Launch */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id={`launch-btn-${tool.id}`}
                aria-label={`Open ${tool.titlePrefix} ${tool.titleHighlight}`}
                onClick={() => onOpenDetails(tool)}
                className="p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="sr-only">
                  Open {tool.titlePrefix} {tool.titleHighlight}
                </span>
              </button>
            </div>
          </div>

          {/* Title with Gradient Highlight */}
          <h3 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-2 flex-wrap">
            <span className={theme === 'glass-light' ? 'text-slate-900' : 'text-white'}>
              {tool.titlePrefix}
            </span>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${tool.cardTheme.gradientTitle}`}>
              {tool.titleHighlight}
            </span>
          </h3>

          {/* Description */}
          <p
            className={`text-sm leading-relaxed ${
              theme === 'glass-light' ? 'text-slate-600' : 'text-slate-400'
            } ${layout === 'compact' ? 'line-clamp-2' : 'line-clamp-3'}`}
          >
            {tool.description}
          </p>

          {/* Unique Tool Interactive Visual Mini-Widget */}
          {renderCardVisualWidget()}
        </div>

        {/* Card Footer: Badge & Features */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
          {/* Badge Pill — .vt-badge beats global *{padding:0} */}
          <div
            className={`vt-badge text-[11px] font-bold tracking-wider ${tool.cardTheme.badgeStyle}`}
          >
            {renderBadgeIcon(tool.badgeType)}
            <span className="uppercase">{tool.badgeText}</span>
          </div>

          {/* Key Stat Badge */}
          {tool.stats && tool.stats[0] && (
            <div className="text-xs font-mono text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400">{tool.stats[0].label}:</span>{' '}
              <span className="text-cyan-400 font-bold">{tool.stats[0].value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
