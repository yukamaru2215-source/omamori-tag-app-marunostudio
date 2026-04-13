'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    category: '📱 基本的な使い方',
    items: [
      {
        q: 'NFCってなんですか？特別なアプリは必要ですか？',
        a: 'NFC（Near Field Communication）はスマートフォンに内蔵されている近距離通信機能です。最近のiPhone・Androidのほとんどに対応しています。専用アプリのダウンロードは不要で、タグにスマートフォンをかざすだけでブラウザが自動で開きます。',
      },
      {
        q: 'タグはどこにつければいいですか？',
        a: 'ランドセルの持ち手・バッグの外側・水筒など、すぐ手に取れる場所がおすすめです。金属面に直接貼ると読み取りにくくなるため、プラスチックや布の上につけてください。',
      },
      {
        q: '情報の更新はどうやるの？',
        a: 'ログイン後のダッシュボードから「編集する」ボタンでいつでも変更できます。更新した内容はすぐにタグに反映されます（タグ自体の書き換えは不要です）。',
      },
      {
        q: '複数の子どもに使えますか？',
        a: 'はい。1つのアカウントで複数のお子様を登録できます。それぞれに個別のタグを用意するだけです。',
      },
    ],
  },
  {
    category: '🔒 安全・プライバシー',
    items: [
      {
        q: '誰でも情報を見られますか？',
        a: 'タグをかざすと名前・アレルギー・血液型など基本的な医療情報が表示されます。緊急連絡先・持薬・かかりつけ医などの詳細情報は、認証された保育士・スタッフのみ閲覧できます。',
      },
      {
        q: '子どもの情報は安全に管理されますか？',
        a: '情報はSupabaseという堅牢なクラウドデータベースで管理されており、通信はすべてSSL暗号化されています。第三者が無断でアクセスできない仕組みになっています。',
      },
      {
        q: 'タグを紛失したらどうなりますか？',
        a: '管理画面からNFCキーを再発行することで、紛失したタグを即座に無効化できます。新しいタグに再発行したキーを書き込めば引き続きご利用いただけます。',
      },
    ],
  },
  {
    category: '🚨 緊急時・トラブル',
    items: [
      {
        q: 'タグが読み取れないときはどうすればいいですか？',
        a: 'スマートフォンのケースが厚い場合や金属素材のケースでは読み取りにくいことがあります。ケースを外してかざすか、スマホのNFC読み取り部分（背面中央〜上部）をタグに近づけてみてください。',
      },
      {
        q: '緊急時にネットがつながらない場合は？',
        a: '本アプリはネットワークに接続していないと情報を表示できません。おまもりタグはあくまでサブの「おまもり」としてご活用ください。緊急時は自己判断せず、必ず医療機関・救急の指示に従ってください。',
      },
      {
        q: '保護者への緊急通知とはなんですか？',
        a: 'お子様のタグをスキャンした方が「緊急通知を送る」ボタンを押すと、登録された保護者のメールアドレスに通知が届きます。発見者の位置情報も合わせて送信されます（位置情報の取得に同意した場合）。',
      },
    ],
  },
  {
    category: '🏷️ 製品・料金',
    items: [
      {
        q: 'タグはどこで買えますか？',
        a: '現在は注文フォームからのご購入のみ対応しています。保護者向けタグは1枚500円（税込）です。保育園・こども園への導入をご検討の場合はお問い合わせください。',
      },
      {
        q: '3Dプリント製品とのことですが、耐久性は大丈夫ですか？',
        a: '日常使いには十分な強度ですが、3Dプリント特有の積層痕が生じる場合があります。また、夏場の車内など高温環境下では変形するリスクがあります。お守りとして大切に使っていただければ長くお使いいただけます。',
      },
      {
        q: '月額料金はかかりますか？',
        a: '保護者の方はタグ購入費のみで月額料金はかかりません。保育園・こども園単位でのご契約は月額1,000円（税込）となります。',
      },
    ],
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(key: string) {
    setOpen(prev => prev === key ? null : key)
  }

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">よくある質問</h1>
        </div>

        <div className="space-y-5">
          {FAQS.map(section => (
            <div key={section.category}>
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">{section.category}</div>
              <div className="bg-white rounded-2xl border border-[#E0EAE2] shadow-sm overflow-hidden">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`
                  const isOpen = open === key
                  return (
                    <div key={key} className={i < section.items.length - 1 ? 'border-b border-[#E0EAE2]' : ''}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                      >
                        <span className="text-sm font-bold text-[#0E1A12] leading-snug">{item.q}</span>
                        <span className={`text-[#1A6640] font-black text-lg flex-shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>＋</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-[#5A6E62] leading-relaxed border-t border-[#F0F4F1] pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-[#7A8E80]">
          解決しない場合はお問い合わせください。
          <div className="mt-1">
            <a href="mailto:info@marunostudio.com" className="text-[#1A6640] font-bold underline">info@marunostudio.com</a>
          </div>
        </div>
      </div>
    </main>
  )
}
