'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    display_name: '',
    full_name: '',
    kana: '',
    age: '',
    blood_type: '不明',
    has_epipen: false,
    epipen_location: '',
  })

  async function handleSubmit() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const { error } = await supabase.from('children').insert({
      ...form,
      parent_id: session.user.id,
      nursery_id: null,
    })

    if (!error) router.push('/dashboard')
    else { alert('エラーが発生しました'); setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-32">
      <div className="max-w-md mx-auto p-4">

        <div className="flex items-center gap-3 py-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12]">お子様を登録</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm space-y-4">

          <div>
            <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">呼び名（ニックネーム）*</label>
            <input value={form.display_name} onChange={e => setForm({...form, display_name: e.target.value})}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：ゆき" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">フルネーム</label>
            <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：山田 ゆき" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">よみがな</label>
            <input value={form.kana} onChange={e => setForm({...form, kana: e.target.value})}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="例：やまだ ゆき" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">年齢 *</label>
              <input value={form.age} onChange={e => setForm({...form, age: e.target.value})}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
                placeholder="例：5歳" />
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
      </div>

      {/* 保存ボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4F7F5] border-t border-[#E0EAE2]">
        <div className="max-w-md mx-auto">
          <button onClick={handleSubmit} disabled={loading || !form.display_name || !form.age}
            className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50">
            {loading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </main>
  )
}