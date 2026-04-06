import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">プライバシーポリシー</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm text-sm text-[#3A4A3E] leading-relaxed space-y-5">
          <p className="text-xs text-[#7A8E80]">最終更新日：2025年4月</p>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">取得する情報</h2>
            <ul className="space-y-1 pl-4">
              <li>・氏名（ニックネーム可）、年齢</li>
              <li>・アレルギー情報、持病、持薬</li>
              <li>・緊急連絡先（保育士認証時のみ表示）</li>
              <li>・位置情報（緊急通知時のみ・任意）</li>
              <li>・Googleアカウントのメールアドレス</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">利用目的</h2>
            <ul className="space-y-1 pl-4">
              <li>・緊急時の医療情報提供</li>
              <li>・保護者への緊急通知</li>
              <li>・保育士による情報確認</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">第三者提供</h2>
            <p>取得した個人情報は、緊急通知（メール送信）を除き第三者に提供しません。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">セキュリティ</h2>
            <ul className="space-y-1 pl-4">
              <li>・Supabase（PostgreSQL）のRLSで保護</li>
              <li>・HTTPS通信を使用</li>
              <li>・URLはランダムIDで推測困難</li>
              <li>・保育士認証はPINコード必須</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">データの削除</h2>
            <p>アカウント削除をご希望の場合は、お問い合わせよりご連絡ください。</p>
          </div>

          <p className="text-xs text-[#7A8E80] pt-2">お問い合わせ：marunostudio@example.com</p>
        </div>

        <div className="text-center mt-6">
          <Link href="/terms" className="text-sm text-[#1A6640] font-bold underline">
            利用規約を見る →
          </Link>
        </div>
      </div>
    </main>
  )
}