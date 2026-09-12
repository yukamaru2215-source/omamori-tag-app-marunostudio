'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Child } from '@/lib/types'
import { useTagScanner } from '@/lib/useTagScanner'
import PushManager from '@/app/push-manager'

function updateBadge(count: number) {
  if (!('setAppBadge' in navigator)) return
  try {
    if (count > 0) {
      navigator.setAppBadge(count)
    } else {
      navigator.clearAppBadge()
    }
  } catch { /* 非対応ブラウザは無視 */ }
}

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const isAdmin = userEmail === adminEmail

  useEffect(() => {
    async function load() {
      // OAuthのリダイレクトでhashが付く前に、?tagIdを保持しておく（次のreplaceStateで消える前に読む）
      // Supabase側の許可URL照合でクエリパラメータが落とされてURLにtagIdが無いことがあるため、
      // /loginで退避しておいたlocalStorageから復元する（同一ブラウザ内のフォールバック）
      const tagIdFromUrl = new URLSearchParams(window.location.search).get('tagId')
        ?? window.localStorage.getItem('omamori_pending_tag_id')
      if (tagIdFromUrl) window.localStorage.removeItem('omamori_pending_tag_id')

      let session = (await supabase.auth.getSession()).data.session

      // OAuthリダイレクト直後はhashにトークンが入っているが、
      // getSession()を1回呼ぶだけだとまだ処理中で間に合わないことがある。
      // その場合はonAuthStateChangeで認証状態の確定を待つ（最大5秒）。
      if (!session && window.location.hash) {
        session = await new Promise((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
            subscription.unsubscribe()
            resolve(s)
          })
          setTimeout(() => { subscription.unsubscribe(); resolve(null) }, 5000)
        })
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      if (!session) {
        // タグ経由の場合はtagIdを引き継いだままログイン画面へ戻す（引き継がないとタグ紐づけが行われなくなる）
        router.push(tagIdFromUrl ? `/login?tagId=${encodeURIComponent(tagIdFromUrl)}` : '/login')
        return
      }

      // NFCタグ経由でログインした場合（?tagId付き）は、登録画面に戻してタグを紐づける
      if (tagIdFromUrl) {
        router.replace(`/register?tagId=${encodeURIComponent(tagIdFromUrl)}`)
        return
      }

      setUserEmail(session.user.email ?? '')
      setUserId(session.user.id)
      const { data } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', session.user.id)
      setChildren(data ?? [])

      // 未読お知らせ数
      const { data: recipients } = await supabase
        .from('message_recipients')
        .select('message_id')
        .eq('parent_id', session.user.id)
      const messageIds = (recipients ?? []).map((r) => r.message_id)
      if (messageIds.length > 0) {
        const { data: reads } = await supabase
          .from('message_reads')
          .select('message_id')
          .eq('parent_id', session.user.id)
          .in('message_id', messageIds)
        const readSet = new Set((reads ?? []).map((r) => r.message_id))
        const count = messageIds.filter((id) => !readSet.has(id)).length
        setUnreadCount(count)
        // アプリアイコンのバッジを更新
        updateBadge(count)
      }

      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const { mode: scanMode, nfcSupported, videoRef, startNfc, startQr, stop: stopScan } = useTagScanner((tagId) => {
    router.push(`/register?tagId=${encodeURIComponent(tagId)}`)
  })

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A8E80]">ログイン中</div>
            <div className="font-bold text-[#0E1A12]">{userEmail}</div>
          </div>
          <button onClick={handleLogout} className="text-sm text-[#7A8E80] border border-[#E0EAE2] px-3 py-2 rounded-xl bg-white">
            ログアウト
          </button>
        </div>

        {isAdmin && (
          <Link href="/admin" className="block w-full text-center bg-[#EBF0FA] text-[#1A50A0] py-3 rounded-xl font-bold text-sm border border-[#A0BCE8] mb-4">
            ⚙️ 管理者画面
          </Link>
        )}

        {userId && <PushManager parentId={userId} />}

        <div className="bg-[#E6F4EC] rounded-xl px-4 py-3 border border-[#B8D9C8] mb-4 text-xs text-[#1A6640] leading-relaxed">
          <p className="font-bold mb-1">🏷️ おまもりタグについて</p>
          <p>このアプリはあくまでサブの「おまもり」として活用するものです。緊急時は自己判断せず、必ず医療機関・救急の指示に従ってください。</p>
          <p className="mt-1 text-[#5A6E62]">登録情報（古い情報・誤った情報を含む）の管理・更新は保護者の責任となります。ネットワーク障害等で緊急時に閲覧できない場合があることもご了承ください。</p>
        </div>

        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
          登録済みの情報
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#E0EAE2] shadow-sm mb-4">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-sm text-[#7A8E80]">まだ登録されていません</div>
          </div>
        ) : (
          children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EC] flex items-center justify-center text-2xl">🛡️</div>
                <div>
                  <div className="font-black text-[#0E1A12]">{child.display_name}</div>
                  <div className="text-xs text-[#7A8E80]">{child.age}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href={`/kid/${child.slug}`} className="flex-1 text-center bg-[#E6F4EC] text-[#1A6640] py-2 rounded-xl text-sm font-bold">
                  情報を見る
                </Link>
                <Link href={`/edit/${child.id}`} className="flex-1 text-center bg-[#F4F7F5] text-[#3A4A3E] py-2 rounded-xl text-sm font-bold border border-[#E0EAE2]">
                  編集する
                </Link>
                <Link href={`/nfc/${child.id}`} className="w-full text-center bg-[#EBF0FA] text-[#1A50A0] py-2 rounded-xl text-sm font-bold border border-[#A0BCE8]">
                  🏷️ NFCタグ / QR
                </Link>
              </div>
            </div>
          ))
        )}

        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-3">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🏷️ 新しいタグで登録する</div>
          <div className="text-sm text-[#7A8E80] mb-3">お手持ちの未登録の「おまもりタグ」を、NFCタッチかQR読み取りでそのまま登録できます。</div>

          {scanMode === 'idle' && (
            <div className="flex gap-2">
              <button
                onClick={startNfc}
                disabled={!nfcSupported}
                className="flex-1 bg-[#1A6640] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-40"
              >
                📱 NFCでタッチ
              </button>
              <button
                onClick={startQr}
                className="flex-1 bg-[#E6F4EC] text-[#1A6640] py-3 rounded-xl font-bold text-sm"
              >
                📷 QRを読み取る
              </button>
            </div>
          )}
          {!nfcSupported && scanMode === 'idle' && (
            <div className="text-xs text-[#7A8E80] mt-2">※ NFCタッチはAndroid（Chrome）のみ対応しています。それ以外の端末はQR読み取りをお使いください。</div>
          )}

          {scanMode === 'nfc' && (
            <div className="text-center py-6">
              <div className="text-4xl mb-2 animate-pulse">📱</div>
              <div className="text-sm font-bold text-[#0E1A12] mb-1">タグをスマホの背面に近づけてください…</div>
              <button onClick={stopScan} className="text-xs text-[#B83030] font-bold mt-2">キャンセル</button>
            </div>
          )}

          {scanMode === 'qr' && (
            <div className="text-center">
              <video ref={videoRef} playsInline muted className="w-full rounded-xl border border-[#E0EAE2] mb-2" />
              <div className="text-xs text-[#7A8E80] mb-2">封入カードのQRコードにカメラを向けてください</div>
              <button onClick={stopScan} className="text-xs text-[#B83030] font-bold">キャンセル</button>
            </div>
          )}
        </div>

        <Link href="/register" className="block w-full bg-white border border-[#E0EAE2] text-[#1A6640] text-center py-4 rounded-2xl font-bold text-lg mt-2 mb-3">
          ＋ タグなしで新しく登録する
        </Link>

        <Link href="/guide" className="flex items-center justify-between bg-white border border-[#E0EAE2] rounded-2xl px-4 py-3 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📘</span>
            <span className="font-bold text-sm text-[#0E1A12]">使い方ガイド</span>
          </div>
          <span className="text-[#7A8E80] text-sm">›</span>
        </Link>

        <Link href="/faq" className="flex items-center justify-between bg-white border border-[#E0EAE2] rounded-2xl px-4 py-3 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">❓</span>
            <span className="font-bold text-sm text-[#0E1A12]">よくある質問</span>
          </div>
          <span className="text-[#7A8E80] text-sm">›</span>
        </Link>

        <Link href="/inbox" className="flex items-center justify-between bg-white border border-[#E0EAE2] rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📬</span>
            <span className="font-bold text-sm text-[#0E1A12]">お知らせ一覧</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="bg-[#1A6640] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {unreadCount}件未読
              </span>
            )}
            <span className="text-[#7A8E80] text-sm">›</span>
          </div>
        </Link>
      </div>
    </main>
  )
}