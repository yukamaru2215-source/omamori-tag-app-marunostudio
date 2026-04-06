export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <h1 className="text-2xl font-black text-[#0E1A12] mb-6 pt-8">プライバシーポリシー</h1>
        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm text-sm text-[#3A4A3E] leading-relaxed space-y-4">
          <p>「おまもりタグ」における個人情報の取り扱いについて説明します。</p>
          <h2 className="font-black text-[#0E1A12]">取得する情報</h2>
          <p>氏名（ニックネーム）、年齢、アレルギー情報、緊急連絡先、位置情報（緊急時のみ）</p>
          <h2 className="font-black text-[#0E1A12]">利用目的</h2>
          <p>緊急時の医療情報提供、保護者への通知、保育士による情報確認</p>
          <h2 className="font-black text-[#0E1A12]">第三者提供</h2>
          <p>取得した個人情報は、緊急通知を除き第三者に提供しません。</p>
          <h2 className="font-black text-[#0E1A12]">セキュリティ</h2>
          <p>Supabase（PostgreSQL）によるRLS（行レベルセキュリティ）で保護しています。</p>
          <p className="text-xs text-[#7A8E80] pt-4">※ 本ポリシーは随時更新される場合があります。</p>
        </div>
      </div>
    </main>
  )
}