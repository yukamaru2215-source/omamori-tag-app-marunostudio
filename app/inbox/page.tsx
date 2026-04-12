'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

type InboxMessage = {
  messageId: string
  title: string
  body: string
  sentAt: string
  nurseryName: string
  isRead: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

export default function InboxPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const parentId = session.user.id

      // 受信メッセージ一覧
      const { data: recipients } = await supabase
        .from('message_recipients')
        .select('message_id, messages(id, title, body, sent_at, nursery_id, nurseries(name))')
        .eq('parent_id', parentId)

      if (!recipients || recipients.length === 0) {
        setLoading(false)
        return
      }

      const messageIds = recipients.map((r) => r.message_id)

      // 既読状態
      const { data: reads } = await supabase
        .from('message_reads')
        .select('message_id')
        .eq('parent_id', parentId)
        .in('message_id', messageIds)

      const readSet = new Set((reads ?? []).map((r) => r.message_id))

      const items: InboxMessage[] = recipients
        .filter((r) => r.messages)
        .map((r) => {
          const msg = r.messages as unknown as {
            id: string
            title: string
            body: string
            sent_at: string
            nurseries: { name: string } | null
          }
          return {
            messageId: msg.id,
            title: msg.title,
            body: msg.body,
            sentAt: msg.sent_at,
            nurseryName: msg.nurseries?.name ?? '保育園',
            isRead: readSet.has(msg.id),
          }
        })

      setMessages(items)
      setLoading(false)

      updateBadge(items.filter((m) => !m.isRead).length)
    }
    load()
  }, [router])

  async function handleOpen(msg: InboxMessage) {
    setExpanded(expanded === msg.messageId ? null : msg.messageId)

    // 未読なら既読登録
    if (!msg.isRead) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      await supabase.from('message_reads').upsert(
        { message_id: msg.messageId, parent_id: session.user.id },
        { ignoreDuplicates: true }
      )
      setMessages((prev) => {
        const updated = prev.map((m) => m.messageId === msg.messageId ? { ...m, isRead: true } : m)
        updateBadge(updated.filter((m) => !m.isRead).length)
        return updated
      })
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-16">
      <div className="max-w-md mx-auto p-4">

        {/* ヘッダー */}
        <div className="flex items-center gap-3 py-4 mb-2">
          <button onClick={() => router.push('/dashboard')} className="text-[#7A8E80] text-sm">
            ← 戻る
          </button>
          <div>
            <div className="font-black text-xl text-[#0E1A12]">📬 お知らせ一覧</div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#E0EAE2]">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm text-[#7A8E80]">受信したお知らせはありません</div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.messageId}>
                <button
                  onClick={() => handleOpen(msg)}
                  className={`w-full text-left bg-white rounded-2xl px-4 py-4 border shadow-sm transition-all ${
                    msg.isRead ? 'border-[#E0EAE2]' : 'border-[#1A6640]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.isRead && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#1A6640]" />
                        )}
                        <span className="font-bold text-[#0E1A12] text-sm leading-snug">
                          {msg.title}
                        </span>
                      </div>
                      <div className="text-xs text-[#7A8E80]">
                        {msg.nurseryName}　{formatDate(msg.sentAt)}
                      </div>
                    </div>
                    <span className="text-[#7A8E80] text-xs flex-shrink-0 mt-0.5">
                      {expanded === msg.messageId ? '▲' : '▼'}
                    </span>
                  </div>
                </button>

                {/* 展開：本文 */}
                {expanded === msg.messageId && (
                  <div className="bg-white border border-t-0 border-[#E0EAE2] rounded-b-2xl px-5 py-4 -mt-1">
                    <div className="text-sm text-[#0E1A12] whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </div>
                    <div className="mt-3 text-xs text-[#7A8E80] text-right">
                      {msg.isRead ? '✅ 既読' : ''}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
