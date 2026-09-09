'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const LABEL_W_MM = 50
const LABEL_H_MM = 25
const COLS = 4
const ROWS_PER_SHEET = 11 // 50mm×4=200mm, 25mm×11=275mm でA4 1枚に収まる

function Label({ qrUrl, hpQrUrl }: { qrUrl: string; hpQrUrl: string }) {
  return (
    <div
      className="border border-dashed border-gray-300 bg-white flex flex-col overflow-hidden"
      style={{ width: `${LABEL_W_MM}mm`, height: `${LABEL_H_MM}mm`, padding: '1.5mm', breakInside: 'avoid' }}
    >
      <div className="flex items-center gap-[1mm] flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt="QR" className="flex-shrink-0" style={{ width: '16mm', height: '16mm' }} />
        <div className="min-w-0 leading-tight flex-1">
          <div className="text-[4.5px] font-bold text-[#4A6E55]">🏷️ おまもりタグ</div>
          <div className="text-[7px] font-black text-[#1A6640] mt-[0.3mm]">使い方ガイド</div>
          <div className="text-[4.5px] text-gray-500 mt-[0.3mm]">QRを読み取ってね</div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center" style={{ width: '9mm' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hpQrUrl} alt="公式ブログQR" style={{ width: '9mm', height: '9mm' }} />
          <div className="text-[4px] text-gray-400 mt-[0.2mm]">公式HP</div>
        </div>
      </div>
      <div className="flex justify-end flex-shrink-0" style={{ marginTop: '0.5mm' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marunostudio-logo.jpg" alt="marunostudio" style={{ height: '2.8mm', objectFit: 'contain' }} />
      </div>
    </div>
  )
}

export default function PackageLabelPage() {
  const router = useRouter()
  const [siteUrl, setSiteUrl] = useState('https://tag.marunostudio.com')
  const [sheets, setSheets] = useState('1')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  const targetUrl = `${siteUrl}/guide/visual`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=2&data=${encodeURIComponent(targetUrl)}`

  const hpUrl = 'https://ameblo.jp/marunostudio/'
  const hpQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=1&data=${encodeURIComponent(hpUrl)}`

  const sheetCount = Math.max(1, Math.min(20, parseInt(sheets, 10) || 1))
  const totalLabels = sheetCount * COLS * ROWS_PER_SHEET

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

      <div className="no-print fixed top-4 right-4 flex items-center gap-2 z-50 bg-white/90 backdrop-blur rounded-2xl p-2 shadow border border-gray-200">
        <label className="text-xs text-gray-500 pl-2">枚数</label>
        <input
          value={sheets}
          onChange={(e) => setSheets(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none"
        />
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm">🖨️ 印刷 / PDF保存</button>
      </div>

      <div className="no-print max-w-[960px] mx-auto px-10 pt-24 pb-4 text-sm text-gray-500 leading-relaxed">
        パッケージ表面に貼る{LABEL_W_MM}×{LABEL_H_MM}mmのQRラベルです（A4に{COLS}×{ROWS_PER_SHEET}＝{COLS * ROWS_PER_SHEET}枚付け）。
        大きいQRの読み取り先は<span className="font-mono text-[#1A6640]">{targetUrl}</span>（画面つき使い方ガイド）、
        右端の小さいQRは<span className="font-mono text-[#1A6640]">{hpUrl}</span>（公式HP）です。
        印刷時は「フチなし／全面」に設定するか、PDF保存して印刷会社・ラベルシールにご依頼ください。点線に沿って切り取ってご利用ください。
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 pb-10">
        <div
          className="grid w-fit"
          style={{ gridTemplateColumns: `repeat(${COLS}, ${LABEL_W_MM}mm)` }}
        >
          {Array.from({ length: totalLabels }, (_, i) => (
            <Label key={i} qrUrl={qrUrl} hpQrUrl={hpQrUrl} />
          ))}
        </div>
      </main>
    </>
  )
}
