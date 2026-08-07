'use client'

import { useEffect, useState } from 'react'
import { FONT_SCALE_LEVELS, FONT_SCALE_STORAGE_KEY, FontScaleKey } from '../font-size'

export default function FontSizeToggle() {
  const [level, setLevel] = useState<FontScaleKey>('normal')

  useEffect(() => {
    const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY) as FontScaleKey | null
    if (saved && FONT_SCALE_LEVELS.some(l => l.key === saved)) setLevel(saved)
  }, [])

  function cycle() {
    const idx = FONT_SCALE_LEVELS.findIndex(l => l.key === level)
    const next = FONT_SCALE_LEVELS[(idx + 1) % FONT_SCALE_LEVELS.length]
    setLevel(next.key)
    document.documentElement.style.fontSize = next.scale
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, next.key)
  }

  const current = FONT_SCALE_LEVELS.find(l => l.key === level)!

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex-shrink-0 h-9 px-3 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#1A6640] font-black text-sm"
      title="文字の大きさを切り替える"
      aria-label="文字の大きさを切り替える"
    >
      {current.label}
    </button>
  )
}
