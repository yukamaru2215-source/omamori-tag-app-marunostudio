'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Child } from '@/lib/types'
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
      if (window.location.hash) {
        await supabase.auth.getSession()
        window.history.replaceState(null, '', window.location.pathname)
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
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

        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
          登録済みのお子様
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#E0EAE2] shadow-sm mb-4">
            <div className="text-3xl mb-2">👶</div>
            <div className="text-sm text-[#7A8E80]">まだ登録されていません</div>
          </div>
        ) : (
          children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EC] flex items-center justify-center text-2xl">👧</div>
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

        <Link href="/register" className="block w-full bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg mt-2 mb-3">
          ＋ お子様を登録する
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