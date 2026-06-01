export interface Quote {
  id: number;
  text: string;
  explanation?: string;
}

export type ThemeId =
  | 'najaf_gold'
  | 'crimson_velvet'
  | 'shia_turquoise'
  | 'twilight_blue'
  | 'clay_sand'
  | 'obsidian_ash'
  | 'dusk_saffron'
  | 'imperial_violet'
  | 'holy_mint'
  | 'muhammadan_rose';

export interface ThemeConfig {
  id: ThemeId;
  nameAr: string;
  nameEn: string;
  bgClass: string;
  cardBgClass: string;
  textPrimary: string;
  textSecondary: string;
  accentClass: string;
  borderClass: string;
  glowClass: string;
  decorationColor: string;
  accentColorHex: string;
  bgGradientStart: string;
  bgGradientEnd: string;
}

export type ExportDimension = 'instagram_story' | 'instagram_square' | 'instagram_portrait' | 'hd_wallpaper';

export interface ExportConfig {
  dimension: ExportDimension;
  includeExplanation: boolean;
  frameStyle: 'islamic_arch' | 'arabesque_border' | 'minimal_gold' | 'none';
  backgroundTexture: 'parchment' | 'solid' | 'marble' | 'tile';
}
