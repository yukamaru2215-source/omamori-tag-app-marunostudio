'use client'

import { useEffect } from 'react'
import { FONT_SCALE_MAP, FONT_SCALE_STORAGE_KEY } from './font-size'

export default function FontSizeInit() {
  useEffect(() => {
    const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY)
    document.documentElement.style.fontSize = FONT_SCALE_MAP[saved ?? 'normal'] ?? FONT_SCALE_MAP.normal
  }, [])

  return null
}
