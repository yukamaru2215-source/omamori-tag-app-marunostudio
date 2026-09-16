'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zen_Maru_Gothic, Noto_Sans_JP } from 'next/font/google'

const zenMaru = Zen_Maru_Gothic({ weight: '900', variable: '--font-zen-maru' })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700', '900'], variable: '--font-noto-sans-jp' })

function MiniPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-[#131614] rounded-[18px] p-[5px] pt-[9px] shadow-sm w-[162px] shrink-0">
      <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-9 h-2 bg-[#131614] rounded-b-md z-10" />
      <div className="bg-[#F4F7F5] rounded-[13px] overflow-hidden">
        <div className="flex justify-between px-2 pt-1 text-[6.5px] font-bold text-gray-800">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="p-1.5">{children}</div>
      </div>
    </div>
  )
}

function Pin({ n }: { n: number }) {
  return (
    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A83A34] text-white text-[9px] font-black flex items-center justify-center shadow">
      {n}
    </span>
  )
}

export default function GuidePrintPage() {
  const router = useRouter()
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    setAppUrl(window.location.origin)
  }, [])

  const loginUrl = appUrl ? `${appUrl}/login` : ''
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=4&data=${encodeURIComponent(loginUrl || 'https://example.com')}`

  const steps = [
    {
      num: '1',
      title: 'アカウントを作る',
      desc: 'QRを読み取るかURLを開き、Googleまたはメールでログインします。',
      mock: (
        <MiniPhone>
          <div className="text-[8.5px] font-black text-gray-500 mb-1">保護者ログイン</div>
          <div className="space-y-1">
            <div className="border border-gray-200 rounded-md text-center py-1 text-[8.5px] font-bold text-gray-700">🌐 Googleでログイン</div>
            <div className="relative border border-[#B8D9C8] bg-[#E6F4EC] text-[#1A6640] rounded-md text-center py-1 text-[8.5px] font-bold">
              ✉️ 新規登録（メール）
              <Pin n={1} />
            </div>
          </div>
        </MiniPhone>
      ),
    },
    {
      num: '2',
      title: '登録する',
      desc: '表示名と年齢を入力します。施設コードは空欄のままでOK。',
      mock: (
        <MiniPhone>
          <div className="text-[8.5px] font-black text-gray-500 mb-1">新しく登録</div>
          <div className="space-y-1">
            <div>
              <div className="text-[9px] font-bold text-gray-400">呼び名</div>
              <div className="border border-gray-200 rounded-md px-1 py-0.5 text-[8.5px]">ゆき</div>
            </div>
            <div className="relative">
              <div className="text-[9px] font-bold text-gray-400">年齢</div>
              <div className="border border-gray-200 rounded-md px-1 py-0.5 text-[8.5px]">5歳</div>
              <Pin n={1} />
            </div>
            <div className="relative bg-[#1A6640] text-white rounded-md text-center py-1 text-[8.5px] font-bold">
              登録する
              <Pin n={2} />
            </div>
          </div>
        </MiniPhone>
      ),
    },
    {
      num: '3',
      title: '情報を入力する',
      desc: 'アレルギー・持薬・緊急連絡先などを必要な範囲で入力します。',
      mock: (
        <MiniPhone>
          <div className="flex gap-0.5 mb-1">
            <div className="bg-[#1A6640] text-white rounded px-1 py-0.5 text-[9px] font-bold">基本情報</div>
            <div className="border border-gray-200 rounded px-1 py-0.5 text-[9px] text-gray-400">アレルギー</div>
          </div>
          <div className="text-[9px] font-bold text-gray-400">緊急連絡先</div>
          <div className="border border-gray-200 rounded-md px-1 py-0.5 text-[8.5px] mb-1">母：090-xxxx</div>
          <div className="flex gap-1">
            <div className="flex-1 bg-[#A83A34] text-white rounded text-center py-0.5 text-[9px] font-bold">💉 あり</div>
            <div className="flex-1 border border-gray-200 rounded text-center py-0.5 text-[9px] text-gray-500">なし</div>
          </div>
        </MiniPhone>
      ),
    },
    {
      num: '4',
      title: '公開する項目を選ぶ',
      desc: '各項目の🔓🔒ボタンで「公開」か「非表示」かを選べます。',
      mock: (
        <MiniPhone>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] font-bold text-gray-500">緊急連絡先</div>
            <div className="bg-[#E6F4EC] text-[#1A6640] border border-[#B8D9C8] rounded-full px-1.5 py-0.5 text-[9px] font-bold">🔓 公開</div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="text-[9px] font-bold text-gray-500">フルネーム</div>
            <div className="bg-[#F4EBDA] text-[#8A5A12] border border-[#E8C880] rounded-full px-1.5 py-0.5 text-[9px] font-bold">🔒 非表示</div>
            <Pin n={1} />
          </div>
        </MiniPhone>
      ),
    },
    {
      num: '5',
      title: 'NFC・QRを準備する',
      desc: '「NFCタグ/QR」ページのURLをタグに書き込むかQRを印刷します。',
      mock: (
        <MiniPhone>
          <div className="text-[9px] font-bold text-gray-400 mb-0.5">一般向けURL</div>
          <div className="bg-[#F4F7F5] border border-gray-200 rounded px-1 py-0.5 text-[8px] font-mono text-gray-600 break-all mb-1">omamori-tag.app/kid/a1b2…</div>
          <div className="relative bg-[#1A6640] text-white rounded text-center py-1 text-[8.5px] font-bold mb-1">
            📋 URLをコピー
            <Pin n={1} />
          </div>
          <div className="w-9 h-9 mx-auto bg-[repeating-conic-gradient(#0E1A12_0deg_90deg,white_90deg_180deg)] rounded-sm" />
        </MiniPhone>
      ),
    },
    {
      num: '6',
      title: '確認する',
      desc: 'URL・QRを実機で開き、意図通りに表示されるか確認します。',
      mock: (
        <MiniPhone>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[8.5px] font-black text-gray-700">ゆき の情報</div>
            <div className="relative text-[8px] border border-gray-200 rounded px-1 text-gray-400">あ+
              <Pin n={1} />
            </div>
          </div>
          <div className="relative bg-[#A83A34] text-white rounded text-center py-1 text-[7.5px] font-bold">
            🚨 緊急通知を送る
            <Pin n={2} />
          </div>
        </MiniPhone>
      ),
    },
  ]

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 6mm; size: A4 landscape; }
          .print-root { zoom: 1; max-width: none; width: 100%; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-[#DDE4DA] text-[#66786C] px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <main className={`${zenMaru.variable} ${notoSansJP.variable} print-root max-w-[1180px] mx-auto px-10 py-9 bg-[#F6F7F1] text-[#1B2A20]`} style={{ fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b-2 border-[#1A6640]">
          <div>
            <div className="text-sm font-bold text-[#0F4A2C] tracking-widest uppercase">おまもりタグ</div>
            <div className="text-2xl font-black text-[#1B2A20] leading-tight" style={{ fontFamily: 'var(--font-zen-maru), var(--font-noto-sans-jp), sans-serif' }}>画面で見る はじめてガイド</div>
            <div className="text-sm text-[#66786C]">個人でご利用の方向け</div>
          </div>
          <div className="text-4xl">🏷️</div>
        </div>

        {/* QR + URL */}
        <div className="flex gap-6 mb-6 items-center">
          <div className="text-center flex-shrink-0">
            <img src={qrUrl} alt="QR" width={104} height={104} className="rounded-lg border border-[#DDE4DA]" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#1B2A20] leading-snug mb-1.5">
              保育園などの施設に所属していなくても、お一人（ご家族）でご利用いただけます。
            </div>
            <div className="bg-[#E6F0EA] rounded-lg px-4 py-2 inline-block">
              <span className="text-xs font-bold text-[#66786C] uppercase tracking-widest mr-2">アクセスURL</span>
              <span className="font-mono text-sm text-[#0F4A2C] font-bold">{loginUrl}</span>
            </div>
          </div>
        </div>

        {/* 手順（6列×1行、画面つき） */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {steps.map((s) => (
            <div key={s.num} className="relative border border-[#DDE4DA] rounded-xl p-2.5 pt-1.5 bg-white flex flex-col items-center text-center gap-1.5">
              <div className="w-full flex items-start justify-between">
                <span
                  className="text-[24px] leading-none font-black text-[#C9D6C7] -mb-1"
                  style={{ fontFamily: 'var(--font-zen-maru), sans-serif', WebkitTextStroke: '1px #DDE4DA' }}
                >
                  {s.num.padStart(2, '0')}
                </span>
              </div>
              <div className="font-black text-[10.5px] text-[#1B2A20] leading-snug w-full text-left -mt-1.5" style={{ fontFamily: 'var(--font-zen-maru), var(--font-noto-sans-jp), sans-serif' }}>{s.title}</div>
              {s.mock}
              <div className="text-[9px] text-[#66786C] leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* おまもりタグとは */}
        <div className="mb-5 bg-[#1A6640] rounded-xl p-5 text-white flex gap-3 items-start">
          <div className="text-2xl flex-shrink-0">🏷️</div>
          <div>
            <div className="font-black text-sm mb-1" style={{ fontFamily: 'var(--font-zen-maru), var(--font-noto-sans-jp), sans-serif' }}>おまもりタグとは？</div>
            <div className="text-xs leading-relaxed opacity-90">
              バッグやキーホルダーにつける小さなタグです。スマートフォンをかざすだけで、あらかじめ設定した情報にすぐアクセスできます。もしものときに、周りの方へ素早く情報を伝えられます。
            </div>
          </div>
        </div>

        {/* 困ったときは */}
        <div className="border-t border-[#DDE4DA] pt-3 flex items-center justify-between">
          <div className="text-xs text-[#66786C]">お困りの際は info@marunostudio.com までご連絡ください</div>
          <div className="text-xs text-[#66786C] font-mono">{loginUrl}</div>
        </div>
      </main>
    </>
  )
}
