'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Group = { id: string; name: string }

type ChildRow = {
  id: string
  display_name: string
  full_name: string | null
  age: string
  has_epipen: boolean
  groups: Group[]
  parentRead: boolean | null // null = メッセージなし, true = 既読, false = 未読
}

function ChildCard({ child }: { child: ChildRow }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 border border-[#E0EAE2] shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4EC] flex items-center justify-center text-xl flex-shrink-0">
            {child.has_epipen ? '💉' : '👧'}
          </div>
          <div className="min-w-0">
            <div className="font-black text-[#0E1A12] text-sm">
              {child.display_name}
              {child.full_name && (
                <span className="font-normal text-[#7A8E80] text-xs ml-1">（{child.full_name}）</span>
              )}
            </div>
            <div className="text-xs text-[#7A8E80]">{child.age}</div>
          </div>
        </div>
        {child.parentRead === true && (
          <span className="flex-shrink-0 text-xs font-bold bg-[#E6F4EC] text-[#1A6640] px-2 py-1 rounded-full">✅ 既読</span>
        )}
        {child.parentRead === false && (
          <span className="flex-shrink-0 text-xs font-bold bg-[#FCEAEA] text-[#B83030] px-2 py-1 rounded-full">📭 未読</span>
        )}
      </div>
    </div>
  )
}

export default function StaffPage() {
  const router = useRouter()
  const [nurseryId, setNurseryId] = useState<string | null>(null)
  const [nurseryName, setNurseryName] = useState('')
  const [notAuthed, setNotAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'children' | 'groups'>('children')

  const [children, setChildren] = useState<ChildRow[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [latestMessageTitle, setLatestMessageTitle] = useState<string | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [savingGroup, setSavingGroup] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('staff_token')
    if (!raw) { setNotAuthed(true); setLoading(false); return }
    try {
      const token = JSON.parse(raw)
      if (new Date(token.expiresAt) < new Date()) { setNotAuthed(true); setLoading(false); return }
      setNurseryId(token.nurseryId)
    } catch {
      setNotAuthed(true); setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!nurseryId) return
    loadAll()
  }, [nurseryId])

  async function loadAll() {
    setLoading(true)

    // 園名・グループ・子ども・最新メッセージを並列取得
    const [
      { data: nurseryData },
      { data: groupsData },
      { data: childrenData },
      { data: latestMsg },
    ] = await Promise.all([
      supabase.from('nurseries').select('name').eq('id', nurseryId!).single(),
      supabase.from('groups').select('id, name').eq('nursery_id', nurseryId!).order('name'),
      supabase.from('children').select('id, display_name, full_name, age, has_epipen, parent_id').eq('nursery_id', nurseryId!).order('display_name'),
      supabase.from('messages').select('id, title').eq('nursery_id', nurseryId!).order('sent_at', { ascending: false }).limit(1),
    ])

    setNurseryName(nurseryData?.name ?? '')
    setGroups(groupsData ?? [])

    if (!childrenData || childrenData.length === 0) {
      setChildren([]); setLoading(false); return
    }

    const childIds = childrenData.map((c) => c.id)
    const parentIds = [...new Set(childrenData.map((c) => c.parent_id).filter(Boolean))]

    // 子どものグループ一覧を取得
    const { data: childGroupData } = await supabase
      .from('child_groups')
      .select('child_id, group_id')
      .in('child_id', childIds)

    const groupMap: Record<string, Group[]> = {}
    for (const cg of childGroupData ?? []) {
      const g = (groupsData ?? []).find((g) => g.id === cg.group_id)
      if (g) {
        if (!groupMap[cg.child_id]) groupMap[cg.child_id] = []
        groupMap[cg.child_id].push(g)
      }
    }

    // 最新メッセージの既読情報を取得
    let readParentIds = new Set<string>()
    let hasMessage = false
    if (latestMsg && latestMsg.length > 0) {
      hasMessage = true
      setLatestMessageTitle(latestMsg[0].title)
      const { data: reads } = await supabase
        .from('message_reads')
        .select('parent_id')
        .eq('message_id', latestMsg[0].id)
        .in('parent_id', parentIds)
      readParentIds = new Set((reads ?? []).map((r) => r.parent_id))
    } else {
      setLatestMessageTitle(null)
    }

    setChildren(
      childrenData.map((c) => ({
        id: c.id,
        display_name: c.display_name,
        full_name: c.full_name,
        age: c.age,
        has_epipen: c.has_epipen,
        groups: groupMap[c.id] ?? [],
        parentRead: hasMessage ? readParentIds.has(c.parent_id) : null,
      }))
    )
    setLoading(false)
  }

  async function handleAddGroup() {
    const name = newGroupName.trim()
    if (!name) return
    setSavingGroup(true)
    const { data, error } = await supabase
      .from('groups')
      .insert({ nursery_id: nurseryId, name })
      .select('id, name')
      .single()
    if (error || !data) {
      alert(`追加エラー: ${error?.message}`)
    } else {
      setGroups((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewGroupName('')
    }
    setSavingGroup(false)
  }

  async function handleDeleteGroup(groupId: string) {
    if (!confirm('このグループを削除しますか？')) return
    const { error } = await supabase.from('groups').delete().eq('id', groupId)
    if (error) { alert(`削除エラー: ${error.message}`); return }
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
    await loadAll()
  }

  // ── 認証切れ ──────────────────────────────────────────
  if (notAuthed) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🔒</div>
        <div className="font-black text-xl text-[#0E1A12] mb-3">保育士認証が必要です</div>
        <div className="text-sm text-[#7A8E80] leading-relaxed mb-6">
          保育士用NFCタグをかざして認証してください
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

  const readCount = children.filter((c) => c.parentRead === true).length
  const unreadCount = children.filter((c) => c.parentRead === false).length

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-16">
      <div className="max-w-md mx-auto p-4">

        {/* ヘッダー */}
        <div className="py-4 mb-2">
          <div className="text-xs text-[#7A8E80]">保育士メニュー</div>
          <div className="font-black text-xl text-[#0E1A12]">{nurseryName || '保育士ダッシュボード'}</div>
        </div>

        {/* 一斉連絡ボタン */}
        <button
          onClick={() => router.push('/messages')}
          className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-base mb-4 flex items-center justify-center gap-2"
        >
          ✉️ 一斉連絡を送る
        </button>

        {/* 最新メッセージの既読サマリー */}
        {latestMessageTitle && (
          <div className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm mb-4">
            <div className="text-xs font-black text-[#7A8E80] mb-2">📬 最新連絡の既読状況</div>
            <div className="text-sm font-bold text-[#0E1A12] mb-3 truncate">「{latestMessageTitle}」</div>
            <div className="flex gap-3">
              <div className="flex-1 bg-[#E6F4EC] rounded-xl px-3 py-2 text-center">
                <div className="text-lg font-black text-[#1A6640]">{readCount}</div>
                <div className="text-xs text-[#7A8E80]">既読</div>
              </div>
              <div className="flex-1 bg-[#FCEAEA] rounded-xl px-3 py-2 text-center">
                <div className="text-lg font-black text-[#B83030]">{unreadCount}</div>
                <div className="text-xs text-[#7A8E80]">未読</div>
              </div>
              <div className="flex-1 bg-[#F4F7F5] rounded-xl px-3 py-2 text-center">
                <div className="text-lg font-black text-[#7A8E80]">{children.length}</div>
                <div className="text-xs text-[#7A8E80]">園児数</div>
              </div>
            </div>
          </div>
        )}

        {/* タブ */}
        <div className="flex gap-2 mb-4">
          {(['children', 'groups'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={'flex-1 py-3 rounded-xl font-bold text-sm ' + (tab === t ? 'bg-[#1A6640] text-white' : 'bg-white text-[#7A8E80] border border-[#E0EAE2]')}>
              {t === 'children' ? `👶 園児一覧（${children.length}人）` : `👥 グループ管理`}
            </button>
          ))}
        </div>

        {/* ── 園児一覧 ── */}
        {tab === 'children' && (
          <div>
            {children.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E0EAE2] text-center">
                <div className="text-4xl mb-3">👶</div>
                <div className="text-sm text-[#7A8E80]">この園に登録された園児はいません</div>
              </div>
            ) : (
              <>
                {/* グループごとにセクション表示 */}
                {groups.map((group) => {
                  const inGroup = children.filter((c) => c.groups.some((g) => g.id === group.id))
                  if (inGroup.length === 0) return null
                  return (
                    <div key={group.id} className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-[#1A6640] bg-[#E6F4EC] px-3 py-1 rounded-full">{group.name}</span>
                        <span className="text-xs text-[#7A8E80]">{inGroup.length}人</span>
                      </div>
                      <div className="space-y-2">
                        {inGroup.map((child) => (
                          <ChildCard key={child.id} child={child} />
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* グループ未所属 */}
                {(() => {
                  const noGroup = children.filter((c) => c.groups.length === 0)
                  if (noGroup.length === 0) return null
                  return (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-[#7A8E80] bg-[#F4F7F5] px-3 py-1 rounded-full border border-[#E0EAE2]">グループ未所属</span>
                        <span className="text-xs text-[#7A8E80]">{noGroup.length}人</span>
                      </div>
                      <div className="space-y-2">
                        {noGroup.map((child) => (
                          <ChildCard key={child.id} child={child} />
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        )}

        {/* ── グループ管理 ── */}
        {tab === 'groups' && (
          <div>
            <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
              <div className="space-y-2 mb-4">
                {groups.length === 0 ? (
                  <div className="text-xs text-[#7A8E80] bg-[#F4F7F5] rounded-xl px-3 py-3 text-center">
                    グループはまだありません
                  </div>
                ) : (
                  groups.map((g) => (
                    <div key={g.id} className="flex items-center justify-between bg-[#F4F7F5] rounded-xl px-4 py-3">
                      <div>
                        <span className="text-sm font-bold text-[#0E1A12]">{g.name}</span>
                        <span className="text-xs text-[#7A8E80] ml-2">
                          {children.filter((c) => c.groups.some((cg) => cg.id === g.id)).length}人
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold"
                      >
                        削除
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddGroup() }}
                  className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
                  placeholder="例：ひまわり組"
                />
                <button
                  onClick={handleAddGroup}
                  disabled={savingGroup || !newGroupName.trim()}
                  className="bg-[#1A6640] text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {savingGroup ? '...' : '追加'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="max-w-md mx-auto px-4 pb-8 pt-4 border-t border-[#E0EAE2] mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7A8E80]">月額利用料 <span className="font-bold text-[#0E1A12]">¥1,000</span>（税込）</div>
            <div className="text-xs text-[#7A8E80] mt-0.5">提供：marunostudio</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marunostudio-logo.jpg" alt="marunostudio" className="h-8 object-contain opacity-80" />
        </div>
      </div>
    </main>
  )
}
