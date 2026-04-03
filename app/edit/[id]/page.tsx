'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'basic' | 'allergy' | 'condition'>('basic')
  const [form, setForm] = useState({
    display_name: '',
    full_name: '',
    kana: '',
    age: '',
    blood_type: '不明',
    has_epipen: false,
    epipen_location: '',
  })
  const [allergies, setAllergies] = useState<any[]>([])
  const [conditions, setConditions] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data } = await supabase
        .from('children')
        .select('*, allergies(*), conditions(*)')
        .eq('id', params.id)
        .eq('parent_id', session.user.id)
        .single()

      if (!data) { router.push('/dashboard'); return }

      setForm({
        display_name: data.display_name,
        full_name: data.full_name ?? '',
        kana: data.kana ?? '',
        age: data.age,
        blood_type: data.blood_type ?? '不明',
        has_epipen: data.has_epipen,
        epipen_location: data.epipen_location ?? '',
      })
      setAllergies(data.allergies ?? [])
      setConditions(data.conditions ?? [])
      setLoading(false)
    }
    load()
  }, [params.id, router])

  async function handleSave() {
    setSaving(true)
    await supabase.from('children').update(form).eq('id', params.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  async function addAllergy() {
    const { data } = await supabase.from('allergies').insert({
      child_id: params.id, name: '', severity: '軽度', action: ''
    }).select().single()
    if (data) setAllergies([...allergies, data])
  }

  async function updateAllergy(id: string, key: string, value: string) {
    setAllergies(allergies.map(a => a.id === id ? { ...a, [key]: value } : a))
    await supabase.from('allergies').update({ [key]: value }).eq('id', id)
  }

  async function deleteAllergy(id: string) {
    setAllergies(allergies.filter(a => a.id !== id))
    await supabase.from('allergies').delete().eq('id', id)
  }

  async function addCondition() {
    const { data } = await supabase.from('conditions').insert({
      child_id: params.id, name: '', note: ''
    }).select().single()
    if (data) setConditions([...conditions, data])
  }

  async function updateCondition(id: string, key: string, value: string) {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: value } : c))
    await supabase.from('conditions').update({ [key]: value }).eq('id', id)
  }

  async function deleteCondition(id: string) {
    setConditions(conditions.filter(c => c.id !== id))
    await supabase.from('conditions').delete().eq('id', id)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-32">
      <div className="max-w-md mx-auto p-4">

        <div className="flex items-center gap-3 py-4 mb-2">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">情報を編集</div>
        </div>

        <div className="flex gap-2 mb-4">
          {([['basic','基本情報'],['allergy','アレルギー'],['condition','持病']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold ${tab === id ? 'bg-[#1A6640] text-white' : 'bg-white text-[#7A8E80] border border-[#E0EAE2]'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'basic' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">呼び名</label>
              <input value={form.display_name} onChange={e => setForm({...form, display_name: e.target.value})}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">フルネーム</label>
              <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">よみがな</label>
              <input value={form.kana} onChange={e => setForm({...form, kana: e.target.value})}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">年齢</label>
                <input value={form.age} onChange={e => setForm({...form, age: e.target.value})}
                  className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">血液型</label>
                <select value={form.blood_type} onChange={e => setForm({...form, blood_type: e.target.value})}
                  className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none bg-white">
                  {['A型','B型','O型','AB型','不明'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">エピペン所持</label>
              <div className="flex gap-2">
                <button onClick={() => setForm({...form, has_epipen: true})}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm ${form.has_epipen ? 'bg-[#FCEAEA] text-[#B83030] border-2 border-[#B83030]' : 'bg-[#F4F7F5] text-[#7A8E80] border border-[#E0EAE2]'}`}>
                  💉 あり
                </button>
                <button onClick={() => setForm({...form, has_epipen: false})}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm ${!form.has_epipen ? 'bg-[#E6F4EC] text-[#1A6640] border-2 border-[#1A6640]' : 'bg-[#F4F7F5] text-[#7A8E80] border border-[#E0EAE2]'}`}>
                  なし
                </button>
              </div>
            </div>
            {form.has_epipen && (
              <div>
                <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">保管場所</label>
                <input value={form.epipen_location} onChange={e => setForm({...form, epipen_location: e.target.value})}
                  className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
                  placeholder="例：バッグ内・赤いポーチ" />
              </div>
            )}
          </div>
        )}

        {tab === 'allergy' && (
          <div className="space-y-3">
            {allergies.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm">
                <div className="flex justify-between mb-3">
                  <select value={a.severity} onChange={e => updateAllergy(a.id, 'severity', e.target.value)}
                    className="border border-[#E0EAE2] rounded-lg