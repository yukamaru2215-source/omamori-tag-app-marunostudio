'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Group = { id: string; name: string }

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagId = searchParams.get('tagId')
  const [checkingTag, setCheckingTag] = useState(true)
  const [alreadyLinked, setAlreadyLinked] = useState(false)
  const [existingChildren, setExistingChildren] = useState<{ id: string; display_name: string; age: string }[] | null>(null)
  const [linkingChildId, setLinkingChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [nurseryCode, setNurseryCode] = useState('')
  const [nurseryName, setNurseryName] = useState('')
  const [nurseryId, setNurseryId] = useState('')
  const [nurseryError, setNurseryError] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [age, setAge] = useState('')
  const [agreed, setAgreed] = useState(false)

  // グループ
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  // 入力を始める前に、タグの状態とログイン状態を確認する。
  // 先に入力させてからログインを求めると、ログイン後にもう一度同じ内容を入力させることになるため、
  // 未ログインならフォームを見せる前にログイン画面へ送る。
  useEffect(() => {
    let cancelled = false
    async function check() {
      if (tagId) {
        const { data: tag } = await supabase
          .from('tags')
          .select('child_id')
          .eq('id', tagId)
          .single()
        if (cancelled) return
        if (tag?.child_id) {
          setAlreadyLinked(true)
          setCheckingTag(false)
          return
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        router.replace(tagId ? `/login?tagId=${encodeURIComponent(tagId)}` : '/login')
        return
      }

      // タグ経由かつ既にお子様を登録済みなら、新規作成ではなく既存のお子様への紐づけを選べるようにする
      // （NFCタグ経由で「新しく登録」しか出せず、既に作った情報にたどり着けなくなる不具合を防ぐ）
      if (tagId) {
        const { data: kids } = await supabase
          .from('children')
          .select('id, display_name, age')
          .eq('parent_id', session.user.id)
        if (cancelled) return
        if (kids && kids.length > 0) {
          setExistingChildren(kids)
          setCheckingTag(false)
          return
        }
      }

      setCheckingTag(false)
    }
    check()
    return () => { cancelled = true }
  }, [tagId, router])

  async function checkNurseryCode() {
    if (!nurseryCode) return
    const { data, error } = await supabase
      .from('nurseries')
      .select('id, name')
      .eq('code', nurseryCode.toUpperCase())
      .single()
    if (error || !data) {
      setNurseryError('施設コードが見つかりません')
      setNurseryName('')
      setNurseryId('')
      setGroups([])
      setSelectedGroupIds([])
    } else {
      setNurseryError('')
      setNurseryName(data.name)
      setNurseryId(data.id)
      // 該当園のグループを読み込む
      const { data: groupData } = await supabase
        .from('groups')
        .select('id, name')
        .eq('nursery_id', data.id)
        .order('name')
      setGroups(groupData ?? [])
      setSelectedGroupIds([])
    }
  }

  function toggleGroup(id: string) {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  async function handleLinkExisting(childId: string) {
    if (!tagId) return
    setLinkingChildId(childId)
    const { data, error } = await supabase
      .from('tags')
      .update({ child_id: childId, activated_at: new Date().toISOString() })
      .eq('id', tagId)
      .is('child_id', null)
      .select('id')
    setLinkingChildId(null)
    if (error || !data || data.length === 0) {
      alert('タグの紐づけに失敗しました。既に別の登録で使用されている可能性があります。')
      return
    }
    router.push('/dashboard')
  }

  async function handleSubmit() {
    if (!agreed) { alert('利用規約に同意してください'); return }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // 通常はこの画面に来る時点でログイン済みのはずだが、セッション切れなどへの保険
      router.push(tagId ? `/login?tagId=${encodeURIComponent(tagId)}` : '/login')
      return
    }

    const { data: child, error } = await supabase
      .from('children')
      .insert({
        display_name: displayName,
        age: age,
        parent_id: session.user.id,
        nursery_id: nurseryId || null,
        has_epipen: false,
      })
      .select('id')
      .single()

    if (error || !child) {
      alert('エラーが発生しました')
      setLoading(false)
      return
    }

    // グループ登録
    if (selectedGroupIds.length > 0) {
      await supabase.from('child_groups').insert(
        selectedGroupIds.map((groupId) => ({ child_id: child.id, group_id: groupId }))
      )
    }

    // NFCタグ経由の登録なら、そのタグをこの子と紐づける（未紐づけの場合のみ。二重登録防止）
    if (tagId) {
      const { data: linkedTag, error: tagError } = await supabase
        .from('tags')
        .update({ child_id: child.id, activated_at: new Date().toISOString() })
        .eq('id', tagId)
        .is('child_id', null)
        .select('id')
      if (tagError || !linkedTag || linkedTag.length === 0) {
        alert(`お子様の登録は完了しましたが、タグとの紐づけに失敗しました。\n${tagError ? tagError.message : 'タグが見つからないか、既に別の登録で使用されています。'}`)
      }
    }

    router.push('/dashboard')
  }

  if (checkingTag) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (alreadyLinked) return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-4">✅</div>
      <div className="font-black text-xl text-[#0E1A12] mb-2">このタグは登録済みです</div>
      <div className="text-sm text-[#7A8E80] mb-6">このおまもりタグは既に設定が完了しています。二重登録を防ぐため、新しい登録はできません。</div>
      <Link href="/dashboard" className="bg-[#1A6640] text-white px-6 py-3 rounded-2xl font-bold text-sm">ダッシュボードへ</Link>
    </main>
  )

  if (existingChildren) return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center gap-3 py-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">タグの登録</div>
        </div>

        <div className="bg-[#E6F4EC] border border-[#B8D9C8] rounded-2xl px-4 py-3 mb-4 flex items-start gap-2">
          <span className="text-lg flex-shrink-0">🏷️</span>
          <div className="text-sm text-[#1A6640] leading-relaxed">
            このタグをどのお子様に紐づけますか？すでに登録済みのお子様に紐づけるか、新しくお子様を登録できます。
          </div>
        </div>

        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">登録済みのお子様</div>

        {existingChildren.map((kid) => (
          <div key={kid.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-black text-[#0E1A12]">{kid.display_name}</div>
              <div className="text-xs text-[#7A8E80]">{kid.age}</div>
            </div>
            <button
              onClick={() => handleLinkExisting(kid.id)}
              disabled={linkingChildId !== null}
              className="bg-[#1A6640] text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50 flex-shrink-0"
            >
              {linkingChildId === kid.id ? '処理中...' : 'このタグを紐づける'}
            </button>
          </div>
        ))}

        <button
          onClick={() => setExistingChildren(null)}
          disabled={linkingChildId !== null}
          className="w-full mt-2 bg-white border border-[#E0EAE2] text-[#1A6640] py-3 rounded-2xl font-bold text-sm disabled:opacity-50"
        >
          ＋ 新しくお子様を登録する
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-32">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 py-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">新しく登録</div>
        </div>

        {tagId && (
          <div className="bg-[#E6F4EC] border border-[#B8D9C8] rounded-2xl px-4 py-3 mb-4 flex items-start gap-2">
            <span className="text-lg flex-shrink-0">🏷️</span>
            <div className="text-sm text-[#1A6640] leading-relaxed">
              おまもりタグの初期設定です。下の情報を入力して「登録する」を押すと、このタグで使えるようになります。
            </div>
          </div>
        )}

        {/* 基本情報 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm space-y-4 mb-4">
          <div>
            <label className="block text-xs font-black text-[#7A8E80] mb-1">呼び名 *</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：ゆき" />
          </div>
          <div>
            <label className="block text-xs font-black text-[#7A8E80] mb-1">年齢 *</label>
            <input value={age} onChange={e => setAge(e.target.value)}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：5歳" />
          </div>
        </div>

        {/* 施設コード */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">🏫 施設との紐づけ（任意）</div>
          <div className="text-sm text-[#7A8E80] mb-3">施設から配布された施設コードを入力してください。</div>
          <div className="flex gap-2">
            <input value={nurseryCode} onChange={e => setNurseryCode(e.target.value)}
              className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none font-mono"
              placeholder="例：HIMAWARI" />
            <button onClick={checkNurseryCode} className="bg-[#1A6640] text-white px-4 py-3 rounded-xl font-bold text-sm">確認</button>
          </div>
          {nurseryError && <div className="text-xs text-[#B83030] mt-2">{nurseryError}</div>}
          {nurseryName && (
            <div className="mt-3 bg-[#E6F4EC] rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <div>
                <div className="font-bold text-[#1A6640] text-sm">{nurseryName}</div>
                <div className="text-xs text-[#7A8E80]">施設コードが確認できました</div>
              </div>
            </div>
          )}
        </div>

        {/* グループ選択（園が確認された場合のみ表示） */}
        {nurseryName && (
          <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
            <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">👥 グループ（任意）</div>
            {groups.length === 0 ? (
              <div className="text-sm text-[#7A8E80]">この園にはグループが設定されていません</div>
            ) : (
              <>
                <div className="text-sm text-[#7A8E80] mb-3">所属するグループを選択してください（複数可）</div>
                <div className="space-y-2">
                  {groups.map((g) => (
                    <label key={g.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#F4F7F5]">
                      <div
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedGroupIds.includes(g.id) ? 'bg-[#1A6640] border-[#1A6640]' : 'bg-white border-[#E0EAE2]'}`}
                        onClick={() => toggleGroup(g.id)}
                      >
                        {selectedGroupIds.includes(g.id) && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <span className="text-sm font-bold text-[#0E1A12]">{g.name}</span>
                      <input type="checkbox" className="sr-only" checked={selectedGroupIds.includes(g.id)} onChange={() => toggleGroup(g.id)} />
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 規約同意 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-[#1A6640] border-[#1A6640]' : 'bg-white border-[#E0EAE2]'}`}>
                {agreed && <span className="text-white text-xs font-black">✓</span>}
              </div>
            </div>
            <div className="text-sm text-[#3A4A3E] leading-relaxed">
              <Link href="/terms" className="text-[#1A6640] font-bold underline">利用規約</Link>
              {' '}および{' '}
              <Link href="/privacy" className="text-[#1A6640] font-bold underline">プライバシーポリシー</Link>
              に同意します
            </div>
          </label>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4F7F5] border-t border-[#E0EAE2]">
        <div className="max-w-md mx-auto">
          <button onClick={handleSubmit} disabled={loading || !displayName || !age || !agreed}
            className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50">
            {loading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-[#7A8E80]">読み込み中...</div>
      </main>
    }>
      <RegisterContent />
    </Suspense>
  )
}
