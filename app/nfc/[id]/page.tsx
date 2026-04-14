'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Child } from '@/lib/types'

export default function NFCPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')
  const [reissuing, setReissuing] = useState(false)
  const [reissued, setReissued] = useState(false)

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .eq('parent_id', session.user.id)
        .single()
      if (!data) { router.push('/dashboard'); return }
      setChild(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleReissueSlug() {
    if (!child) return
    if (!confirm('URLを再発行しますか？\n\n古いURLは無効になり、NFCタグへの書き直しが必要になります。\nこの操作は取り消せません。')) return
    setReissuing(true)
    const newSlug = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(36).padStart(2, '0')).join('')
    const { data, error } = await supabase
      .from('children')
      .update({ slug: newSlug })
      .eq('id', id)
      .select('*')
      .single()
    if (error || !data) {
      alert('再発行に失敗しました')
      setReissuing(false)
      return
    }
    setChild(data)
    setReissued(true)
    setReissuing(false)
    setTimeout(() => setReissued(false), 3000)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (!child) return null

  const kidUrl = `${baseUrl}/kid/${child.slug}`

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center gap-3 py-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">NFCタグ / QRコード</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">🏷️ 一般向けURL</div>
          <div className="text-sm text-[#7A8E80] mb-3">このURLをNFCタグに書き込むか、QRコードを印刷してバッグにつけてください。</div>
          <div className="bg-[#F4F7F5] rounded-xl px-4 py-3 text-sm font-mono text-[#0E1A12] break-all mb-3 border border-[#E0EAE2]">{kidUrl}</div>
          <div className="flex gap-2">
            <button onClick={() => copyUrl(kidUrl)} className="flex-1 bg-[#1A6640] text-white py-3 rounded-xl font-bold text-sm">
              {copied ? '✓ コピーしました' : '📋 URLをコピー'}
            </button>
            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(kidUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#E6F4EC] text-[#1A6640] py-3 rounded-xl font-bold text-sm text-center">📱 QRコード</a>
          </div>
        </div>

        {/* URL再発行 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🔄 URLを再発行する</div>
          <div className="text-xs text-[#7A8E80] leading-relaxed mb-4">
            タグを紛失した場合など、現在のURLを完全に無効化して新しいURLを発行できます。<br />
            <span className="text-[#B83030] font-bold">再発行後はNFCタグへの書き直しが必要です。</span>
          </div>
          <button
            onClick={handleReissueSlug}
            disabled={reissuing}
            className={`w-full py-3 rounded-xl font-bold text-sm border ${reissued ? 'bg-[#E6F4EC] text-[#1A6640] border-[#B8D9C8]' : 'bg-[#FCEAEA] text-[#B83030] border-[#E8AAAA]'} disabled:opacity-50`}
          >
            {reissuing ? '処理中...' : reissued ? '✓ 新しいURLを発行しました' : '⚠️ URLを再発行する（旧URLは無効になります）'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4 text-center">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-4">QRコードプレビュー</div>
          {baseUrl && (
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(kidUrl)}`} alt="QRコード" className="mx-auto rounded-xl" width={200} height={200} />
          )}
          <div className="text-xs text-[#7A8E80] mt-3">{child.display_name} の医療情報QRコード</div>
        </div>

        <div className="bg-[#EBF0FA] rounded-2xl p-5 border border-[#A0BCE8]">
          <div className="text-xs font-black text-[#1A50A0] uppercase tracking-widest mb-3">📖 NFCタグへの書き込み手順</div>
          <div className="space-y-2 text-sm text-[#1A50A0]">
            <div>① 「NFC Tools」アプリをインストール</div>
            <div>② 「書き込み」→「URL」を選択</div>
            <div>③ 上記URLを入力</div>
            <div>④ スマホをNFCタグにかざして書き込み</div>
            <div>⑤ キーホルダーやバッグに取り付ける</div>
          </div>
        </div>
      </div>
    </main>
  )
}