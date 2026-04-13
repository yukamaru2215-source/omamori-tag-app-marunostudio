import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">利用規約</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm text-sm text-[#3A4A3E] leading-relaxed space-y-5">
          <p className="text-xs text-[#7A8E80]">最終更新日：2025年4月</p>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第1条（目的）</h2>
            <p>本サービス「おまもりタグ」（以下「本サービス」）は、子どもの医療情報をNFCタグで管理し、緊急時に適切な対応を支援することを目的とします。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第2条（利用者の責任）</h2>
            <p>利用者は正確な情報を登録し、情報の管理に責任を持つものとします。登録情報の誤りによって生じた損害について、運営者は責任を負いません。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第3条（禁止事項）</h2>
            <p>以下の行為を禁止します。</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>・虚偽情報の登録</li>
              <li>・第三者への不正アクセス</li>
              <li>・サービスの妨害行為</li>
              <li>・個人情報の目的外利用</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第4条（免責事項）</h2>
            <p>本サービスは医療行為を代替するものではありません。緊急時は必ず専門の医療機関にご連絡ください。</p>
            <div className="mt-3 space-y-3">
              <div className="bg-[#F4F7F5] rounded-xl p-3 border border-[#E0EAE2]">
                <p className="font-bold text-[#0E1A12] text-xs mb-1">● 3Dプリント製品について</p>
                <p>製品には3Dプリンター造形特有の積層痕が生じる場合があります。また、高温環境下（車内等）での変形リスクがあります。ご購入の際にこれらの特性に同意いただいたものとみなします。</p>
              </div>
              <div className="bg-[#F4F7F5] rounded-xl p-3 border border-[#E0EAE2]">
                <p className="font-bold text-[#0E1A12] text-xs mb-1">● NFC通信について</p>
                <p>NFCタグの物理的な寿命・経年劣化、スマートフォンのケースによる電波干渉、金属面への設置など通信環境に依存する読み取り不可については、保証の対象外とします。</p>
              </div>
              <div className="bg-[#F4F7F5] rounded-xl p-3 border border-[#E0EAE2]">
                <p className="font-bold text-[#0E1A12] text-xs mb-1">● 緊急時の表示について</p>
                <p>本アプリは緊急時の情報提供を補助するものです。ネットワーク障害・サーバーダウン等により一時的に閲覧できない場合があることをあらかじめご承諾のうえご利用ください。</p>
              </div>
              <div className="bg-[#F4F7F5] rounded-xl p-3 border border-[#E0EAE2]">
                <p className="font-bold text-[#0E1A12] text-xs mb-1">● 登録情報の最新性について</p>
                <p>お守りタグに紐づく情報の最新性は、ご登録者（保護者）が自ら管理・更新するものとします。古い情報や未更新の情報によって生じたトラブルについて、運営者は一切の責任を負いません。</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第5条（規約の変更）</h2>
            <p>本規約は予告なく変更される場合があります。変更後も継続してご利用いただいた場合、変更に同意したものとみなします。</p>
          </div>

          <p className="text-xs text-[#7A8E80] pt-2">お問い合わせ：marunostudio@example.com</p>
        </div>

        <div className="text-center mt-6">
          <Link href="/privacy" className="text-sm text-[#1A6640] font-bold underline">
            プライバシーポリシーを見る →
          </Link>
        </div>
      </div>
    </main>
  )
}