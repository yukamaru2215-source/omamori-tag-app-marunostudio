'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Allergy, Condition, Medication, EmergencyContact, Doctor } from '@/lib/types'

type Group = { id: string; name: string }

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [savedTab, setSavedTab] = useState<string | null>(null)
  const [tab, setTab] = useState<'basic' | 'allergy' | 'condition' | 'medication' | 'contact' | 'doctor' | 'group'>('basic')
  const [form, setForm] = useState({
    display_name: '', full_name: '', kana: '', age: '',
    blood_type: '不明', has_epipen: false, epipen_location: '',
  })
  const [nurseryId, setNurseryId] = useState<string | null>(null)
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])

  // グループ
  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [savingGroups, setSavingGroups] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data } = await supabase
        .from('children')
        .select('*, allergies(*), conditions(*), medications(*), emergency_contacts(*), doctors(*)')
        .eq('id', id)
        .eq('parent_id', session.user.id)
        .single()
      if (!data) { router.push('/dashboard'); return }
      setForm({
        display_name: data.display_name ?? '',
        full_name: data.full_name ?? '',
        kana: data.kana ?? '',
        age: data.age ?? '',
        blood_type: data.blood_type ?? '不明',
        has_epipen: data.has_epipen ?? false,
        epipen_location: data.epipen_location ?? '',
      })
      setNurseryId(data.nursery_id ?? null)
      setAllergies(data.allergies ?? [])
      setConditions(data.conditions ?? [])
      setMedications(data.medications ?? [])
      setContacts(data.emergency_contacts ?? [])
      setDoctors(data.doctors ?? [])

      // グループ情報を読み込む
      if (data.nursery_id) {
        const [{ data: groupData }, { data: childGroupData }] = await Promise.all([
          supabase.from('groups').select('id, name').eq('nursery_id', data.nursery_id).order('name'),
          supabase.from('child_groups').select('group_id').eq('child_id', id),
        ])
        setAllGroups(groupData ?? [])
        setSelectedGroupIds((childGroupData ?? []).map((cg) => cg.group_id))
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleSave(tabName: string) {
    await supabase.from('children').update(form).eq('id', id)
    setSavedTab(tabName)
    setTimeout(() => setSavedTab(null), 2000)
  }

  async function handleDelete() {
    if (!confirm(`「${form.display_name}」の情報をすべて削除しますか？\nこの操作は取り消せません。`)) return
    const { error } = await supabase.from('children').delete().eq('id', id)
    if (error) { alert('削除に失敗しました'); return }
    router.push('/dashboard')
  }

  async function handleSaveGroups() {
    setSavingGroups(true)
    // 既存のグループ紐づけを全削除して再挿入
    await supabase.from('child_groups').delete().eq('child_id', id)
    if (selectedGroupIds.length > 0) {
      await supabase.from('child_groups').insert(
        selectedGroupIds.map((groupId) => ({ child_id: id, group_id: groupId }))
      )
    }
    setSavingGroups(false)
    setSavedTab('group')
    setTimeout(() => setSavedTab(null), 2000)
  }

  function toggleGroup(groupId: string) {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    )
  }

  async function addAllergy() {
    const { data } = await supabase.from('allergies').insert({ child_id: id, name: '', severity: '軽度', action: '' }).select().single()
    if (data) setAllergies([...allergies, data])
  }
  async function updateAllergy(aid: string, key: string, value: string) {
    setAllergies(allergies.map(a => a.id === aid ? { ...a, [key]: value } : a))
    await supabase.from('allergies').update({ [key]: value }).eq('id', aid)
  }
  async function deleteAllergy(aid: string) {
    setAllergies(allergies.filter(a => a.id !== aid))
    await supabase.from('allergies').delete().eq('id', aid)
  }

  async function addCondition() {
    const { data } = await supabase.from('conditions').insert({ child_id: id, name: '', note: '' }).select().single()
    if (data) setConditions([...conditions, data])
  }
  async function updateCondition(cid: string, key: string, value: string) {
    setConditions(conditions.map(c => c.id === cid ? { ...c, [key]: value } : c))
    await supabase.from('conditions').update({ [key]: value }).eq('id', cid)
  }
  async function deleteCondition(cid: string) {
    setConditions(conditions.filter(c => c.id !== cid))
    await supabase.from('conditions').delete().eq('id', cid)
  }

  async function addMedication() {
    const { data } = await supabase.from('medications').insert({ child_id: id, name: '', location: '', dosage: '' }).select().single()
    if (data) setMedications([...medications, data])
  }
  async function updateMedication(mid: string, key: string, value: string) {
    setMedications(medications.map(m => m.id === mid ? { ...m, [key]: value } : m))
    await supabase.from('medications').update({ [key]: value }).eq('id', mid)
  }
  async function deleteMedication(mid: string) {
    setMedications(medications.filter(m => m.id !== mid))
    await supabase.from('medications').delete().eq('id', mid)
  }

  async function addContact() {
    const { data } = await supabase.from('emergency_contacts').insert({ child_id: id, label: '', phone: '', relation: '' }).select().single()
    if (data) setContacts([...contacts, data])
  }
  async function updateContact(cid: string, key: string, value: string) {
    setContacts(contacts.map(c => c.id === cid ? { ...c, [key]: value } : c))
    await supabase.from('emergency_contacts').update({ [key]: value }).eq('id', cid)
  }
  async function deleteContact(cid: string) {
    setContacts(contacts.filter(c => c.id !== cid))
    await supabase.from('emergency_contacts').delete().eq('id', cid)
  }

  async function addDoctor() {
    const { data } = await supabase.from('doctors').insert({ child_id: id, name: '', phone: '', address: '', note: '' }).select().single()
    if (data) setDoctors([...doctors, data])
  }
  async function updateDoctor(did: string, key: string, value: string) {
    setDoctors(doctors.map(d => d.id === did ? { ...d, [key]: value } : d))
    await supabase.from('doctors').update({ [key]: value }).eq('id', did)
  }
  async function deleteDoctor(did: string) {
    setDoctors(doctors.filter(d => d.id !== did))
    await supabase.from('doctors').delete().eq('id', did)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  const TABS = [
    { id: 'basic', label: '基本' },
    ...(nurseryId ? [{ id: 'group', label: 'グループ' }] : []),
    { id: 'allergy', label: 'アレルギー' },
    { id: 'condition', label: '持病' },
    { id: 'medication', label: '持薬' },
    { id: 'contact', label: '連絡先' },
    { id: 'doctor', label: '医師' },
  ] as const

  const SaveBtn = ({ tabName }: { tabName: string }) => (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4F7F5] border-t border-[#E0EAE2]">
      <div className="max-w-md mx-auto">
        <button onClick={() => handleSave(tabName)} className={"w-full py-4 rounded-2xl font-black text-lg text-white " + (savedTab === tabName ? 'bg-[#238C56]' : 'bg-[#1A6640]')}>
          {savedTab === tabName ? '✓ 保存しました' : '変更を保存する'}
        </button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-32">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 py-4 mb-2">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">情報を編集</div>
        </div>

        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={"flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold " + (tab === t.id ? 'bg-[#1A6640] text-white' : 'bg-white text-[#7A8E80] border border-[#E0EAE2]')}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'basic' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">呼び名</label>
              <input value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">フルネーム</label>
              <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">よみがな</label>
              <input value={form.kana} onChange={e => setForm({ ...form, kana: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-black text-[#7A8E80] mb-1">年齢</label>
                <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-black text-[#7A8E80] mb-1">血液型</label>
                <select value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none bg-white">
                  {['A型', 'B型', 'O型', 'AB型', '不明'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-2">エピペン所持</label>
              <div className="flex gap-2">
                <button onClick={() => setForm({ ...form, has_epipen: true })} className={"flex-1 py-3 rounded-xl font-bold text-sm " + (form.has_epipen ? 'bg-[#FCEAEA] text-[#B83030] border-2 border-[#B83030]' : 'bg-[#F4F7F5] text-[#7A8E80] border border-[#E0EAE2]')}>💉 あり</button>
                <button onClick={() => setForm({ ...form, has_epipen: false })} className={"flex-1 py-3 rounded-xl font-bold text-sm " + (!form.has_epipen ? 'bg-[#E6F4EC] text-[#1A6640] border-2 border-[#1A6640]' : 'bg-[#F4F7F5] text-[#7A8E80] border border-[#E0EAE2]')}>なし</button>
              </div>
            </div>
            {form.has_epipen && (
              <div>
                <label className="block text-xs font-black text-[#7A8E80] mb-1">保管場所</label>
                <input value={form.epipen_location} onChange={e => setForm({ ...form, epipen_location: e.target.value })} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="例：バッグ内・赤いポーチ" />
              </div>
            )}
          </div>
        )}

        {tab === 'allergy' && (
          <div className="space-y-3">
            {allergies.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-between mb-3">
                  <select value={a.severity} onChange={e => updateAllergy(a.id, 'severity', e.target.value)} className="border border-[#E0EAE2] rounded-lg px-3 py-1 text-xs font-bold bg-white outline-none">
                    {['重篤', '中程度', '軽度'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteAllergy(a.id)} className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold">削除</button>
                </div>
                <input value={a.name} onChange={e => updateAllergy(a.id, 'name', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="アレルゲン名" />
                <input value={a.action} onChange={e => updateAllergy(a.id, 'action', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="対応方法" />
              </div>
            ))}
            <button onClick={addAllergy} className="w-full py-3 border-2 border-dashed border-[#C2D4C6] rounded-2xl text-sm text-[#7A8E80] font-bold">＋ アレルゲンを追加</button>
          </div>
        )}

        {tab === 'condition' && (
          <div className="space-y-3">
            {conditions.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-end mb-3">
                  <button onClick={() => deleteCondition(c.id)} className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold">削除</button>
                </div>
                <input value={c.name} onChange={e => updateCondition(c.id, 'name', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="持病・既往歴" />
                <input value={c.note} onChange={e => updateCondition(c.id, 'note', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="注意事項" />
              </div>
            ))}
            <button onClick={addCondition} className="w-full py-3 border-2 border-dashed border-[#C2D4C6] rounded-2xl text-sm text-[#7A8E80] font-bold">＋ 持病・既往歴を追加</button>
          </div>
        )}

        {tab === 'medication' && (
          <div className="space-y-3">
            {medications.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-end mb-3">
                  <button onClick={() => deleteMedication(m.id)} className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold">削除</button>
                </div>
                <input value={m.name} onChange={e => updateMedication(m.id, 'name', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="薬・器具名" />
                <input value={m.location} onChange={e => updateMedication(m.id, 'location', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="保管場所" />
                <input value={m.dosage} onChange={e => updateMedication(m.id, 'dosage', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="用法・用量" />
              </div>
            ))}
            <button onClick={addMedication} className="w-full py-3 border-2 border-dashed border-[#C2D4C6] rounded-2xl text-sm text-[#7A8E80] font-bold">＋ 持薬・器具を追加</button>
          </div>
        )}

        {tab === 'contact' && (
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-end mb-3">
                  <button onClick={() => deleteContact(c.id)} className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold">削除</button>
                </div>
                <input value={c.label} onChange={e => updateContact(c.id, 'label', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="名前・施設名" />
                <input value={c.relation} onChange={e => updateContact(c.id, 'relation', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="続柄（例：母）" />
                <input value={c.phone} onChange={e => updateContact(c.id, 'phone', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="電話番号" type="tel" />
              </div>
            ))}
            <button onClick={addContact} className="w-full py-3 border-2 border-dashed border-[#C2D4C6] rounded-2xl text-sm text-[#7A8E80] font-bold">＋ 緊急連絡先を追加</button>
          </div>
        )}

        {tab === 'doctor' && (
          <div className="space-y-3">
            {doctors.map(d => (
              <div key={d.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-end mb-3">
                  <button onClick={() => deleteDoctor(d.id)} className="text-xs text-[#B83030] bg-[#FCEAEA] px-3 py-1 rounded-lg font-bold">削除</button>
                </div>
                <input value={d.name} onChange={e => updateDoctor(d.id, 'name', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="病院名・医師名" />
                <input value={d.phone} onChange={e => updateDoctor(d.id, 'phone', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="電話番号" type="tel" />
                <input value={d.address} onChange={e => updateDoctor(d.id, 'address', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none mb-2" placeholder="住所" />
                <input value={d.note} onChange={e => updateDoctor(d.id, 'note', e.target.value)} className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" placeholder="備考（担当医名など）" />
              </div>
            ))}
            <button onClick={addDoctor} className="w-full py-3 border-2 border-dashed border-[#C2D4C6] rounded-2xl text-sm text-[#7A8E80] font-bold">＋ かかりつけ医を追加</button>
          </div>
        )}

        {/* グループタブ */}
        {tab === 'group' && (
          <div>
            <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
              <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">👥 所属グループ</div>
              {allGroups.length === 0 ? (
                <div className="text-sm text-[#7A8E80]">この園にはグループが設定されていません</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-[#7A8E80] mb-3">所属するグループを選択してください（複数可）</div>
                  {allGroups.map((g) => (
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
              )}
            </div>

            {/* グループ保存ボタン */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4F7F5] border-t border-[#E0EAE2]">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleSaveGroups}
                  disabled={savingGroups}
                  className={'w-full py-4 rounded-2xl font-black text-lg text-white ' + (savedTab === 'group' ? 'bg-[#238C56]' : 'bg-[#1A6640]') + ' disabled:opacity-50'}
                >
                  {savingGroups ? '保存中...' : savedTab === 'group' ? '✓ 保存しました' : 'グループを保存する'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {tab !== 'group' && <SaveBtn tabName={tab} />}

      {/* 削除ボタン（basicタブのみ表示） */}
      {tab === 'basic' && (
        <div className="max-w-md mx-auto px-4 pb-8 mt-2">
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-2xl font-bold text-sm text-[#B83030] bg-[#FCEAEA] border border-[#E8AAAA]"
          >
            🗑️ このお子様の情報を削除する
          </button>
        </div>
      )}
    </main>
  )
}
