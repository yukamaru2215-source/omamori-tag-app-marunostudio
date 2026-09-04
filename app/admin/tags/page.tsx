'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Tag } from '@/lib/types'

export default function AdminTagsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')

  const [tags, setTags] = useState<Tag[]>([])
  const [count, setCount] = useState('10')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [newlyGeneratedIds, setNewlyGeneratedIds] = useState<string[] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrId, setQrId] = useState<string | null>(null)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== adminEmail) { router.push('/'); return }
      setAuthorized(true)
      await loadTags()
      setLoading(false)
    }
    init()
  }, [])

  async function loadTags() {
    const { data } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false })
    setTags(data ?? [])
  }

  async function handleGenerate() {
    const n = parseInt(count, 10)
    if (!n || n < 1 || n > 200) { setGenerateError('1〜200の数で指定してください'); return }
    setGenerating(true)
    setGenerateError('')
    setNewlyGeneratedIds(null)

    try {
      const res = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: n }),
      })
      const json = await res.json()
      if (!res.ok) {
        setGenerateError(json.error ?? 'タグの発行に失敗しました')
      } else {
        setNewlyGeneratedIds(json.tags.map((t: { id: string }) => t.id))
        await loadTags()
      }
    } catch {
      setGenerateError('通信エラーが発生しました')
    }
    setGenerating(false)
  }

  function tagUrl(id: string) {
    return `${baseUrl}/tag/${id}`
  }

  function copyUrl(id: string) {
    navigator.clipboard.writeText(tagUrl(id))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (!authorized) return null

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A8E80]">管理者画面</div>
            <div className="font-black text-xl text-[#0E1A12]">NFCタグ発行</div>
          </div>
          <button onClick={() => router.push('/admin')} className="text-sm text-[#7A8E80] border border-[#E0EAE2] px-3 py-2 rounded-xl bg-white">← 戻る</button>
        </div>

        {/* 新規発行 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-6">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">🏷️ 新しいタグを発行</div>
          <div className="text-sm text-[#7A8E80] mb-3">個数を指定して発行すると、それぞれ固有のIDが割り当てられます。発行後、各URLをNFC Toolsアプリで物理タグに書き込んでください。</div>
          <div className="flex gap-2 mb-3">
            <input
              value={count}
              onChange={e => setCount(e.target.value.replace(/[^0-9]/g, ''))}
              type="number"
              min={1}
              max={200}
              className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：10"
            />
            <button onClick={handleGenerate} disabled={generating} className="bg-[#1A6640] text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {generating ? '発行中...' : '発行する'}
            </button>
          </div>
          {generateError && <div className="text-xs text-[#B83030]">{generateError}</div>}

          {newlyGeneratedIds && (
            <div className="mt-3 bg-[#E6F4EC] rounded-xl px-4 py-3">
              <div className="text-xs font-bold text-[#1A6640] mb-1">✅ {newlyGeneratedIds.length}件発行しました</div>
              <div className="text-xs text-[#4A6E55] mb-3">下の一覧の先頭に追加されています。1件ずつ「QR」でURLを確認しながら書き込んでください。</div>
              <button
                onClick={() => window.open(`/admin/card?ids=${newlyGeneratedIds.join(',')}`, '_blank')}
                className="w-full bg-[#1A6640] text-white py-2 rounded-xl font-bold text-xs"
              >
                📇 このタグに合わせた封入カードを印刷
              </button>
            </div>
          )}
        </div>

        {/* 一覧 */}
        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
          発行済みタグ（{tags.length}件）
        </div>

        {tags.map((tag) => {
          const isNew = newlyGeneratedIds?.includes(tag.id)
          return (
            <div key={tag.id} className={`bg-white rounded-2xl border shadow-sm mb-3 p-4 ${isNew ? 'border-[#1A6640]' : 'border-[#E0EAE2]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-sm font-bold text-[#0E1A12]">{tag.id}</div>
                {tag.child_id ? (
                  <span className="text-xs font-bold text-[#1A6640] bg-[#E6F4EC] px-2 py-1 rounded-full">✅ 登録済み</span>
                ) : (
                  <span className="text-xs font-bold text-[#7A8E80] bg-[#F4F7F5] px-2 py-1 rounded-full">未登録</span>
                )}
              </div>
              <div className="text-xs text-[#7A8E80] font-mono break-all mb-3">{tagUrl(tag.id)}</div>
              <div className="flex gap-2">
                <button onClick={() => copyUrl(tag.id)} className="flex-1 bg-[#F4F7F5] text-[#1A6640] py-2 rounded-xl font-bold text-xs border border-[#E0EAE2]">
                  {copiedId === tag.id ? '✓ コピー済み' : '📋 URLをコピー'}
                </button>
                <button onClick={() => setQrId(qrId === tag.id ? null : tag.id)} className="flex-1 bg-[#EBF0FA] text-[#1A50A0] py-2 rounded-xl font-bold text-xs">
                  📱 QRコード
                </button>
              </div>
              {qrId === tag.id && baseUrl && (
                <div className="mt-3 text-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(tagUrl(tag.id))}`} alt="QRコード" className="mx-auto rounded-xl" width={180} height={180} />
                </div>
              )}
            </div>
          )
        })}

        {tags.length === 0 && (
          <div className="text-sm text-[#7A8E80] bg-white rounded-2xl p-5 border border-[#E0EAE2] text-center">
            まだタグが発行されていません
          </div>
        )}
      </div>
    </main>
  )
}
