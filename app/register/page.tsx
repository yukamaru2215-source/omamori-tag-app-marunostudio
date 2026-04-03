'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
            <label className="block text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-1">呼び名 *</label>
            <input value={form.display_name} onChange={e => setForm({...form, display_name: e.target.value})}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"