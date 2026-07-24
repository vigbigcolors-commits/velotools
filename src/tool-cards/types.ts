export interface ToolItem {
  id: string;
  titlePrefix: string;
  titleHighlight: string;
  category: 'media' | 'productivity' | 'utilities' | 'business';
  description: string;
  badgeText: string;
  badgeType: 'popular' | 'deepwork' | 'instant' | 'private' | 'ai' | 'featured';
  badgeIcon: string;
  iconName: string;
  iconBgGradient: string;
  iconColor: string;
  accentGlow: string;
  cardTheme: {
    borderHover: string;
    glowBg: string;
    gradientTitle: string;
    badgeStyle: string;
    bgPattern: string;
  };
  stats?: { label: string; value: string }[];
  features: string[];
}

export type ThemeStyle = 'dark' | 'glass-light' | 'cyberpunk' | 'minimal-dark';
export type LayoutMode = 'grid' | 'compact' | 'list';
export type CardVariant = 'glow' | 'glass' | 'border' | 'gradient';
