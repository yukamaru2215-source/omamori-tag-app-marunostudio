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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

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

        {/* 一般向け */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
            🏷️ 一般向けURL（NFCタグ・QRコード用）
          </div>
          <div className="text-sm text-[#7A8E80] mb-3">
            このURLをNFCタグに書き込むか、QRコードを印刷してバッグにつけてください。
            誰でもアレルギー・持病・エピペン情報を確認できます。
          </div>
          <div className="bg-[#F4F7F5] rounded-xl px-4 py-3 text-sm font-mono text-[#0E1A12] break-all mb-3 border border-[#E0EAE2]">
            {kidUrl}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyUrl(kidUrl)}
              className="flex-1 bg-[#1A6640] text-white py-3 rounded-xl font-bold text-sm"
            >
              {copied ? '✓ コピーしました' : '📋 URLをコピー'}
            </button>
            
              href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(kidUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#E6F4EC] text-[#1A6640] py-3 rounded-xl font-bold text-sm text-center"
            >
              📱 QRコードを表示
            </a>
          </div>
        </div>

        {/* QRコード表示 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4 text-center">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-4">
            QRコードプレビュー
          </div>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(kidUrl)}`}
            alt="QRコード"
            className="mx-auto rounded-xl"
            width={200}
            height={200}
          />
          <div className="text-xs text-[#7A8E80] mt-3">{child.display_name} の医療情報QRコード</div>
        </div>

        {/* NFC書き込み手順 */}
        <div className="bg-[#EBF0FA] rounded-2xl p-5 border border-[#A0BCE8]">
          <div className="text-xs font-black text-[#1A50A0] uppercase tracking-widest mb-3">
            📖 NFCタグへの書き込み手順
          </div>
          <div className="space-y-2 text-sm text-[#1A50A0]">
            <div>① スマホに「NFC Tools」アプリをインストール</div>
            <div>② アプリで「書き込み」→「URL」を選択</div>
            <div>③ 上記URLを入力</div>
            <div>④ スマホをNFCタグにかざして書き込み完了</div>
            <div>⑤ キーホルダーやバッグに取り付ける</div>
          </div>
        </div>
      </div>
    </main>
  )
}