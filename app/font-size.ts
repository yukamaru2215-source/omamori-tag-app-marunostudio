export const FONT_SCALE_STORAGE_KEY = 'font_scale'

export const FONT_SCALE_LEVELS = [
  { key: 'normal', label: 'あ', scale: '100%' },
  { key: 'large', label: 'あ+', scale: '115%' },
  { key: 'xlarge', label: 'あ++', scale: '130%' },
] as const

export type FontScaleKey = typeof FONT_SCALE_LEVELS[number]['key']

export const FONT_SCALE_MAP: Record<string, string> = Object.fromEntries(
  FONT_SCALE_LEVELS.map(l => [l.key, l.scale])
)
