'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GuidePrintPage() {
  const router = useRouter()
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    setAppUrl(window.location.origin)
  }, [])

  const loginUrl = appUrl ? `${appUrl}/login` : ''
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(loginUrl || 'https://example.com')}`

  const steps = [
    ['1', 'アカウントを作る', 'QRコードを読み取るか、上のURLをブラウザで開いて、Googleアカウントでログインします。'],
    ['2', '登録する', '「新しく登録する」から表示名と年齢を入力します。保育園コードは空欄のままで大丈夫です。'],
    ['3', '情報を入力する', 'アレルギー・持病・持薬・緊急連絡先・かかりつけ医などを、必要な範囲で入力します。'],
    ['4', '公開する項目を選ぶ', '各項目のそばにある🔓🔒ボタンで、誰でも見られる「公開」か、誰にも見せない「非表示」かを選べます。'],
    ['5', 'NFCタグ・QRコードを準備する', '「NFCタグ / QRコード」ページのURLをNFCタグに書き込むか、QRコードを印刷して貼り付けます。'],
    ['6', '確認する', 'スマホでURL・QRコードを開いて、意図した通りに表示されるか確認しましょう。'],
  ]

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm; size: A4 portrait; }
          .print-root { zoom: 0.9; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 py-8 bg-white font-sans">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-[#1A6640]">
          <div>
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase">おまもりタグ</div>
            <div className="text-2xl font-black text-gray-900 leading-tight">個人でご利用の方向け</div>
            <div className="text-sm text-gray-500">はじめてガイド</div>
          </div>
          <div className="text-4xl">🏷️</div>
        </div>

        {/* QR + URL */}
        <div className="flex gap-6 mb-6 items-start">
          <div className="text-center flex-shrink-0">
            <img src={qrUrl} alt="QR" width={140} height={140} className="rounded-lg border border-gray-200" />
            <div className="text-xs text-gray-400 mt-1">カメラで読み取り</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm text-gray-700 leading-relaxed mb-2">
              保育園などの施設に所属していなくても、お一人（ご家族）でご利用いただけます。
            </div>
            <div className="bg-[#F4F7F5] rounded-lg px-4 py-3">
              <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest">アクセスURL</div>
              <div className="font-mono text-sm text-[#1A6640] break-all font-bold mt-0.5">{loginUrl}</div>
            </div>
          </div>
        </div>

        {/* 手順 */}
        <div className="space-y-3 mb-6">
          {steps.map(([num, title, desc]) => (
            <div key={num} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">{num}</div>
              <div>
                <div className="font-black text-sm text-gray-900 leading-snug">{title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* お守りタグとは */}
        <div className="mb-5 bg-[#1A6640] rounded-xl p-4 text-white flex gap-3 items-start">
          <div className="text-2xl flex-shrink-0 mt-0.5">🏷️</div>
          <div>
            <div className="font-black text-sm mb-1">おまもりタグとは？</div>
            <div className="text-xs leading-relaxed opacity-90">
              バッグやキーホルダーにつける小さなタグです。スマートフォンをかざすだけで、あらかじめ設定した情報にすぐアクセスできます。もしものときに、周りの方へ素早く情報を伝えられます。
            </div>
          </div>
        </div>

        {/* 困ったときは */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <div className="text-xs text-gray-400">お困りの際は info@marunostudio.com までご連絡ください</div>
          <div className="text-xs text-gray-400 font-mono">{loginUrl}</div>
        </div>
      </main>
    </>
  )
}
