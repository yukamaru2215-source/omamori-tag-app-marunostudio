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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=2&data=${encodeURIComponent(siteUrl + '/')}`
  const displayUrl = siteUrl.replace(/^https?:\/\//, '')

  const features: [string, string, string][] = [
    ['📱', 'かざすだけ', 'NFC・QRですぐ表示'],
    ['🚑', 'もしもの時も安心', 'アレルギー・持病を共有'],
    ['🔒', '公開範囲を選べる', '見せたい情報だけ公開'],
  ]

  const steps: [string, string, string][] = [
    ['1', '登録する', 'QRから情報を入力'],
    ['2', 'タグに貼る', '持ち物やかばんに'],
    ['3', 'かざす', 'スマホですぐ確認'],
  ]

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
        商品に封入するPOPカードです（A6サイズ＝A5の半分・A4に4面付け）。カードの端まで印刷されるレイアウトのため、印刷時は「フチなし／全面」に設定するか、PDF保存して印刷会社にご依頼ください。点線に沿って切り取ってご利用ください。
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 pb-10">
        <div className="grid grid-cols-2 w-fit">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="w-[105mm] h-[148.5mm] p-[6mm] border border-dashed border-gray-300 bg-white flex flex-col font-sans overflow-hidden"
            >
              {/* ヘッダー */}
              <div className="flex items-center gap-2">
                <span className="text-[26px] leading-none">🏷️</span>
                <div>
                  <div className="text-[20px] font-black text-[#1A6640] leading-none">おまもりタグ</div>
                  <div className="text-[9px] font-bold text-[#5A6E62] mt-1 leading-snug">かざすだけで、もしもの安心をひとつ</div>
                </div>
              </div>

              {/* 商品写真 */}
              <div className="mt-[3mm]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/omamoritag.jpg"
                  alt="おまもりタグ"
                  className="w-full h-[28mm] object-cover rounded-[2mm] border border-gray-100"
                />
              </div>

              {/* できること */}
              <div className="flex items-start justify-between mt-[3mm] gap-[2mm]">
                {features.map(([icon, title, desc]) => (
                  <div key={title} className="text-center flex-1">
                    <div className="text-[16px] leading-none">{icon}</div>
                    <div className="text-[8px] font-black text-gray-900 mt-1 leading-snug">{title}</div>
                    <div className="text-[6.5px] text-gray-500 mt-0.5 leading-snug">{desc}</div>
                  </div>
                ))}
              </div>

              {/* 3ステップ */}
              <div className="flex items-start justify-between mt-[3mm] bg-[#FBFAF6] rounded-[3mm] px-[2mm] py-[2mm]">
                {steps.map(([num, title, desc]) => (
                  <div key={title} className="text-center flex-1 px-[1mm]">
                    <div className="w-[5mm] h-[5mm] mx-auto rounded-full bg-[#1A6640] text-white text-[9px] font-black flex items-center justify-center leading-none">{num}</div>
                    <div className="text-[9px] font-black text-gray-900 mt-1.5 leading-snug">{title}</div>
                    <div className="text-[6.5px] text-gray-500 mt-0.5 leading-snug">{desc}</div>
                  </div>
                ))}
              </div>

              {/* QR + CTA */}
              <div className="mt-[3mm] bg-[#F4F7F5] rounded-[3mm] p-[3mm] flex items-center gap-[3mm]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR" width={100} height={100} className="rounded-sm border border-gray-200 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[12px] font-black text-[#1A6640] leading-tight">今すぐ登録する</div>
                  <div className="text-[7px] text-gray-500 mt-1 leading-relaxed">QRを読み取ってブラウザから登録できます（無料）</div>
                  <div className="text-[7px] font-mono font-bold text-[#1A6640] mt-1.5 break-all">{displayUrl}</div>
                </div>
              </div>

              {/* 注意書き */}
              <div className="text-[6px] text-gray-400 leading-relaxed mt-[2mm]">
                ※本製品はサブの「おまもり」としてご活用ください。緊急時は自己判断せず、必ず医療機関・救急の指示に従ってください。
              </div>

              {/* フッター（ロゴ） */}
              <div className="mt-auto pt-[2mm] border-t border-gray-200 flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-[5mm] object-contain" />
                <div className="text-[6.5px] text-gray-400">info@marunostudio.com</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
