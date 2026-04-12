'use client'

import { useRouter } from 'next/navigation'

// ── 名称はここで変更 ──────────────────────────
const PRODUCT_A_NAME = 'スタッフ用タグ'
const PRODUCT_A_DESC = '保育士がスマートフォンをかざすだけで保育士専用ページにアクセスできるタグです。'

const PRODUCT_B_NAME = '閲覧キータグ'
const PRODUCT_B_DESC = 'お子様の詳細な医療情報・個人情報を開くための鍵となるタグです。'
// ────────────────────────────────────────────

export default function FlyerStaffPage() {
  const router = useRouter()

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
          <div>
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase">おまもりタグ</div>
            <div className="text-xl font-black text-gray-900 leading-tight">園・スタッフ向けオプションタグ</div>
            <div className="text-xs text-gray-500 mt-0.5">保育士・スタッフの方へ</div>
          </div>
          <div className="text-3xl">🏷️</div>
        </div>

        {/* リード文 */}
        <div className="bg-[#F4F7F5] rounded-xl px-5 py-3 mb-6 text-sm text-gray-700 leading-relaxed">
          おまもりタグには、保育士やスタッフ向けのオプションタグをご用意しています。
          スマートフォンをかざすだけで、必要なページや情報にすぐアクセスできます。
        </div>

        {/* 商品2つ */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          {[
            {
              name: PRODUCT_A_NAME,
              desc: PRODUCT_A_DESC,
              icon: '👩‍🏫',
              uses: ['保育士専用ダッシュボードへのアクセス', '園児一覧・グループ管理', '一斉連絡の送信'],
            },
            {
              name: PRODUCT_B_NAME,
              desc: PRODUCT_B_DESC,
              icon: '🔑',
              uses: ['お子様の詳細な医療情報を表示', 'アレルギー・持病・緊急連絡先', '個人情報保護のための認証キー'],
            },
          ].map(({ name, desc, icon, uses }) => (
            <div key={name} className="border-2 border-[#1A6640] rounded-2xl overflow-hidden">
              <div className="bg-[#1A6640] px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="font-black text-white text-base">{name}</div>
              </div>
              <div className="px-4 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/omamoritag.jpg"
                  alt={name}
                  className="w-full h-32 object-contain mb-3 rounded-xl border border-gray-100"
                />
                <div className="text-xs text-gray-600 leading-relaxed mb-3">{desc}</div>
                <ul className="space-y-1 mb-4">
                  {uses.map((u) => (
                    <li key={u} className="flex gap-1.5 text-xs text-gray-700">
                      <span className="text-[#1A6640] font-bold flex-shrink-0">✓</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#E6F4EC] rounded-xl px-4 py-2 text-center border border-[#1A6640]">
                  <div className="text-xs text-[#7A8E80] font-bold">価格</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-black text-[#1A6640]">300</span>
                    <span className="text-sm font-bold text-[#1A6640]">円</span>
                    <span className="text-xs text-[#4A6E55]">（税込）</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 注文方法 */}
        <div className="bg-[#F4F7F5] rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">✉</div>
            <div className="text-sm font-black text-gray-900">ご注文方法</div>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed ml-7">
            ご希望の商品・個数を<span className="font-bold text-[#1A6640]">園の担当者</span>にお伝えください。
            まとめてご注文・納品いたします。
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <div className="text-xs text-gray-400 font-bold">おまもりタグ</div>
          <div className="text-xs text-gray-400">お子様の安心を、いつも手元に。</div>
        </div>
      </main>
    </>
  )
}
