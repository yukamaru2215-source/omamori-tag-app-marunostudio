'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [nurseryCode, setNurseryCode] = useState('')
  const [nurseryName, setNurseryName] = useState('')
  const [nurseryId, setNurseryId] = useState('')
  const [nurseryError, setNurseryError] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [age, setAge] = useState('')

  async function checkNurseryCode() {
    if (!nurseryCode) return
    const { data, error } = await supabase
      .from('nurseries')
      .select('id, name, staff_auth_key')
      .eq('staff_auth_key', nurseryCode)
      .single()
    if (error || !data) {
      setNurseryError('園コードが見つかりません')
      setNurseryName('')
      setNurseryId('')
    } else {
      setNurseryError('')
      setNurseryName(data.name)
      setNurseryId(data.id)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { error } = await supabase.from('children').insert({
      display_name: displayName,
      age: age,
      parent_id: session.user.id,
      nursery_id: nurseryId || null,
      has_epipen: false,
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

        {/* 園コード */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm">
          <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
            🏫 保育園・幼稚園との紐づけ（任意）
          </div>
          <div className="text-sm text-[#7A8E80] mb-3">
            園から配布された園コードを入力してください。保育士が詳細情報を確認できるようになります。
          </div>
          <div className="flex gap-2">
            <input
              value={nurseryCode}
              onChange={e => setNurseryCode(e.target.value)}
              className="flex-1 border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="園コードを入力"
            />
            <button onClick={checkNurseryCode} className="bg-[#1A6640] text-white px-4 py-3 rounded-xl font-bold text-sm">
              確認
            </button>
          </div>
          {nurseryError && (
            <div className="text-xs text-[#B83030] mt-2">{nurseryError}</div>
          )}
          {nurseryName && (
            <div className="mt-3 bg-[#E6F4EC] rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <div>
                <div className="font-bold text-[#1A6640] text-sm">{nurseryName}</div>
                <div className="text-xs text-[#7A8E80]">園コードが確認できました</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4F7F5] border-t border-[#E0EAE2]">
        <div className="max-w-md mx-auto">
          <button onClick={handleSubmit} disabled={loading || !displayName || !age}
            className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50">
            {loading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </main>
  )
}