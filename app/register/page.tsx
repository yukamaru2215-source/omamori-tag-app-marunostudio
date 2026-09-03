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

  // ログイン画面を経由してもタグ紐づけ先を忘れないよう保持しておく
  useEffect(() => {
    if (tagId) localStorage.setItem('pending_tag_id', tagId)
  }, [tagId])

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

  async function handleSubmit() {
    if (!agreed) { alert('利用規約に同意してください'); return }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
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

    // NFCタグ経由の登録なら、そのタグをこの子と紐づける
    if (tagId) {
      await supabase
        .from('tags')
        .update({ child_id: child.id, activated_at: new Date().toISOString() })
        .eq('id', tagId)
      localStorage.removeItem('pending_tag_id')
    }

    router.push('/dashboard')
  }

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
