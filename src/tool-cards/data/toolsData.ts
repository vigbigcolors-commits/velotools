import { ToolItem } from '../types';

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'image-compressor',
    titlePrefix: 'Image',
    titleHighlight: 'Compressor',
    category: 'media',
    description: 'Compress JPG, PNG, WebP and AVIF up to 90% smaller — no upload required. Convert to WebP or AVIF for next-gen format savings. Batch compress 15 images at once.',
    badgeText: 'MOST POPULAR',
    badgeType: 'popular',
    badgeIcon: 'Flame',
    iconName: 'Image',
    iconBgGradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_10px_25px_rgba(16,185,129,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      glowBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      gradientTitle: 'from-emerald-400 via-teal-300 to-cyan-400',
      badgeStyle: 'bg-emerald-500/15 border-emerald-500/55 text-emerald-300',
      bgPattern: 'grid-emerald'
    },
    stats: [
      { label: 'Saved Space', value: 'Up to 90%' },
      { label: 'Processing', value: 'In-Browser' }
    ],
    features: ['Batch compress 15 images', 'Convert to WebP / AVIF', 'Resize, crop & rotate', 'Zero server uploads']
  },
  {
    id: 'focus-room',
    titlePrefix: 'Focus',
    titleHighlight: 'Room',
    category: 'productivity',
    description: 'Pomodoro timer with lofi and ambient audio, tasks, and local notes in one workspace. No account required.',
    badgeText: 'DEEP WORK',
    badgeType: 'deepwork',
    badgeIcon: 'Clock',
    iconName: 'Clock',
    iconBgGradient: 'bg-gradient-to-br from-rose-500 via-orange-500 to-amber-600 shadow-[0_10px_25px_rgba(244,63,94,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(244, 63, 94, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-rose-500/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]',
      glowBg: 'from-rose-500/10 via-orange-500/5 to-transparent',
      gradientTitle: 'from-rose-400 via-orange-300 to-amber-400',
      badgeStyle: 'bg-rose-500/15 border-rose-500/55 text-rose-300',
      bgPattern: 'dots-rose'
    },
    stats: [
      { label: 'Timer Preset', value: '25/5 min' },
      { label: 'Soundscapes', value: '12 Streams' }
    ],
    features: ['Custom Pomodoro timer', 'Lofi & Rain audio mixes', 'Task focus tracker', '100% Free workspace']
  },
  {
    id: 'qr-generator',
    titlePrefix: 'QR Code',
    titleHighlight: 'Generator',
    category: 'utilities',
    description: 'Generate custom QR codes for URLs, WiFi passwords, contact cards (vCard), Email, SMS, and phone numbers — free, no signup. Custom colors and logo.',
    badgeText: 'INSTANT',
    badgeType: 'instant',
    badgeIcon: 'Zap',
    iconName: 'QrCode',
    iconBgGradient: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_10px_25px_rgba(6,182,212,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(6, 182, 212, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      glowBg: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      gradientTitle: 'from-cyan-400 via-sky-300 to-blue-400',
      badgeStyle: 'bg-cyan-500/15 border-cyan-500/55 text-cyan-300',
      bgPattern: 'matrix-cyan'
    },
    stats: [
      { label: 'Export Format', value: 'SVG & PNG' },
      { label: 'Error Level', value: 'High (H)' }
    ],
    features: ['WiFi & vCard presets', 'Custom logo overlay', 'Vector SVG download', 'No signup needed']
  },
  {
    id: 'pdf-compressor',
    titlePrefix: 'PDF',
    titleHighlight: 'Compressor',
    category: 'media',
    description: 'Compress PDFs in your browser with adjustable quality presets. Batch up to 20 files at once.',
    badgeText: 'NO PDF UPLOAD',
    badgeType: 'private',
    badgeIcon: 'Lock',
    iconName: 'FileText',
    iconBgGradient: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 shadow-[0_10px_25px_rgba(245,158,11,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      glowBg: 'from-amber-500/10 via-yellow-500/5 to-transparent',
      gradientTitle: 'from-amber-400 via-yellow-300 to-orange-400',
      badgeStyle: 'bg-amber-500/15 border-amber-400/70 text-amber-300',
      bgPattern: 'lines-amber'
    },
    stats: [
      { label: 'Batch Size', value: '20 PDFs' },
      { label: 'Privacy', value: 'In-browser' }
    ],
    features: ['Browser-only compression', 'Batch 20 files at once', '4 quality presets', 'Adjustable PDF compression presets']
  },
  {
    id: 'bg-remover',
    titlePrefix: 'Background',
    titleHighlight: 'Remover',
    category: 'media',
    description: 'AI-assisted background removal in your browser. Export transparent PNG images for product photos, portraits, and logos.',
    badgeText: 'AI POWERED',
    badgeType: 'ai',
    badgeIcon: 'Sparkles',
    iconName: 'Layers',
    iconBgGradient: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-[0_10px_25px_rgba(139,92,246,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(139, 92, 246, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
      glowBg: 'from-violet-500/10 via-purple-500/5 to-transparent',
      gradientTitle: 'from-violet-400 via-purple-300 to-fuchsia-400',
      badgeStyle: 'bg-violet-500/15 border-violet-400/60 text-violet-300',
      bgPattern: 'waves-violet'
    },
    stats: [
      { label: 'Output', value: 'Transparent PNG' },
      { label: 'Processing', value: 'In-browser' }
    ],
    features: ['AI background removal', 'Transparent PNG export', 'Product photo mode', 'Browser-based processing']
  },
  {
    id: 'invoice-generator',
    titlePrefix: 'Invoice',
    titleHighlight: 'Generator',
    category: 'business',
    description: 'Create professional PDF invoices in 60 seconds — free, no watermark, no account. 10 elegant templates, custom logo, automatic tax calculations, 20+ currencies.',
    badgeText: 'FEATURED',
    badgeType: 'featured',
    badgeIcon: 'Star',
    iconName: 'Receipt',
    iconBgGradient: 'bg-gradient-to-br from-sky-400 via-indigo-500 to-blue-700 shadow-[0_10px_25px_rgba(14,165,233,0.35)]',
    iconColor: 'text-white',
    accentGlow: 'rgba(14, 165, 233, 0.25)',
    cardTheme: {
      borderHover: 'hover:border-sky-500/60 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]',
      glowBg: 'from-sky-500/10 via-indigo-500/5 to-transparent',
      gradientTitle: 'from-sky-400 via-indigo-300 to-blue-400',
      badgeStyle: 'bg-sky-500/15 border-sky-400/60 text-sky-300',
      bgPattern: 'receipt-sky'
    },
    stats: [
      { label: 'Templates', value: '10 Styles' },
      { label: 'Currencies', value: '20+ Supported' }
    ],
    features: ['Auto tax & totals', '10 PDF templates', 'Custom logo & signature', 'Client database']
  }
];
