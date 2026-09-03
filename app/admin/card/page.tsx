'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const CARD_COUNT = 8

export default function InsertCardPage() {
  const router = useRouter()
  const [siteUrl, setSiteUrl] = useState('https://tag.marunostudio.com')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(siteUrl + '/')}`
  const displayUrl = siteUrl.replace(/^https?:\/\//, '')

  const features = ['📱 かざすだけ', '🚑 もしもの時も安心', '🔒 公開範囲を選べる']

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; size: A4 portrait; }
          .print-root { max-width: none !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <div className="no-print max-w-[960px] mx-auto px-10 pt-24 pb-4 text-sm text-gray-500 leading-relaxed">
        商品に封入するPOPカードです（105×74mm・A4に8面付け）。カードの端まで印刷されるレイアウトのため、印刷時は「フチなし／全面」に設定するか、PDF保存して印刷会社にご依頼ください。点線に沿って切り取ってご利用ください。
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 pb-10">
        <div className="grid grid-cols-2 w-fit">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="w-[105mm] h-[74.25mm] p-[4mm] border border-dashed border-gray-300 bg-white flex flex-col font-sans overflow-hidden"
            >
              {/* 写真 + 本文 */}
              <div className="flex gap-[3mm] h-[47mm]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/omamoritag.jpg"
                  alt="おまもりタグ"
                  className="w-[32mm] h-full object-cover rounded-[2mm] border border-gray-100 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  {/* ヘッダー */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[16px] leading-none">🏷️</span>
                    <div>
                      <div className="text-[13px] font-black text-[#1A6640] leading-none">おまもりタグ</div>
                      <div className="text-[6.5px] font-bold text-[#5A6E62] mt-0.5 leading-snug">かざすだけで、もしもの安心をひとつ</div>
                    </div>
                  </div>

                  {/* 特徴 */}
                  <div className="flex items-center gap-[1.2mm] flex-wrap">
                    {features.map((f) => (
                      <div key={f} className="bg-[#F4F7F5] rounded-full px-[1.8mm] py-[0.6mm] text-[6px] font-bold text-[#4A6E55] whitespace-nowrap">
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* QR + CTA */}
                  <div className="flex items-center gap-[2.5mm]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="QR" width={52} height={52} className="rounded-sm border border-gray-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[9px] font-black text-[#1A6640] leading-tight">今すぐ登録する</div>
                      <div className="text-[6px] text-gray-600 mt-0.5 leading-snug">①QR読取 ②タグに貼る ③かざす</div>
                      <div className="text-[6px] font-mono font-bold text-[#1A6640] mt-0.5 break-all">{displayUrl}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 注意書き */}
              <div className="text-[6px] text-gray-400 leading-snug mt-[2mm]">
                ※本製品はサブの「おまもり」としてご活用ください。緊急時は必ず医療機関・救急の指示に従ってください。
              </div>

              {/* フッター（ロゴ） */}
              <div className="mt-auto pt-[1.5mm] border-t border-gray-200 flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-[4mm] object-contain" />
                <div className="text-[6px] text-gray-400">info@marunostudio.com</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
