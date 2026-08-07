'use client'

import Link from 'next/link'

const STEPS = [
  {
    step: 1,
    title: 'アカウントを作る',
    desc: 'トップページの「ログイン」からGoogleアカウントでログインします。特別な登録は不要です。',
    href: '/login',
    linkLabel: 'ログイン画面へ',
  },
  {
    step: 2,
    title: '登録する',
    desc: '「新しく登録する」から、表示名（呼び名）と年齢を入力します。「保育園との紐づけ」は個人利用の場合、入力しなくて大丈夫です（空欄のままでOK）。',
    href: '/register',
    linkLabel: '登録画面へ',
  },
  {
    step: 3,
    title: '情報を入力する',
    desc: 'ダッシュボードから「編集する」を開き、アレルギー・持病・持薬・緊急連絡先・かかりつけ医などを必要な範囲で入力します。すべて入力する必要はありません。',
    href: '/dashboard',
    linkLabel: 'ダッシュボードへ',
  },
  {
    step: 4,
    title: '公開する項目を選ぶ',
    desc: '編集画面の各項目のすぐ横にある🔓🔒ボタンで、その項目を「公開」（タグをかざした人なら誰でも見られる）にするか「🔒非表示」（誰にも見せず、自分だけが編集画面で確認できる）にするかを選べます。ボタンを押すとすぐに反映されます。',
  },
  {
    step: 5,
    title: 'NFCタグ・QRコードを準備する',
    desc: '「NFCタグ / QRコード」ページでURLをコピーするか、QRコードを印刷してカードやキーホルダーに貼り付けます。NFCタグをお持ちの場合は、スマートフォンの「NFC Tools」アプリなどでURLを書き込んでください。',
  },
  {
    step: 6,
    title: '実際に確認する',
    desc: 'コピーしたURLを自分のスマホで開くか、印刷したQRコードを読み取って、意図した通りに情報が表示されるか確認しましょう。画面右上の「あ／あ+／あ++」ボタンで文字の大きさも変えられます。',
  },
]

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-3">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">使い方ガイド</h1>
        </div>

        <div className="bg-[#E6F4EC] rounded-xl px-4 py-3 border border-[#B8D9C8] mb-6 text-sm text-[#1A6640] leading-relaxed">
          保育園などの施設に所属していなくても、お一人（ご家族）でご利用いただけます。ここでは、個人でご利用いただく場合の手順をご案内します。
        </div>

        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-[#E0EAE2] shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#1A6640] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div className="font-black text-[#0E1A12]">{s.title}</div>
              </div>
              <div className="text-sm text-[#5A6E62] leading-relaxed">{s.desc}</div>
              {s.href && (
                <Link href={s.href} className="inline-block mt-3 text-sm font-bold text-[#1A6640] underline">
                  {s.linkLabel} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E0EAE2] shadow-sm p-5 mt-6">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">💡 困ったときは</div>
          <div className="text-sm text-[#5A6E62] leading-relaxed">
            その他の質問は<Link href="/faq" className="text-[#1A6640] font-bold underline">よくある質問</Link>もご覧ください。それでも解決しない場合は、下記までお問い合わせください。
          </div>
          <div className="mt-2">
            <a href="mailto:info@marunostudio.com" className="text-[#1A6640] font-bold underline text-sm">info@marunostudio.com</a>
          </div>
        </div>
      </div>
    </main>
  )
}
