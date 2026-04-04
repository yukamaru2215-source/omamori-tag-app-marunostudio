'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

function StaffAuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nurseryId = searchParams.get('nursery')
  const authKey = searchParams.get('key')

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [shake, setShake] = useState(false)

  function handleDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError('')
    if (next.length === 4) {
      setTimeout(() => verify(next), 200)
    }
  }

  function handleDelete() {
    setPin(p => p.slice(0, -1))
  }

  async function verify(pinValue: string) {
    if (!nurseryId || !authKey) {
      setError('無効なURLです')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.rpc('verify_staff_auth', {
      p_nursery_id: nurseryId,
      p_auth_key: authKey,
      p_pin: pinValue,
    })
    setLoading(false)

    if (error || !data || data.length === 0) {
      setError('PINが正しくありません')
      setShake(true)
      setTimeout(() => { setShake(false); setPin('') }, 600)
      return
    }

    sessionStorage.setItem('staff_token', JSON.stringify({
      token: data[0].session_token,
      expiresAt: data[0].expires_at,
      nurseryId,
    }))
    setAuthed(true)
  }

  if (!nurseryId || !authKey) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-4xl mb-4">❌</div>
        <div className="font-black text-[#0E1A12] mb-2">無効なURLです</div>
        <div className="text-sm text-[#7A8E80]">正しい保育士用NFCタグを使用してください</div>
      </div>
    </main>
  )

  if (authed) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <div className="font-black text-xl text-[#1A6640] mb-2">認証成功</div>
        <div className="text-sm text-[#7A8E80] mb-6">保育士として認証されました</div>
        <button onClick={() => router.push('/dashboard')} className="bg-[#1A6640] text-white px-8 py-3 rounded-xl font-bold">
          ダッシュボードへ
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👩‍🏫</div>
          <div className="font-black text-2xl text-[#0E1A12] mb-2">保育士認証</div>
          <div className="text-sm text-[#7A8E80]">4桁のPINコードを入力してください</div>
        </div>

        {/* PIN表示 */}
        <div className={`flex justify-center gap-4 mb-8 ${shake ? 'animate-bounce' : ''}`}>
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 ${i < pin.length ? 'bg-[#1A6640] border-[#1A6640]' : 'bg-white border-[#E0EAE2]'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-[#FCEAEA] text-[#B83030] text-sm font-bold text-center py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* テンキー */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
            <button key={i}
              onClick={() => d === '⌫' ? handleDelete() : d !== '' ? handleDigit(String(d)) : null}
              disabled={loading}
              className={`h-16 rounded-2xl font-bold text-xl ${d === '' ? 'invisible' : 'bg-white border border-[#E0EAE2] text-[#0E1A12] shadow-sm active:bg-[#F4F7F5]'} disabled:opacity-50`}>
              {d}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center mt-6 text-sm text-[#7A8E80]">認証中...</div>
        )}
      </div>
    </main>
  )
}

export default function StaffAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center"><div className="text-[#7A8E80]">読み込み中...</div></div>}>
      <StaffAuthContent />
    </Suspense>
  )
}