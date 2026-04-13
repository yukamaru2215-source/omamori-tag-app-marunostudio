'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Nursery = {
  id: string
  name: string
  code: string | null
  staff_auth_key: string
  created_at: string
}

type Group = { id: string; name: string }

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [nurseries, setNurseries] = useState<Nursery[]>([])
  const [newName, setNewName] = useState('')
  const [newPin, setNewPin] = useState('')
  const [newCode, setNewCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [reissuedId, setReissuedId] = useState<string | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)
  const [pins, setPins] = useState<Record<string, string>>({})
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [savedPin, setSavedPin] = useState<string | null>(null)

  // グループ管理
  const [groups, setGroups] = useState<Record<string, Group[]>>({})
  const [newGroupNames, setNewGroupNames] = useState<Record<string, string>>({})
  const [savingGroup, setSavingGroup] = useState<string | null>(null)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== adminEmail) { router.push('/'); return }
      setAuthorized(true)
      await Promise.all([loadNurseries(), loadAllGroups()])
      setLoading(false)
    }
    init()
  }, [])

  async function loadNurseries() {
    const { data } = await supabase
      .from('nurseries')
      .select('*')
      .order('created_at', { ascending: false })
    setNurseries(data ?? [])
  }

  async function loadAllGroups() {
    const { data } = await supabase
      .from('groups')
      .select('id, name, nursery_id')
      .order('name')
    if (!data) return
    const map: Record<string, Group[]> = {}
    for (const g of data) {
      if (!map[g.nursery_id]) map[g.nursery_id] = []
      map[g.nursery_id].push({ id: g.id, name: g.name })
    }
    setGroups(map)
  }

  async function handleAdd() {
    if (!newName || !newPin) return
    setAdding(true)

    const { data, error } = await supabase
      .from('nurseries')
      .insert({ name: newName, code: newCode.toUpperCase() || null })
      .select()
      .single()

    if (error || !data) {
      alert(`エラー: ${error?.message}`)
      setAdding(false)
      return
    }

    const { error: pinError } = await supabase.rpc('set_staff_pin', {
      p_nursery_id: data.id,
      p_pin: newPin,
    })

    if (pinError) {
      alert(`PIN設定エラー: ${pinError.message}`)
      setAdding(false)
      return
    }

    setNewName(''); setNewPin(''); setNewCode('')
    await loadNurseries()
    setAdding(false)
  }

  async function handleReissue(nurseryId: string) {
    if (!confirm('キーを再発行しますか？古いNFCタグは即座に無効になります。')) return
    await supabase.rpc('reissue_staff_key', { p_nursery_id: nurseryId })
    setReissuedId(nurseryId)
    setTimeout(() => setReissuedId(null), 3000)
    await loadNurseries()
  }

  async function handleUpdatePin(nurseryId: string) {
    const pin = pins[nurseryId]
    if (!pin || pin.length !== 4) { alert('4桁のPINを入力してください'); return }
    const { error } = await supabase.rpc('set_staff_pin', {
      p_nursery_id: nurseryId,
      p_pin: pin,
    })
    if (error) { alert(`エラー: ${error.message}`); return }
    setPins({ ...pins, [nurseryId]: '' })
    setSavedPin(nurseryId)
    setTimeout(() => setSavedPin(null), 2000)
  }

  async function handleUpdateCode(nurseryId: string) {
    const code = codes[nurseryId]
    if (!code) return
    const { error } = await supabase
      .from('nurseries')
      .update({ code: code.toUpperCase() })
      .eq('id', nurseryId)
    if (error) { alert('このコードは既に使われています'); return }
    setCodes({ ...codes, [nurseryId]: '' })
    await loadNurseries()
  }

  async function handleAddGroup(nurseryId: string) {
    const name = (newGroupNames[nurseryId] ?? '').trim()
    if (!name) return
    setSavingGroup(nurseryId)
    const { data, error } = await supabase
      .from('groups')
      .insert({ nursery_id: nurseryId, name })
      .select('id, name')
      .single()
    if (error || !data) {
      alert(`グループ追加エラー: ${error?.message}`)
    } else {
      setGroups((prev) => ({
        ...prev,
        [nurseryId]: [...(prev[nurseryId] ?? []), data],
      }))
      setNewGroupNames((prev) => ({ ...prev, [nurseryId]: '' }))
    }
    setSavingGroup(null)
  }

  async function handleDeleteGroup(groupId: string, nurseryId: string) {
    if (!confirm('このグループを削除しますか？子どもとのグループ紐づけも削除されます。')) return
    const { error } = await supabase.from('groups').delete().eq('id', groupId)
    if (error) { alert(`削除エラー: ${error.message}`); return }
    setGroups((prev) => ({
      ...prev,
      [nurseryId]: (prev[nurseryId] ?? []).filter((g) => g.id !== groupId),
    }))
  }

  function getStaffUrl(nursery: Nursery) {
    return `${baseUrl}/staff-auth?nursery=${nursery.id}&key=${nursery.staff_auth_key}`
  }

  function getStaffDashboardUrl(nursery: Nursery) {
    return `${baseUrl}/staff-auth?nursery=${nursery.id}&key=${nursery.staff_auth_key}&redirect=/staff`
  }

  function copyUrl(nursery: Nursery) {
    navigator.clipboard.writeText(getStaffUrl(nursery))
    setCopiedId(nursery.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const [copiedDashId, setCopiedDashId] = useState<string | null>(null)

  function copyDashUrl(nursery: Nursery) {
    navigator.clipboard.writeText(getStaffDashboardUrl(nursery))
    setCopiedDashId(nursery.id)
    setTimeout(() => setCopiedDashId(null), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (!authorized) return null

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A8E80]">管理者画面</div>
            <div className="font-black text-xl text-[#0E1A12]">園の管理</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.open('/admin/proposal', '_blank')} className="text-sm text-[#1A6640] border border-[#B2D8C0] px-3 py-2 rounded-xl bg-[#E6F4EC] font-bold">📋 提案書</button>
            <button onClick={() => window.open('/admin/flyer-staff', '_blank')} className="text-sm text-[#1A6640] border border-[#B2D8C0] px-3 py-2 rounded-xl bg-[#E6F4EC] font-bold">👩‍🏫 スタッフ向け</button>
            <button onClick={() => window.open('/admin/flyer', '_blank')} className="text-sm text-[#1A6640] border border-[#B2D8C0] px-3 py-2 rounded-xl bg-[#E6F4EC] font-bold">🏷️ 保護者向け</button>
            <button onClick={() => router.push('/dashboard')} className="text-sm text-[#7A8E80] border border-[#E0EAE2] px-3 py-2 rounded-xl bg-white">← 戻る</button>
          </div>
        </div>

        {/* 新規追加 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-6">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-4">🏫 新しい園を追加</div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">園名 *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="例：ひまわり保育園" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">園コード（保護者に伝える短いコード）</label>
              <input value={newCode} onChange={e => setNewCode(e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none font-mono" placeholder="例：HIMAWARI" maxLength={20} autoComplete="off" autoCorrect="off" autoCapitalize="characters" spellCheck={false} style={{ textTransform: 'uppercase' }} />
              <div className="text-xs text-[#7A8E80] mt-1">英数字・大文字で保存されます</div>
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">保育士PIN（4桁）*</label>
              <input value={newPin} onChange={e => setNewPin(e.target.value.slice(0, 4))} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="例：1234" type="number" />
            </div>
            <button onClick={handleAdd} disabled={adding || !newName || !newPin} className="w-full bg-[#1A6640] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {adding ? '追加中...' : '＋ 追加する'}
            </button>
          </div>
        </div>

        {/* 園一覧 */}
        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
          登録済みの園（{nurseries.length}件）
        </div>

        {nurseries.map(n => (
          <div key={n.id} className="bg-white rounded-2xl border border-[#E0EAE2] shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="font-black text-[#0E1A12] text-lg">{n.name}</div>
              {n.code ? (
                <div className="mt-2 inline-flex items-center gap-2 bg-[#E6F4EC] px-3 py-1 rounded-full">
                  <span className="text-xs text-[#7A8E80]">園コード:</span>
                  <span className="font-black text-[#1A6640] font-mono text-lg">{n.code}</span>
                </div>
              ) : (
                <div className="text-xs text-[#B83030] mt-1">園コード未設定</div>
              )}
            </div>

            {/* 園コード更新 */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🔤 園コードを変更</div>
              <div className="flex gap-2">
                <input value={codes[n.id] ?? ''} onChange={e => setCodes({ ...codes, [n.id]: e.target.value })} className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-2 text-sm outline-none font-mono" placeholder="新しい園コード" maxLength={20} autoComplete="off" autoCorrect="off" autoCapitalize="characters" spellCheck={false} style={{ textTransform: 'uppercase' }} />
                <button onClick={() => handleUpdateCode(n.id)} className="bg-[#E6F4EC] text-[#1A6640] px-4 py-2 rounded-xl font-bold text-xs">更新</button>
              </div>
            </div>

            {/* 保育士NFC URL */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🏷️ 保育士用NFCタグURL</div>
              <div className="bg-[#F4F7F5] rounded-xl px-3 py-2 text-xs font-mono text-[#0E1A12] break-all mb-3 border border-[#E0EAE2]">
                {getStaffUrl(n)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyUrl(n)} className="flex-1 bg-[#1A6640] text-white py-2 rounded-xl font-bold text-xs">
                  {copiedId === n.id ? '✓ コピー済み' : '📋 URLをコピー'}
                </button>
                <button onClick={() => setShowQR(showQR === n.id ? null : n.id)} className="flex-1 bg-[#EBF0FA] text-[#1A50A0] py-2 rounded-xl font-bold text-xs">
                  📱 QRコード
                </button>
              </div>
              {showQR === n.id && (
                <div className="mt-3 text-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getStaffUrl(n))}`} alt="QRコード" className="mx-auto rounded-xl" width={180} height={180} />
                  <div className="text-xs text-[#7A8E80] mt-2">保育士用NFCタグに書き込むURL</div>
                </div>
              )}
            </div>

            {/* スタッフダッシュボードURL */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">👩‍🏫 スタッフ用ダッシュボードURL</div>
              <div className="text-xs text-[#7A8E80] mb-2">認証後に保育士ダッシュボードへ直接移動するURL</div>
              <div className="bg-[#F4F7F5] rounded-xl px-3 py-2 text-xs font-mono text-[#0E1A12] break-all mb-3 border border-[#E0EAE2]">
                {getStaffDashboardUrl(n)}
              </div>
              <button onClick={() => copyDashUrl(n)} className="w-full bg-[#EBF0FA] text-[#1A50A0] py-2 rounded-xl font-bold text-xs">
                {copiedDashId === n.id ? '✓ コピー済み' : '📋 スタッフURLをコピー'}
              </button>
            </div>

            {/* PIN更新 */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🔑 PINを変更</div>
              <div className="flex gap-2">
                <input value={pins[n.id] ?? ''} onChange={e => setPins({ ...pins, [n.id]: e.target.value.slice(0, 4) })} className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-2 text-sm outline-none" placeholder="新しい4桁PIN" type="number" />
                <button onClick={() => handleUpdatePin(n.id)} className="bg-[#EBF0FA] text-[#1A50A0] px-4 py-2 rounded-xl font-bold text-xs">
                  {savedPin === n.id ? '✓ 保存済み' : '更新'}
                </button>
              </div>
            </div>

            {/* グループ管理 */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">👥 グループ管理</div>
              <div className="space-y-2 mb-3">
                {(groups[n.id] ?? []).length === 0 ? (
                  <div className="text-xs text-[#7A8E80] bg-[#F4F7F5] rounded-xl px-3 py-2">グループはまだありません</div>
                ) : (
                  (groups[n.id] ?? []).map((g) => (
                    <div key={g.id} className="flex items-center justify-between bg-[#F4F7F5] rounded-xl px-3 py-2">
                      <span className="text-sm font-bold text-[#0E1A12]">{g.name}</span>
                      <button
                        onClick={() => handleDeleteGroup(g.id, n.id)}
                        className="text-xs text-[#B83030] bg-[#FCEAEA] px-2 py-1 rounded-lg font-bold"
                      >
                        削除
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={newGroupNames[n.id] ?? ''}
                  onChange={(e) => setNewGroupNames((prev) => ({ ...prev, [n.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddGroup(n.id) }}
                  className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-2 text-sm outline-none"
                  placeholder="例：ひまわり組"
                />
                <button
                  onClick={() => handleAddGroup(n.id)}
                  disabled={savingGroup === n.id || !(newGroupNames[n.id] ?? '').trim()}
                  className="bg-[#E6F4EC] text-[#1A6640] px-4 py-2 rounded-xl font-bold text-xs disabled:opacity-50"
                >
                  {savingGroup === n.id ? '...' : '追加'}
                </button>
              </div>
            </div>

            {/* 保護者向けPDF */}
            <div className="px-5 py-4 border-b border-[#E0EAE2]">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">🖨️ 保護者向け案内</div>
              <div className="text-xs text-[#7A8E80] mb-3">QRコード・園コード・登録方法をまとめた印刷用シート</div>
              <button
                onClick={() => window.open(`/admin/print/${n.id}`, '_blank')}
                className="w-full bg-[#F4F7F5] text-[#1A6640] py-2 rounded-xl font-bold text-xs border border-[#B2D8C0]"
              >
                📄 印刷用シートを開く
              </button>
            </div>

            {/* キー再発行 */}
            <div className="px-5 py-4">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">⚠️ NFCキー再発行（紛失時）</div>
              <div className="text-xs text-[#7A8E80] mb-3">再発行すると古いNFCタグは即座に無効になります</div>
              <button onClick={() => handleReissue(n.id)} className="w-full bg-[#FCEAEA] text-[#B83030] py-2 rounded-xl font-bold text-xs border border-[#E8AAAA]">
                {reissuedId === n.id ? '✓ 再発行しました' : '🔄 キーを再発行する'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
