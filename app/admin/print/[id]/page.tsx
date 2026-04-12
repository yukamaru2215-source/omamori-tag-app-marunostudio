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
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(loginUrl)}`

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 12mm; size: A4 portrait; }
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
      <main className="max-w-[680px] mx-auto px-8 py-10 bg-white min-h-screen font-sans">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b-2 border-[#1A6640]">
          <div>
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase mb-1">おまもりタグ</div>
            <div className="text-2xl font-black text-gray-900">{nursery.name}</div>
            <div className="text-sm text-gray-500 mt-1">保護者向け はじめてガイド</div>
          </div>
          <div className="text-4xl">🏷️</div>
        </div>

        {/* QRコード + 園コード */}
        <div className="flex gap-8 mb-8 items-start">
          <div className="text-center flex-shrink-0">
            <img
              src={qrUrl}
              alt="QRコード"
              width={160}
              height={160}
              className="rounded-xl border border-gray-200"
            />
            <div className="text-xs text-gray-500 mt-2">カメラで読み取り</div>
          </div>

          <div className="flex-1">
            <div className="bg-[#F4F7F5] rounded-2xl p-5 mb-4">
              <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-2">アクセスURL</div>
              <div className="font-mono text-sm text-[#1A6640] break-all font-bold">{loginUrl}</div>
            </div>
            {nursery.code && (
              <div className="bg-[#E6F4EC] rounded-2xl p-5 border-2 border-[#1A6640]">
                <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-1">園コード</div>
                <div className="font-mono text-4xl font-black text-[#1A6640] tracking-wider">{nursery.code}</div>
                <div className="text-xs text-[#4A6E55] mt-1">登録時に入力してください</div>
              </div>
            )}
          </div>
        </div>

        {/* 登録手順 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">1</div>
            <div className="text-base font-black text-gray-900">アプリの登録方法</div>
          </div>

          <div className="space-y-3 ml-8">
            {[
              { step: '①', text: 'QRコードを読み取るか、上のURLをブラウザで開く' },
              { step: '②', text: '「はじめての方はこちら」からメールアドレスとパスワードを登録する' },
              { step: '③', text: `「園コード」の欄に ${nursery.code ?? '（園コードを入力）'} と入力する` },
              { step: '④', text: 'お子様の名前・年齢・アレルギーなどの情報を入力する' },
              { step: '⑤', text: 'お子様のページに表示されるQRコードをNFCタグに書き込む（任意）' },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0 mt-0.5">{step}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ホーム画面追加 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">2</div>
            <div className="text-base font-black text-gray-900">ホーム画面に追加する（おすすめ）</div>
          </div>

          <div className="ml-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="font-bold text-sm text-gray-800 mb-3">🍎 iPhone の場合</div>
              <ol className="space-y-2">
                {[
                  'Safari でアプリを開く',
                  '画面下部の共有ボタン（四角から矢印）をタップ',
                  '「ホーム画面に追加」を選ぶ',
                  '「追加」をタップして完了',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="font-bold text-[#1A6640] flex-shrink-0">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="font-bold text-sm text-gray-800 mb-3">🤖 Android の場合</div>
              <ol className="space-y-2">
                {[
                  'Chrome でアプリを開く',
                  '右上のメニュー（⋮）をタップ',
                  '「ホーム画面に追加」を選ぶ',
                  '「追加」をタップして完了',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="font-bold text-[#1A6640] flex-shrink-0">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="ml-8 mt-3 bg-[#E6F4EC] rounded-xl px-4 py-3 text-xs text-[#4A6E55]">
            ホーム画面に追加すると、連絡が届いたときに<span className="font-bold">プッシュ通知</span>でお知らせします。
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 pt-5 flex items-center justify-between">
          <div className="text-xs text-gray-400">{nursery.name} ／ おまもりタグ</div>
          <div className="text-xs text-gray-400 font-mono">{loginUrl}</div>
        </div>
      </main>
    </>
  )
}
