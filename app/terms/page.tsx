export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <h1 className="text-2xl font-black text-[#0E1A12] mb-6 pt-8">利用規約</h1>
        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm text-sm text-[#3A4A3E] leading-relaxed space-y-4">
          <p>本サービス「おまもりタグ」（以下「本サービス」）の利用規約です。</p>
          <h2 className="font-black text-[#0E1A12]">第1条（目的）</h2>
          <p>本サービスは、子どもの医療情報をNFCタグで管理し、緊急時に適切な対応を支援することを目的とします。</p>
          <h2 className="font-black text-[#0E1A12]">第2条（利用者の責任）</h2>
          <p>利用者は正確な情報を登録し、情報の管理に責任を持つものとします。</p>
          <h2 className="font-black text-[#0E1A12]">第3条（禁止事項）</h2>
          <p>虚偽情報の登録、第三者への不正アクセス、サービスの妨害行為を禁止します。</p>
          <p className="text-xs text-[#7A8E80] pt-4">※ 本規約は随時更新される場合があります。</p>
        </div>
      </div>
    </main>
  )
}