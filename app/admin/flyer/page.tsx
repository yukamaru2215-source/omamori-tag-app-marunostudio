'use client'

import { useRouter } from 'next/navigation'

const ORDER_FORM_URL = 'https://forms.gle/WC5m49J9ZpXoCBNT6'

export default function FlyerPage() {
  const router = useRouter()
  const formUrl: string = ORDER_FORM_URL || '#'
  const qrUrl = ORDER_FORM_URL
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=4&data=${encodeURIComponent(ORDER_FORM_URL)}`
    : null

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm; size: A4 portrait; }
          .print-root { zoom: 0.78; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <main className="print-root max-w-[960px] mx-auto px-10 py-6 bg-white font-sans">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#1A6640]">
          <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase">おまもりタグ</div>
          <div className="text-xs text-gray-400">保護者向け</div>
        </div>

        {/* メインビジュアル */}
        <div className="flex gap-8 mb-6 items-center">
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/omamoritag.jpg"
              alt="おまもりタグ"
              className="w-56 h-56 object-contain rounded-2xl border border-gray-100"
            />
          </div>

          <div className="flex-1">
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase mb-2">新登場</div>
            <div className="text-sm text-gray-600 font-bold mb-1">かざしてひらく、デジタルカルテ</div>
            <div className="text-4xl font-black text-gray-900 leading-tight mb-4">おまもりタグ</div>

            <div className="space-y-2 mb-5">
              {[
                ['📱', 'スマホをかざすだけ', 'NFCタグにスマートフォンをかざせばすぐに医療情報にアクセスできます'],
                ['🚑', 'もしもの時に安心', 'アレルギー・持病・緊急連絡先をいつでもすぐに確認できます'],
                ['🔒', '大切な情報は保育士のみ', '詳細な医療情報は保育士だけが閲覧できるので安心です'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <span className="text-sm font-black text-gray-900">{title}　</span>
                    <span className="text-xs text-gray-500">{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#E6F4EC] rounded-2xl px-5 py-3 inline-block border-2 border-[#1A6640]">
              <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-0.5">価格</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#1A6640]">500</span>
                <span className="text-lg font-bold text-[#1A6640]">円</span>
                <span className="text-xs text-[#4A6E55] ml-1">（税込・書き込み済み）</span>
              </div>
            </div>
          </div>
        </div>

        {/* 使い方の流れ */}
        <div className="bg-[#F4F7F5] rounded-2xl p-5 mb-6">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-4 text-center">使い方</div>
          <div className="flex items-center justify-between gap-2">
            {[
              ['📲', 'アプリに登録', 'お子様の医療情報を入力'],
              ['🏷️', 'タグをつける', '持ち物やランドセルに'],
              ['📱', 'かざして確認', 'スマホで即アクセス'],
            ].map(([icon, title, desc], i, arr) => (
              <div key={title} className="flex items-center gap-2 flex-1">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs font-black text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-[#1A6640] font-black text-lg flex-shrink-0">›</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 注文方法 */}
        <div className="flex gap-6 items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">✉</div>
              <div className="text-sm font-black text-gray-900">ご注文方法</div>
            </div>
            <div className="space-y-2 ml-7">
              {[
                ['①', 'QRコードを読み取るか、下のURLからフォームを開く'],
                ['②', 'お名前・園名・ご希望個数を入力して送信'],
                ['③', '担当者よりご連絡します'],
              ].map(([step, text]) => (
                <div key={step} className="flex gap-2 items-start">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">{step}</div>
                  <div className="text-xs text-gray-700 leading-snug">{text}</div>
                </div>
              ))}
            </div>

            {formUrl !== '#' && (
              <div className="ml-7 mt-3 bg-[#F4F7F5] rounded-xl px-3 py-2">
                <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-0.5">注文フォームURL</div>
                <div className="font-mono text-xs text-[#1A6640] break-all font-bold">{formUrl}</div>
              </div>
            )}

            {!ORDER_FORM_URL && (
              <div className="ml-7 mt-3 bg-[#FFF8E6] rounded-xl px-3 py-2 border border-[#F0D080]">
                <div className="text-xs text-[#8B6914]">※ 注文フォームのURLは準備中です</div>
              </div>
            )}
          </div>

          {qrUrl && (
            <div className="flex-shrink-0 text-center">
              <img src={qrUrl} alt="注文フォームQR" width={110} height={110} className="rounded-xl border border-gray-200" />
              <div className="text-xs text-gray-400 mt-1">注文フォーム</div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <div className="text-xs text-gray-400 font-bold">おまもりタグ</div>
          <div className="text-xs text-gray-400">お子様の安心を、いつも手元に。</div>
        </div>
        <div className="mt-2 text-[10px] text-gray-300 leading-relaxed">
          ※本製品はサブの「おまもり」としてご活用ください。緊急時は自己判断せず、必ず医療機関・救急の指示に従ってください。登録情報（古い情報・誤った情報を含む）の管理は保護者の責任となります。ネットワーク障害等により緊急時に閲覧できない場合があります。3Dプリント特有の積層痕・高温変形およびNFC通信の限界（ケース干渉・金属面等）は保証対象外です。
        </div>
      </main>
    </>
  )
}
