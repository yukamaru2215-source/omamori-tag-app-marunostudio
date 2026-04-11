'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Group = { id: string; name: string }

type Message = {
  id: string
  title: string
  body: string
  send_to: 'all' | 'groups'
  group_ids: string[]
  recipient_count: number
  sent_at: string
  read_count?: number
}

type ReadEntry = { parent_id: string; read_at: string }
type RecipientEntry = { parent_id: string; email: string; label: string }

export default function MessagesPage() {
  const router = useRouter()
  const [nurseryId, setNurseryId] = useState<string | null>(null)
  const [notAuthed, setNotAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'list' | 'create'>('list')

  const [groups, setGroups] = useState<Group[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [details, setDetails] = useState<Record<string, { reads: ReadEntry[]; recipients: RecipientEntry[] }>>({})

  // 作成フォーム
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sendTo, setSendTo] = useState<'all' | 'groups'>('all')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [remindingId, setRemindingId] = useState<string | null>(null)

  // 保育士認証チェック（sessionStorage）
  useEffect(() => {
    const raw = sessionStorage.getItem('staff_token')
    if (!raw) { setNotAuthed(true); setLoading(false); return }
    try {
      const token = JSON.parse(raw)
      if (new Date(token.expiresAt) < new Date()) { setNotAuthed(true); setLoading(false); return }
      setNurseryId(token.nurseryId)
    } catch {
      setNotAuthed(true)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!nurseryId) return
    loadData()
  }, [nurseryId])

  async function loadData() {
    setLoading(true)
    const [{ data: gData }, { data: mData }] = await Promise.all([
      supabase.from('groups').select('id, name').eq('nursery_id', nurseryId!).order('name'),
      supabase.from('messages').select('*').eq('nursery_id', nurseryId!).order('sent_at', { ascending: false }),
    ])
    setGroups(gData ?? [])

    if (mData && mData.length > 0) {
      const { data: reads } = await supabase
        .from('message_reads')
        .select('message_id')
        .in('message_id', mData.map((m) => m.id))

      const counts: Record<string, number> = {}
      for (const r of reads ?? []) counts[r.message_id] = (counts[r.message_id] ?? 0) + 1
      setMessages(mData.map((m) => ({ ...m, read_count: counts[m.id] ?? 0 })))
    } else {
      setMessages([])
    }
    setLoading(false)
  }

  async function loadDetails(messageId: string) {
    const [{ data: reads }, { data: recipients }] = await Promise.all([
      supabase.from('message_reads').select('parent_id, read_at').eq('message_id', messageId),
      supabase.from('message_recipients').select('parent_id, email').eq('message_id', messageId),
    ])

    // 保護者IDから「一番年上の子」の名前を取得
    const parentIds = (recipients ?? []).map((r) => r.parent_id)
    const { data: childrenData } = parentIds.length > 0
      ? await supabase.from('children').select('parent_id, display_name, age').in('parent_id', parentIds)
      : { data: [] }

    // 各保護者の一番年上の子の名前を決定
    const parentLabelMap: Record<string, string> = {}
    for (const parentId of parentIds) {
      const kids = (childrenData ?? []).filter((c) => c.parent_id === parentId)
      if (kids.length === 0) continue
      const oldest = kids.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0))[0]
      parentLabelMap[parentId] = oldest.display_name
    }

    const recipientsWithLabel = (recipients ?? []).map((r) => ({
      ...r,
      label: parentLabelMap[r.parent_id] ?? r.email,
    }))

    setDetails((prev) => ({ ...prev, [messageId]: { reads: reads ?? [], recipients: recipientsWithLabel } }))
  }

  async function handleExpand(id: string) {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    if (!details[id]) await loadDetails(id)
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) { alert('タイトルと本文を入力してください'); return }
    if (sendTo === 'groups' && selectedGroups.length === 0) { alert('グループを1つ以上選択してください'); return }
    setSending(true)
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nursery_id: nurseryId,
          title: title.trim(),
          body: body.trim(),
          send_to: sendTo,
          group_ids: sendTo === 'groups' ? selectedGroups : [],
        }),
      })
      const result = await res.json()
      if (res.ok) {
        alert(`✅ ${result.sentCount}件のメールを送信しました`)
        setTitle(''); setBody(''); setSendTo('all'); setSelectedGroups([])
        setTab('list')
        await loadData()
      } else {
        alert(`エラー: ${result.error}`)
      }
    } finally {
      setSending(false)
    }
  }

  async function handleReminder(messageId: string) {
    setRemindingId(messageId)
    try {
      const res = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId }),
      })
      const result = await res.json()
      if (res.ok) {
        alert(result.sentCount === 0 ? '全員が既に開封済みです' : `✅ ${result.sentCount}件にリマインドを送信しました`)
        await loadDetails(messageId)
        await loadData()
      } else {
        alert(`エラー: ${result.error}`)
      }
    } finally {
      setRemindingId(null)
    }
  }

  function toggleGroup(id: string) {
    setSelectedGroups((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id])
  }

  // ─── 認証切れ ───────────────────────────────────────────
  if (notAuthed) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🔒</div>
        <div className="font-black text-xl text-[#0E1A12] mb-3">保育士認証が必要です</div>
        <div className="text-sm text-[#7A8E80] leading-relaxed mb-6">
          保育士用NFCタグをかざして認証後、<br />このページにアクセスしてください。
        </div>
        <button onClick={() => router.push('/')} className="text-sm text-[#7A8E80]">← トップページへ</button>
      </div>
    </main>
  )

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-16">
      <div className="max-w-md mx-auto p-4">

        {/* ヘッダー */}
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A8E80]">保育士メニュー</div>
            <div className="font-black text-xl text-[#0E1A12]">一斉連絡</div>
          </div>
          <button onClick={() => router.back()} className="text-sm text-[#7A8E80] border border-[#E0EAE2] px-3 py-2 rounded-xl bg-white">← 戻る</button>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-6">
          {(['list', 'create'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={'flex-1 py-3 rounded-xl font-bold text-sm ' + (tab === t ? 'bg-[#1A6640] text-white' : 'bg-white text-[#7A8E80] border border-[#E0EAE2]')}>
              {t === 'list' ? '📬 送信済み一覧' : '✉️ 連絡を作成'}
            </button>
          ))}
        </div>

        {/* ── 送信済み一覧 ── */}
        {tab === 'list' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E0EAE2] text-center">
                <div className="text-4xl mb-3">📭</div>
                <div className="font-bold text-[#0E1A12] mb-1">送信済みの連絡はありません</div>
                <div className="text-xs text-[#7A8E80]">「連絡を作成」タブから送信できます</div>
              </div>
            ) : (
              messages.map((msg) => {
                const isOpen = expandedId === msg.id
                const d = details[msg.id]
                const readIds = new Set((d?.reads ?? []).map((r) => r.parent_id))
                const unread = (d?.recipients ?? []).filter((r) => !readIds.has(r.parent_id))
                const pct = msg.recipient_count > 0
                  ? Math.round(((msg.read_count ?? 0) / msg.recipient_count) * 100) : 0

                return (
                  <div key={msg.id} className="bg-white rounded-2xl border border-[#E0EAE2] shadow-sm overflow-hidden">
                    <button onClick={() => handleExpand(msg.id)} className="w-full text-left px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#0E1A12] text-sm mb-1 truncate">{msg.title}</div>
                          <div className="text-xs text-[#7A8E80]">
                            {new Date(msg.sent_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            {msg.send_to === 'groups' && (
                              <span className="ml-2 bg-[#EBF0FA] text-[#1A50A0] px-2 py-0.5 rounded-full text-xs">グループ指定</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-xs font-black px-2 py-1 rounded-full ${pct === 100 ? 'bg-[#E6F4EC] text-[#1A6640]' : pct >= 50 ? 'bg-[#FFF9E6] text-[#A07010]' : 'bg-[#FCEAEA] text-[#B83030]'}`}>
                            {msg.read_count ?? 0}/{msg.recipient_count}人
                          </div>
                          <div className="text-xs text-[#7A8E80] mt-1">{pct}%開封</div>
                        </div>
                      </div>
                      <div className="mt-3 bg-[#F4F7F5] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-[#1A6640] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#E0EAE2] px-5 py-4">
                        {/* 本文プレビュー */}
                        <div className="text-xs text-[#3A4A3E] bg-[#F4F7F5] rounded-xl p-3 mb-4 whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                          {msg.body}
                        </div>

                        {!d ? (
                          <div className="text-xs text-[#7A8E80] text-center py-2">読み込み中...</div>
                        ) : (
                          <>
                            {/* 開封済み */}
                            {d.reads.length > 0 && (
                              <div className="mb-3">
                                <div className="text-xs font-black text-[#1A6640] mb-2">✅ 開封済み（{d.reads.length}人）</div>
                                <div className="space-y-1">
                                  {d.reads.map((r) => {
                                    const rec = d.recipients.find((rec) => rec.parent_id === r.parent_id)
                                    return (
                                      <div key={r.parent_id} className="flex justify-between text-xs text-[#3A4A3E] bg-[#E6F4EC] rounded-lg px-3 py-1.5">
                                        <span className="truncate font-bold">{rec?.label ?? '—'}</span>
                                        <span className="text-[#7A8E80] ml-2 flex-shrink-0">
                                          {new Date(r.read_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 未開封 */}
                            {unread.length > 0 && (
                              <div className="mb-4">
                                <div className="text-xs font-black text-[#B83030] mb-2">📭 未開封（{unread.length}人）</div>
                                <div className="space-y-1">
                                  {unread.map((r) => (
                                    <div key={r.parent_id} className="text-xs font-bold text-[#3A4A3E] bg-[#FCEAEA] rounded-lg px-3 py-1.5 truncate">
                                      {r.label}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* リマインドボタン */}
                            {unread.length > 0 && (
                              <button
                                onClick={() => handleReminder(msg.id)}
                                disabled={remindingId === msg.id}
                                className="w-full bg-[#EBF0FA] text-[#1A50A0] py-2.5 rounded-xl font-bold text-xs disabled:opacity-50"
                              >
                                {remindingId === msg.id ? '送信中...' : `🔔 未開封の${unread.length}人にリマインド送信`}
                              </button>
                            )}

                            {unread.length === 0 && d.reads.length > 0 && (
                              <div className="text-center text-xs text-[#1A6640] font-bold py-2">
                                🎉 全員が開封済みです
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── 連絡を作成 ── */}
        {tab === 'create' && (
          <div className="space-y-4">
            {/* 件名 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
              <label className="block text-xs font-black text-[#7A8E80] mb-2">件名 *</label>
              <input
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="例：運動会のお知らせ"
              />
            </div>

            {/* 本文 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
              <label className="block text-xs font-black text-[#7A8E80] mb-2">本文 *</label>
              <textarea
                value={body} onChange={(e) => setBody(e.target.value)} rows={7}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none resize-none"
                placeholder="保護者へのメッセージを入力してください"
              />
            </div>

            {/* 送信先 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
              <div className="text-xs font-black text-[#7A8E80] mb-3">送信先</div>

              <div className="space-y-3">
                {/* 園全体 */}
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#F4F7F5]">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sendTo === 'all' ? 'border-[#1A6640] bg-[#1A6640]' : 'border-[#E0EAE2]'}`}>
                    {sendTo === 'all' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0E1A12]">🏫 園全体</div>
                    <div className="text-xs text-[#7A8E80]">この園の全保護者に送信</div>
                  </div>
                  <input type="radio" className="sr-only" checked={sendTo === 'all'} onChange={() => { setSendTo('all'); setSelectedGroups([]) }} />
                </label>

                {/* グループ指定 */}
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#F4F7F5]">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sendTo === 'groups' ? 'border-[#1A6640] bg-[#1A6640]' : 'border-[#E0EAE2]'}`}>
                    {sendTo === 'groups' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0E1A12]">👥 グループ指定</div>
                    <div className="text-xs text-[#7A8E80]">特定のグループに送信（複数可）</div>
                  </div>
                  <input type="radio" className="sr-only" checked={sendTo === 'groups'} onChange={() => setSendTo('groups')} />
                </label>
              </div>

              {/* グループチェックボックス */}
              {sendTo === 'groups' && (
                <div className="mt-4 pt-4 border-t border-[#E0EAE2]">
                  {groups.length === 0 ? (
                    <div className="text-xs text-[#7A8E80] bg-[#F4F7F5] rounded-xl p-3 text-center">
                      グループが設定されていません。<br />管理者画面でグループを追加してください。
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-[#7A8E80] mb-1">送信するグループを選択</div>
                      {groups.map((g) => (
                        <label key={g.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#F4F7F5]">
                          <div
                            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedGroups.includes(g.id) ? 'bg-[#1A6640] border-[#1A6640]' : 'bg-white border-[#E0EAE2]'}`}
                            onClick={() => toggleGroup(g.id)}
                          >
                            {selectedGroups.includes(g.id) && <span className="text-white text-xs font-black">✓</span>}
                          </div>
                          <span className="text-sm font-bold text-[#0E1A12]">{g.name}</span>
                          <input type="checkbox" className="sr-only" checked={selectedGroups.includes(g.id)} onChange={() => toggleGroup(g.id)} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 送信ボタン */}
            <button
              onClick={handleSend}
              disabled={sending || !title.trim() || !body.trim() || (sendTo === 'groups' && selectedGroups.length === 0)}
              className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50"
            >
              {sending ? '送信中...' : '✉️ メールを送信する'}
            </button>
            <div className="text-xs text-[#7A8E80] text-center pb-4">送信後のキャンセルはできません</div>
          </div>
        )}
      </div>
    </main>
  )
}
