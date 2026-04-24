import Link from 'next/link'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">料金表</h1>
        </div>

        <p className="text-sm text-[#7A8E80] mb-6">
          本サービスの料金は以下のとおりです。価格はすべて税込です。
        </p>

        {/* 月額利用料 */}
        <div className="bg-white rounded-2xl border-2 border-[#1A6640] overflow-hidden mb-4 shadow-sm">
          <div className="bg-[#1A6640] px-5 py-3">
            <div className="text-xs font-bold text-[#A8D4B8] uppercase tracking-widest mb-0.5">保育園・こども園向け</div>
            <div className="text-white font-black text-base">月額利用料</div>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-[#1A6640]">¥1,000</span>
              <span className="text-sm font-bold text-[#4A6E55]">／月（税込）</span>
            </div>
            <ul className="space-y-1 text-sm text-[#3A4A3E]">
              <li>・園単位でのご契約（人数制限なし）</li>
              <li>・初期費用・設定費用は不要</li>
              <li>・スタッフアカウント・管理機能含む</li>
            </ul>
          </div>
        </div>

        {/* タグ製品 */}
        <div className="bg-white rounded-2xl border border-[#E0EAE2] overflow-hidden mb-4 shadow-sm">
          <div className="bg-[#F4F7F5] px-5 py-3 border-b border-[#E0EAE2]">
            <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-0.5">タグ製品（都度購入）</div>
            <div className="text-[#0E1A12] font-black text-base">おまもりタグ・オプションタグ</div>
          </div>
          <div className="divide-y divide-[#E0EAE2]">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="font-bold text-[#0E1A12] text-sm">おまもりタグ（保護者用）</div>
                  <div className="text-xs text-[#7A8E80] mt-0.5">NFCタグ本体。お子様の持ち物に装着。</div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <span className="text-2xl font-black text-[#0E1A12]">¥500</span>
                  <span className="text-xs text-[#7A8E80]">／枚</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="font-bold text-[#0E1A12] text-sm">オプションタグ（スタッフ用）</div>
                  <div className="text-xs text-[#7A8E80] mt-0.5">スタッフ専用ページへのアクセスタグ。</div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <span className="text-2xl font-black text-[#0E1A12]">¥300</span>
                  <span className="text-xs text-[#7A8E80]">／枚</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 注記 */}
        <div className="bg-[#FFF8E7] rounded-xl p-4 border border-[#E8D8A0] text-xs text-[#6B5B20] space-y-1 mb-6">
          <p className="font-bold text-[#5A4A10] mb-2">ご注意事項</p>
          <p>・タグ製品の価格は1枚あたりの税込価格です。</p>
          <p>・月額利用料は毎月末日締めのご請求となります。</p>
          <p>・料金は予告なく変更される場合があります。最新の料金は本ページをご確認ください。</p>
          <p>・ご不明な点はお気軽にお問い合わせください。</p>
        </div>

        {/* お問い合わせ */}
        <div className="bg-white rounded-2xl border border-[#E0EAE2] p-5 shadow-sm mb-6">
          <div className="text-sm font-black text-[#0E1A12] mb-1">導入のご相談・お見積り</div>
          <div className="text-xs text-[#7A8E80] mb-3">園の規模や状況に応じてご提案いたします。</div>
          <div className="flex items-center gap-2">
            <span className="text-base">✉️</span>
            <span className="font-mono font-bold text-[#1A6640] text-sm">info@marunostudio.com</span>
          </div>
          <div className="text-xs text-[#7A8E80] mt-1">担当者より2営業日以内にご返信いたします。</div>
        </div>

        <div className="text-center">
          <Link href="/terms" className="text-sm text-[#1A6640] font-bold underline">
            利用規約を見る →
          </Link>
        </div>
      </div>
    </main>
  )
}
