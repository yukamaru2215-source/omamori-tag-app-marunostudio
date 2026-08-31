'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const CARD_COUNT = 4

export default function InsertCardPage() {
  const router = useRouter()
  const [siteUrl, setSiteUrl] = useState('https://tag.marunostudio.com')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(siteUrl + '/')}`
  const displayUrl = siteUrl.replace(/^https?:\/\//, '')

  const steps = [
    'QRを読み取って登録',
    'タグに貼りつける',
    'かざせばすぐ表示される',
  ]

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 15mm; size: A4 portrait; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <div className="no-print max-w-[960px] mx-auto px-10 pt-24 pb-4 text-sm text-gray-500">
        商品に封入する説明カードです（名刺サイズ・A4に4面付け）。印刷後、点線に沿って切り取ってご利用ください。
      </div>

      <main className="max-w-[960px] mx-auto px-10 pb-10">
        <div className="grid grid-cols-2 gap-x-[10mm] gap-y-[10mm] justify-center">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="w-[91mm] h-[55mm] p-[4mm] bg-white border border-dashed border-gray-300 rounded-[2mm] flex flex-col font-sans"
            >
              {/* ヘッダー */}
              <div className="flex items-center gap-1">
                <span className="text-[14px] leading-none">🏷️</span>
                <span className="text-[12px] font-black text-[#1A6640] leading-none">おまもりタグ</span>
              </div>
              <div className="text-[7px] text-gray-500 leading-snug mt-1">
                アレルギー・持病をすぐに共有できるタグです
              </div>

              {/* QR + 手順 */}
              <div className="flex gap-3 items-center mt-2 flex-1">
                <div className="flex-shrink-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="QR" width={98} height={98} className="rounded-sm border border-gray-200" />
                </div>
                <div className="flex-1 space-y-1.5">
                  {steps.map((s, idx) => (
                    <div key={s} className="flex gap-1 items-start">
                      <span className="w-3 h-3 rounded-full bg-[#1A6640] text-white text-[6px] font-black flex items-center justify-center flex-shrink-0 mt-[1px]">
                        {idx + 1}
                      </span>
                      <span className="text-[7px] text-gray-700 leading-snug">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* フッター */}
              <div className="mt-1 pt-1 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[6px] font-mono font-bold text-[#1A6640]">{displayUrl}</span>
                <span className="text-[6px] text-gray-400">info@marunostudio.com</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
