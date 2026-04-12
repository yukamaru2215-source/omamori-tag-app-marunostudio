'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Nursery = {
  name: string
  code: string | null
}

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [nursery, setNursery] = useState<Nursery | null>(null)
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    setAppUrl(window.location.origin)
    supabase
      .from('nurseries')
      .select('name, code')
      .eq('id', id)
      .single()
      .then(({ data }) => { if (data) setNursery(data) })
  }, [id])

  if (!nursery) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-400">読み込み中...</div>
    </div>
  )

  const loginUrl = `${appUrl}/login`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(loginUrl)}`

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 10mm; size: A4 portrait; }
          .print-root { zoom: 0.88; }
        }
      `}</style>

      {/* 印刷・戻るボタン */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => router.back()}
          className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow"
        >
          ← 戻る
        </button>
        <button
          onClick={() => window.print()}
          className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow"
        >
          🖨️ 印刷 / PDF保存
        </button>
      </div>

      {/* ── 印刷コンテンツ ── */}
      <main className="print-root max-w-[640px] mx-auto px-8 py-7 bg-white min-h-screen font-sans">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-[#1A6640]">
          <div>
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase mb-0.5">おまもりタグ</div>
            <div className="text-xl font-black text-gray-900">{nursery.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">保護者向け はじめてガイド</div>
          </div>
          <div className="text-3xl">🏷️</div>
        </div>

        {/* QRコード + 園コード */}
        <div className="flex gap-6 mb-5 items-start">
          <div className="text-center flex-shrink-0">
            <img
              src={qrUrl}
              alt="QRコード"
              width={140}
              height={140}
              className="rounded-xl border border-gray-200"
            />
            <div className="text-xs text-gray-500 mt-1">カメラで読み取り</div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="bg-[#F4F7F5] rounded-xl px-4 py-3">
              <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-1">アクセスURL</div>
              <div className="font-mono text-sm text-[#1A6640] break-all font-bold">{loginUrl}</div>
            </div>
            {nursery.code && (
              <div className="bg-[#E6F4EC] rounded-xl px-4 py-3 border-2 border-[#1A6640]">
                <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-1">園コード</div>
                <div className="font-mono text-3xl font-black text-[#1A6640] tracking-wider">{nursery.code}</div>
                <div className="text-xs text-[#4A6E55] mt-0.5">登録時に入力してください</div>
              </div>
            )}
          </div>
        </div>

        {/* 登録手順 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">1</div>
            <div className="text-sm font-black text-gray-900">アプリの登録方法</div>
          </div>

          <div className="space-y-2 ml-7">
            {[
              { step: '①', text: 'QRコードを読み取るか、上のURLをブラウザで開く' },
              { step: '②', text: '「はじめての方はこちら」からメールアドレスとパスワードを登録する' },
              { step: '③', text: `「園コード」の欄に ${nursery.code ?? '（園コードを入力）'} と入力する` },
              { step: '④', text: 'お子様の名前・年齢・アレルギーなどの情報を入力する' },
              { step: '⑤', text: 'お子様のページに表示されるQRコードをNFCタグに書き込む（任意）' },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-2 items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0 mt-0.5">{step}</div>
                <div className="text-xs text-gray-700 leading-relaxed">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ホーム画面追加 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">2</div>
            <div className="text-sm font-black text-gray-900">ホーム画面に追加する（おすすめ）</div>
          </div>

          <div className="ml-7 grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="font-bold text-xs text-gray-800 mb-2">🍎 iPhone の場合</div>
              <ol className="space-y-1.5">
                {[
                  'Safari でアプリを開く',
                  '下部の共有ボタン（□↑）をタップ',
                  '「ホーム画面に追加」を選ぶ',
                  '「追加」をタップして完了',
                ].map((t, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-gray-600">
                    <span className="font-bold text-[#1A6640] flex-shrink-0">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="font-bold text-xs text-gray-800 mb-2">🤖 Android の場合</div>
              <ol className="space-y-1.5">
                {[
                  'Chrome でアプリを開く',
                  '右上のメニュー（⋮）をタップ',
                  '「ホーム画面に追加」を選ぶ',
                  '「追加」をタップして完了',
                ].map((t, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-gray-600">
                    <span className="font-bold text-[#1A6640] flex-shrink-0">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="ml-7 bg-[#E6F4EC] rounded-xl px-3 py-2 text-xs text-[#4A6E55]">
            ホーム画面に追加すると、連絡が届いたときに<span className="font-bold">プッシュ通知</span>でお知らせします。
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <div className="text-xs text-gray-400">{nursery.name} ／ おまもりタグ</div>
          <div className="text-xs text-gray-400 font-mono">{loginUrl}</div>
        </div>
      </main>
    </>
  )
}
