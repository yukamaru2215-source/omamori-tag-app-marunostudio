'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CARDS_PER_PAGE = 8
const FEATURES = ['📱 かざすだけ', '🚑 もしもの時も安心', '🔒 公開範囲を選べる']

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function Card({ id, siteUrl }: { id: string | null; siteUrl: string }) {
  const targetUrl = id ? `${siteUrl}/tag/${id}` : `${siteUrl}/`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(targetUrl)}`
  const displayUrl = targetUrl.replace(/^https?:\/\//, '')

  return (
    <div
      className="w-[105mm] h-[74.25mm] p-[4mm] border border-dashed border-gray-300 bg-white flex flex-col font-sans overflow-hidden"
      style={{ breakInside: 'avoid' }}
    >
      {/* 商品写真（テキスト部分が見えるよう上部を優先してトリミング） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/omamoritag.jpg"
        alt="かざしてひらく、デジタルカルテ。「おまもりタグ」"
        className="w-full h-[30mm] object-cover object-top rounded-[2mm] border border-gray-100 flex-shrink-0"
      />

      {/* ヘッダー */}
      <div className="flex items-center gap-1.5 mt-[2mm]">
        <span className="text-[14px] leading-none">🏷️</span>
        <div>
          <div className="text-[12px] font-black text-[#1A6640] leading-none">おまもりタグ</div>
          <div className="text-[6px] font-bold text-[#5A6E62] mt-0.5 leading-snug">かざすだけで、もしもの安心をひとつ</div>
        </div>
      </div>

      {/* 特徴 */}
      <div className="flex items-center gap-[1.2mm] flex-wrap mt-[1.5mm]">
        {FEATURES.map((f) => (
          <div key={f} className="bg-[#F4F7F5] rounded-full px-[1.6mm] py-[0.5mm] text-[5.5px] font-bold text-[#4A6E55] whitespace-nowrap">
            {f}
          </div>
        ))}
      </div>

      {/* QR + CTA */}
      <div className="mt-[1.5mm] flex items-center gap-[2.5mm]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt="QR" width={44} height={44} className="rounded-sm border border-gray-200 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-[9px] font-black text-[#1A6640] leading-tight">今すぐ登録する</div>
          <div className="text-[5.5px] text-gray-600 mt-0.5 leading-snug">①QR読取 ②タグに貼る ③かざす</div>
          <div className="text-[5.5px] font-mono font-bold text-[#1A6640] mt-0.5 break-all">{displayUrl}</div>
        </div>
      </div>

      {/* フッター（ロゴ） */}
      <div className="mt-auto pt-[1.5mm] border-t border-gray-200 flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-[4mm] object-contain" />
        <div className="text-[5.5px] text-gray-400">
          {id ? `TAG ID: ${id}` : 'info@marunostudio.com'}
        </div>
      </div>
    </div>
  )
}

function InsertCardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')
  const [siteUrl, setSiteUrl] = useState('https://tag.marunostudio.com')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  const tagIds = idsParam
    ? idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const cardIds: (string | null)[] = tagIds.length > 0 ? tagIds : Array.from({ length: CARDS_PER_PAGE }, () => null)
  const pages = chunk(cardIds, CARDS_PER_PAGE)

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
        {tagIds.length > 0 ? (
          <span className="block mt-1 font-bold text-[#1A6640]">
            🏷️ {tagIds.length}件のタグに合わせて、それぞれ固有のQRコードを表示しています。物理タグと同じIDのカードを一緒に封入してください。
          </span>
        ) : (
          <span className="block mt-1">
            タグIDの指定がないため、サイトのトップページに飛ぶ共通QRを表示しています。特定のタグに合わせて発行するには「/admin/tags」で発行後の「封入カードを印刷」から開いてください。
          </span>
        )}
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 pb-10">
        {pages.map((pageCards, pageIndex) => (
          <div
            key={pageIndex}
            className="grid grid-cols-2 w-fit"
            style={pageIndex < pages.length - 1 ? { breakAfter: 'page' } : undefined}
          >
            {pageCards.map((id, i) => (
              <Card key={id ?? i} id={id} siteUrl={siteUrl} />
            ))}
          </div>
        ))}
      </main>
    </>
  )
}

export default function InsertCardPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-[#7A8E80]">読み込み中...</div>
      </main>
    }>
      <InsertCardContent />
    </Suspense>
  )
}
