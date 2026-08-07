import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-6 pb-16">
        <div className="flex items-center gap-3 pt-8 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</Link>
          <h1 className="text-2xl font-black text-[#0E1A12]">プライバシーポリシー</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm text-sm text-[#3A4A3E] leading-relaxed space-y-6">
          <p>
            このプライバシーポリシーは、<a href="https://tag.marunostudio.com/" className="text-[#1A6640] underline break-all">https://tag.marunostudio.com/</a>（以下、「本サイト」といいます。）における、お客様の個人情報の取扱いについて定めるものです。本サイトおよびWebアプリ「おまもりタグ」を運営するmarunostudio（以下、「当方」といいます。）は、お客様の個人情報を適切に保護し、適正に取り扱うことをお約束いたします。
          </p>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">1. 個人情報の定義</h2>
            <p>本プライバシーポリシーにおいて、個人情報とは、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別できるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む。）を指します。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">2. 個人情報の取得について</h2>
            <p className="mb-3">当方は、以下の場合において、以下の個人情報を取得いたします。</p>

            <p className="font-bold text-[#0E1A12] mb-1">2.1. お客様から直接ご提供いただく情報</p>
            <p className="mb-2">お客様が本サービスを利用する際、以下の情報を取得することがあります。</p>

            <div className="space-y-3 pl-2">
              <div>
                <p className="font-bold text-[#0E1A12] text-xs mb-1">施設利用者（園・団体）登録時</p>
                <ul className="space-y-1 pl-3">
                  <li>・企業・団体名、代表者名、所在地、電話番号、メールアドレス</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-[#0E1A12] text-xs mb-1">保護者利用者（個人）会員登録時</p>
                <ul className="space-y-1 pl-3">
                  <li>・氏名、メールアドレス</li>
                  <li>・ログインID、パスワード（Google OAuth等の連携情報を含む）</li>
                  <li>・生年月日、性別</li>
                  <li>・児童の安全・医療に関する情報（アレルギーの有無、持病、緊急連絡先、かかりつけ医、その他任意で入力される配慮事項）</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-[#0E1A12] text-xs mb-1">お問い合わせ時</p>
                <ul className="space-y-1 pl-3">
                  <li>・氏名、メールアドレス、電話番号、問い合わせ内容</li>
                </ul>
              </div>
            </div>

            <p className="font-bold text-[#0E1A12] mb-1 mt-3">2.2. 自動的に取得する情報</p>
            <p className="mb-2">お客様が本サイトをご利用いただく際に、以下の情報を自動的に取得することがあります。</p>
            <ul className="space-y-1 pl-3">
              <li>・IPアドレス、閲覧履歴、デバイス情報</li>
              <li>・Cookie（クッキー）情報（ログイン状態の維持およびセッション管理のため）</li>
              <li>・アクセスログ</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">3. 個人情報の利用目的</h2>
            <p className="mb-2">当方は、取得した個人情報を以下の目的のために利用いたします。</p>
            <ul className="space-y-1 pl-3">
              <li>・サービスの提供・運営（「おまもりタグ」の読み取りによる情報表示、ユーザー認証、一斉連絡システムの運用）</li>
              <li>・お問い合わせへの対応</li>
              <li>・施設利用者に対する利用料金の請求</li>
              <li>・新サービス、キャンペーン、重要なお知らせ（規約変更等）の情報提供</li>
              <li>・システムの改善、新サービスの開発、およびマーケティング分析</li>
              <li>・不正行為の防止、セキュリティの確保</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">4. 個人情報の第三者提供</h2>
            <p className="mb-2">当方は、以下の場合を除き、お客様の同意を得ずに個人情報を第三者に提供いたしません。</p>
            <ul className="space-y-1 pl-3">
              <li>・法令に基づく場合</li>
              <li>・人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき（緊急時における医療機関への情報提供等を含む）</li>
              <li>・業務委託先への提供（クラウドサーバーの運用、システム保守、メール配信等、サービス運営に必要な範囲で委託する場合）</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">5. 個人情報の安全管理措置</h2>
            <p className="mb-2">当方は、個人情報の漏洩、滅失又は毀損の防止その他の個人情報の安全管理のため、以下の措置を講じます。</p>
            <ul className="space-y-1 pl-3">
              <li>・組織的・人的措置：個人情報取扱責任者の設置、アクセス権限の制限、情報の非開示管理</li>
              <li>・物理的・技術的措置：機器の盗難防止、パスワード設定、通信の暗号化、ログ監視、脆弱性対策</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">6. 個人情報の開示・訂正・利用停止等の請求</h2>
            <p className="mb-2">お客様は、ご自身の個人情報について開示、訂正、削除等の請求をすることができます。</p>
            <ul className="space-y-1 pl-3">
              <li>・請求窓口：公式サイトのお問い合わせフォーム、または指定のメールアドレスにて受け付けます。</li>
              <li>・対応方法：本人確認が取れ次第、合理的な期間内に対応します。なお、アプリ上の登録情報については、利用者自身がマイページ等から直接訂正・削除できる仕組みを提供しています。</li>
            </ul>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">7. Cookie（クッキー）等の利用について</h2>
            <p>本サイトでは、利便性向上やアクセス解析（Google Analytics等）の目的でCookieを利用しています。利用者はブラウザの設定によりCookieを無効にできますが、本サービスの一部機能が利用できなくなる場合があります。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">8. プライバシーポリシーの改定</h2>
            <p>当方は、法令遵守とサービス向上のため、本ポリシーを適宜見直し改定します。改定の際は、本サイト上での告知または登録されたメールアドレスへの通知をもって効力を生じるものとします。</p>
          </div>

          <div>
            <h2 className="font-black text-[#0E1A12] mb-2">9. お問い合わせ窓口</h2>
            <p className="mb-2">本プライバシーポリシーに関するお問い合わせは、以下の窓口までお願いいたします。</p>
            <ul className="space-y-1 pl-3">
              <li>・販売業者名：marunostudio</li>
              <li>・サイト運営責任者：篠木 友香莉</li>
              <li>・連絡先メールアドレス：<a href="mailto:info@marunostudio.com" className="text-[#1A6640] underline">info@marunostudio.com</a></li>
              <li>・所在地・電話番号：特定商取引法に基づき、請求があった場合には遅滞なく電子メール等により提供いたします。ご請求は上記メールアドレスまたはお問い合わせフォームより承ります。</li>
            </ul>
          </div>

          <p className="text-xs text-[#7A8E80] pt-2">202X年XX月XX日 制定</p>
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
