'use client'

import { useRouter } from 'next/navigation'

export default function ProposalPage() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm; size: A4 portrait; }
          .print-root { zoom: 0.68; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => router.back()} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold shadow">← 戻る</button>
        <button onClick={() => window.print()} className="bg-[#1A6640] text-white px-5 py-2 rounded-xl text-sm font-bold shadow">🖨️ 印刷 / PDF保存</button>
      </div>

      <main className="print-root max-w-[900px] mx-auto px-6 py-4 bg-white font-sans">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#1A6640]">
          <div>
            <div className="text-xs font-bold text-[#1A6640] tracking-widest uppercase">サービス提案書</div>
            <div className="text-2xl font-black text-gray-900 leading-tight">おまもりタグ</div>
            <div className="text-xs text-gray-500 mt-0.5">保育園・こども園 ご担当者様へ</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-10 object-contain opacity-80" />
        </div>

        {/* ① 序章（共感） */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">1</div>
            <div className="text-base font-black text-gray-900">こんなお困りごとはありませんか？</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['🚨', '緊急時に情報をすぐ取り出せない', '避難先や急病の現場では紙の書類はすぐ手元にない。保護者への連絡先も分からず、対応が遅れてしまう'],
              ['📁', '紙管理の限界', '連絡帳や個人ファイルは現場で素早く参照しにくく、引き継ぎも大変'],
              ['🔄', '情報が古いままになりがち', '紙に書いた連絡先やアレルギー情報は更新されにくく、いざというときに古いデータで対応してしまうリスクがある'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-[#FFF8F0] border border-orange-200 rounded-xl p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-xs font-black text-gray-900 mb-1">{title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ② 現状の課題 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">2</div>
            <div className="text-base font-black text-gray-900">なぜ今の方法では限界があるのか</div>
          </div>
          <div className="bg-[#F4F7F5] rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['紙の書類', '緊急時に素早く参照できない。引き継ぎや更新が煩雑'],
                ['口頭の申し送り', 'ヒューマンエラーが起きやすく、新任スタッフへの共有が難しい'],
                ['既存のデジタルツール', 'ログインが必要で、現場での即時アクセスに向かない'],
                ['保護者からの電話', '連絡がつかない場面では対応が遅れ、リスクが高まる'],
              ].map(([method, problem]) => (
                <div key={method} className="flex gap-3 items-start">
                  <span className="text-red-400 font-black text-sm flex-shrink-0 mt-0.5">✕</span>
                  <div>
                    <span className="text-xs font-black text-gray-800">{method}　</span>
                    <span className="text-xs text-gray-600">{problem}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ③ サービス紹介 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">3</div>
            <div className="text-base font-black text-gray-900">おまもりタグでできること</div>
          </div>
          <div className="flex gap-6 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/omamoritag.jpg" alt="おまもりタグ" className="w-36 h-36 object-contain rounded-xl border border-gray-100 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-3 leading-relaxed">
                NFCタグをお子様の持ち物につけるだけ。スマートフォンをかざせば、保育士がすぐに必要な情報へアクセスできます。
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['📱', 'かざすだけでアクセス', 'アプリ不要・ログイン不要。NFCタグにスマホをかざせばすぐ開く'],
                  ['🚑', '緊急情報を即確認', 'アレルギー・持病・かかりつけ医・緊急連絡先を一画面で表示'],
                  ['🔒', '保育士専用の閲覧制限', '詳細な医療情報は認証済みスタッフのみ閲覧。プライバシーを保護'],
                  ['📲', '保護者がいつでも更新', 'スマートフォンから情報をいつでも最新状態に保てる'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-2 items-start bg-[#F4F7F5] rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <div className="text-xs font-black text-gray-900 mb-0.5">{title}</div>
                      <div className="text-xs text-gray-600 leading-snug">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ④ 料金体系 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">4</div>
            <div className="text-base font-black text-gray-900">料金体系</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: '月額利用料',
                price: '1,000',
                unit: '円／月',
                note: '税込',
                desc: '園単位でのご契約。人数制限なし。',
                accent: true,
              },
              {
                label: 'おまもりタグ（保護者用）',
                price: '500',
                unit: '円／枚',
                note: '税込',
                desc: 'NFCタグ本体。お子様の持ち物に装着。',
                accent: false,
              },
              {
                label: 'オプションタグ（スタッフ用）',
                price: '300',
                unit: '円／枚',
                note: '税込',
                desc: 'スタッフ専用ページへのアクセスタグ。',
                accent: false,
              },
            ].map(({ label, price, unit, note, desc, accent }) => (
              <div key={label} className={`rounded-2xl border-2 overflow-hidden ${accent ? 'border-[#1A6640]' : 'border-gray-200'}`}>
                <div className={`px-4 py-2 text-xs font-black ${accent ? 'bg-[#1A6640] text-white' : 'bg-gray-50 text-gray-700'}`}>
                  {label}
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-3xl font-black ${accent ? 'text-[#1A6640]' : 'text-gray-900'}`}>¥{price}</span>
                    <span className="text-sm font-bold text-gray-600">{unit}</span>
                    <span className="text-xs text-gray-400">（{note}）</span>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400 ml-1">※ 初期費用・設定費用は不要です。</div>
        </section>

        {/* ⑤ 導入の流れ */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">5</div>
            <div className="text-base font-black text-gray-900">導入の流れ</div>
          </div>
          <div className="bg-[#F4F7F5] rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2">
              {[
                ['✉️', 'お問い合わせ', 'メールまたはフォームからご連絡ください'],
                ['📋', 'ご提案・お見積り', '園の規模に合わせてご提案します'],
                ['⚙️', '導入設定', 'アカウント発行・タグお届け（最短1週間）'],
                ['🎉', '運用開始', 'スタッフへの説明資料もご用意します'],
              ].map(([icon, title, desc], i, arr) => (
                <div key={title} className="flex items-center gap-2 flex-1">
                  <div className="text-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1A6640] flex items-center justify-center text-lg mx-auto mb-1">{icon}</div>
                    <div className="text-xs font-black text-gray-900 mb-0.5">{title}</div>
                    <div className="text-xs text-gray-500 leading-snug">{desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="text-[#1A6640] font-black text-xl flex-shrink-0">›</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑥ お問い合わせ */}
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#1A6640] flex items-center justify-center text-white text-xs font-black">6</div>
            <div className="text-base font-black text-gray-900">お問い合わせ</div>
          </div>
          <div className="border-2 border-[#1A6640] rounded-2xl p-5 flex items-center justify-between gap-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">導入のご相談・お見積りはお気軽にどうぞ。</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">✉️</span>
                <span className="font-mono font-black text-[#1A6640] text-lg">info@marunostudio.com</span>
              </div>
              <div className="text-xs text-gray-500">担当者より2営業日以内にご返信いたします。</div>
            </div>
            <div className="flex-shrink-0 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=4&data=${encodeURIComponent('mailto:info@marunostudio.com')}`}
                alt="メールQR"
                width={90}
                height={90}
                className="rounded-xl border border-gray-200"
              />
              <div className="text-xs text-gray-400 mt-1">メールを開く</div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">月額 ¥1,000（税込）〜 ／ 初期費用なし</div>
            <div className="text-xs text-gray-400 mt-0.5">お子様の安心を、いつも手元に。</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-8 object-contain opacity-80" />
        </div>
        <div className="mt-2 text-[10px] text-gray-300 leading-relaxed">
          ※本サービスはサブの「おまもり」としての活用を前提としています。緊急時は自己判断せず、必ず医療機関・救急の指示に従ってください。登録情報（古い情報・誤った情報を含む）の管理は保護者の責任となります。ネットワーク障害等により緊急時に閲覧できない場合があります。
        </div>

      </main>
    </>
  )
}
