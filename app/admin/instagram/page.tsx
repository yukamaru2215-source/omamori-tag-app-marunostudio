'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const THEMES = [
  { id: 'product',   label: '🏷️ 商品紹介',         desc: '特徴・使い方' },
  { id: 'emergency', label: '🚨 もしもの備え',       desc: '緊急時の安心' },
  { id: 'allergy',   label: '🌿 アレルギー共感',     desc: 'アレルギー・持病のある子' },
  { id: 'nfc',       label: '📱 かざすだけ',         desc: 'NFCの便利さ' },
  { id: 'tips',      label: '💡 子育てTips',         desc: '安心して送り出すコツ' },
  { id: 'story',     label: '📖 使用シーン',         desc: 'リアルなイメージストーリー' },
] as const

type ThemeId = typeof THEMES[number]['id']

export default function InstagramPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [theme, setTheme] = useState<ThemeId>('product')
  const [memo, setMemo] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== adminEmail) {
        router.push('/')
      } else {
        setAuthorized(true)
      }
    })
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setCaption('')
    setCopied(false)
    const res = await fetch('/api/generate-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, memo }),
    })
    const { caption } = await res.json()
    setCaption(caption)
    setLoading(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!authorized) return null

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center gap-3 py-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div>
            <div className="text-xs text-[#7A8E80]">管理者ツール</div>
            <div className="font-black text-xl text-[#0E1A12]">Instagram 投稿文を生成</div>
          </div>
        </div>

        {/* テーマ選択 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">投稿テーマを選ぶ</div>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${theme === t.id ? 'border-[#1A6640] bg-[#E6F4EC]' : 'border-[#E0EAE2] bg-[#F4F7F5]'}`}
              >
                <div className={`text-sm font-black ${theme === t.id ? 'text-[#1A6640]' : 'text-[#0E1A12]'}`}>{t.label}</div>
                <div className="text-xs text-[#7A8E80] mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 補足メモ */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <label className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2 block">
            補足メモ <span className="normal-case font-normal text-[#B0C0B8]">（任意）</span>
          </label>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none resize-none"
            rows={3}
            placeholder="例：春の入園シーズンに合わせて、など"
          />
        </div>

        {/* 生成ボタン */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-lg shadow-lg mb-4 disabled:opacity-60"
        >
          {loading ? '生成中...' : '✨ 投稿文を生成する'}
        </button>

        {/* 結果 */}
        {caption && (
          <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest">生成された投稿文</div>
              <button
                onClick={handleCopy}
                className="text-xs bg-[#E6F4EC] text-[#1A6640] px-3 py-1.5 rounded-lg font-bold border border-[#B8D9C8]"
              >
                {copied ? '✓ コピー済み' : '📋 コピー'}
              </button>
            </div>
            <div className="text-sm text-[#0E1A12] leading-relaxed whitespace-pre-wrap">{caption}</div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-[#1A6640] bg-[#F4F7F5] border border-[#E0EAE2]"
            >
              もう一度生成する
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
