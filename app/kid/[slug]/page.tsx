'use client'

import { use, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ChildFull } from '@/lib/types'

export default function KidPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [child, setChild] = useState<ChildFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifyState, setNotifyState] = useState<'idle' | 'confirm' | 'sending' | 'done'>('idle')
  const [staffAuthed, setStaffAuthed] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinLoading, setPinLoading] = useState(false)
  const [pinShake, setPinShake] = useState(false)

  // 保育士セッション確認（このslug限定）
  useEffect(() => {
    sessionStorage.setItem('staff_redirect', `/kid/${slug}`)
    
    const raw = sessionStorage.getItem('staff_token')
    if (raw) {
      try {
        const { expiresAt, lockedSlug } = JSON.parse(raw)
        if (new Date(expiresAt) > new Date()) {
          // lockedSlugがnull（全体認証）またはこのslugと一致する場合のみ有効
          if (!lockedSlug || lockedSlug === slug) {
            setStaffAuthed(true)
          }
        } else {
          sessionStorage.removeItem('staff_token')
        }
      } catch {}
    }
  }, [slug])

  // 30分無操作で自動ログアウト
  useEffect(() => {
    let timer: NodeJS.Timeout
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        sessionStorage.removeItem('staff_token')
        setStaffAuthed(false)
      }, 30 * 60 * 1000)
    }
    window.addEventListener('touchstart', reset)
    window.addEventListener('mousemove', reset)
    reset()
    return () => {
      clearTimeout(timer)
      window.removeEventListener('touchstart', reset)
      window.removeEventListener('mousemove', reset)
    }
  }, [])

  useEffect(() => {
    async function fetchChild() {
      const { data, error } = await supabase
        .from('children')
        .select('*, allergies(*), conditions(*), medications(*), emergency_contacts(*), doctors(*)')
        .eq('slug', slug)
        .single()
      if (!error && data) setChild(data)
      setLoading(false)
    }
    fetchChild()
  }, [slug])

  async function sendNotify() {
    if (!child) return
    setNotifyState('sending')
    let lat = null, lng = null
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
      )
      lat = pos.coords.latitude
      lng = pos.coords.longitude
    } catch {}

    const res = await fetch('/api/send-emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId: child.id, lat, lng }),
    })

    if (res.status === 429) {
      alert('通知は1分に1回のみ送信できます')
      setNotifyState('idle')
      return
    }
    setNotifyState('done')
  }

  // PIN入力でアンロック
  function handlePinDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setPinError('')
    if (next.length === 4) setTimeout(() => verifyPin(next), 200)
  }

  async function verifyPin(pinValue: string) {
    if (!child?.nursery_id) {
      setPinError('この子どもは園に紐づいていません')
      return
    }
    setPinLoading(true)

    const { data, error } = await supabase.rpc('verify_staff_pin_only', {
      p_nursery_id: child.nursery_id,
      p_pin: pinValue,
    })

    setPinLoading(false)

    if (error || !data || data.length === 0) {
      setPinError('PINが正しくありません')
      setPinShake(true)
      setTimeout(() => { setPinShake(false); setPin('') }, 600)
      return
    }

    // このslug限定のセッションを保存
    sessionStorage.setItem('staff_token', JSON.stringify({
      token: data[0].session_token,
      expiresAt: data[0].expires_at,
      nurseryId: child.nursery_id,
      lockedSlug: slug,
    }))

    setStaffAuthed(true)
    setShowPinModal(false)
    setPin('')
  }

  function handleStaffLogout() {
    sessionStorage.removeItem('staff_token')
    setStaffAuthed(false)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (!child) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">情報が見つかりません</div>
    </main>
  )

  const hasSevere = child.allergies?.some(a => a.severity === '重篤')

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      {hasSevere && (
        <div className="bg-[#B83030] text-white text-center py-3 text-sm font-bold">
          ⚠️ 重篤なアレルギーがあります
        </div>
      )}

      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center gap-3 py-4 mb-2">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-[#E0EAE2] bg-white flex items-center justify-center text-[#7A8E80]">←</button>
          <div className="font-black text-xl text-[#0E1A12] flex-1">{child.display_name} の医療情報</div>
          {staffAuthed && (
            <button onClick={handleStaffLogout} className="text-xs bg-[#E6F4EC] text-[#1A6640] px-3 py-1 rounded-full font-bold border border-[#B8D9C8]">
              👩‍🏫 認証済 ✕
            </button>
          )}
        </div>

        {/* プロフィール */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0EAE2] mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F4EC] flex items-center justify-center text-3xl flex-shrink-0">👧</div>
          <div>
            <div className="text-2xl font-black text-[#0E1A12]">{child.display_name}</div>
            <div className="text-xs text-[#7A8E80] mt-1">{child.kana}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-[#E6F4EC] text-[#1A6640] px-2 py-1 rounded-full font-bold">{child.age}</span>
              {child.blood_type && <span className="text-xs bg-[#EBF0FA] text-[#1A50A0] px-2 py-1 rounded-full font-bold">血液型 {child.blood_type}</span>}
              {child.has_epipen && <span className="text-xs bg-[#FCEAEA] text-[#B83030] px-2 py-1 rounded-full font-bold">💉 エピペン所持</span>}
            </div>
          </div>
        </div>

        {/* アレルギー */}
        {child.allergies && child.allergies.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
            <div className="px-4 py-3 bg-[#FCEAEA] border-b border-[#E8AAAA]">
              <span className="text-xs font-black text-[#B83030] uppercase tracking-widest">⚠️ アレルギー情報</span>
            </div>
            {child.allergies.map((a, i) => (
              <div key={a.id} className={`p-4 ${i < child.allergies.length - 1 ? 'border-b border-[#E0EAE2]' : ''}`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-black text-[#0E1A12]">{a.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.severity === '重篤' ? 'bg-[#FCEAEA] text-[#B83030]' : a.severity === '中程度' ? 'bg-[#FDF5E4] text-[#926010]' : 'bg-[#E6F4EC] text-[#1A6640]'}`}>{a.severity}</span>
                </div>
                <div className="text-sm text-[#5A6E62]">{a.action}</div>
              </div>
            ))}
          </div>
        )}

        {/* 持病 */}
        {child.conditions && child.conditions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
            <div className="px-4 py-3 bg-[#EBF0FA] border-b border-[#A0BCE8]">
              <span className="text-xs font-black text-[#1A50A0] uppercase tracking-widest">🫀 持病・既往歴</span>
            </div>
            {child.conditions.map((c, i) => (
              <div key={c.id} className={`p-4 ${i < child.conditions.length - 1 ? 'border-b border-[#E0EAE2]' : ''}`}>
                <div className="font-bold text-[#0E1A12] mb-1">{c.name}</div>
                <div className="text-sm text-[#7A8E80]">{c.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* エピペン */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-[#FCEAEA] border-b border-[#E8AAAA]">
            <span className="text-xs font-black text-[#B83030] uppercase tracking-widest">💉 エピペン</span>
          </div>
          <div className="p-4 flex items-center gap-3 flex-wrap">
            <span className={`font-bold px-4 py-2 rounded-xl ${child.has_epipen ? 'bg-[#FCEAEA] text-[#B83030]' : 'bg-[#F2F4F2] text-[#7A8E80]'}`}>
              {child.has_epipen ? '✓ 所持あり' : '所持なし'}
            </span>
            {staffAuthed && child.has_epipen && child.epipen_location && (
              <span className="text-sm text-[#7A8E80]">📍 {child.epipen_location}</span>
            )}
          </div>
        </div>

        {/* 保育士認証済みの詳細情報 */}
        {staffAuthed && (
          <>
            {child.medications && child.medications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
                <div className="px-4 py-3 bg-[#FDF5E4] border-b border-[#E8C880]">
                  <span className="text-xs font-black text-[#926010] uppercase tracking-widest">💊 持薬・医療器具</span>
                </div>
                {child.medications.map((m, i) => (
                  <div key={m.id} className={`p-4 ${i < child.medications.length - 1 ? 'border-b border-[#E0EAE2]' : ''}`}>
                    <div className="font-bold text-[#0E1A12] mb-1">{m.name}</div>
                    <div className="text-sm text-[#7A8E80]">📍 {m.location}</div>
                    <div className="text-sm text-[#7A8E80]">{m.dosage}</div>
                  </div>
                ))}
              </div>
            )}

            {child.emergency_contacts && child.emergency_contacts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
                <div className="px-4 py-3 bg-[#E6F4EC] border-b border-[#B8D9C8]">
                  <span className="text-xs font-black text-[#1A6640] uppercase tracking-widest">📞 緊急連絡先</span>
                </div>
                {child.emergency_contacts.map((c, i) => (
                  <div key={c.id} className={`p-4 ${i < child.emergency_contacts.length - 1 ? 'border-b border-[#E0EAE2]' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-bold text-[#0E1A12]">{c.label}</div>
                        <div className="text-xs text-[#7A8E80]">{c.relation}</div>
                      </div>
                      <a href={`tel:${c.phone.replace(/-/g, '')}`} className="bg-[#E6F4EC] text-[#1A6640] px-4 py-2 rounded-xl font-bold text-sm">
                        📞 {c.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {child.doctors && child.doctors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-4 overflow-hidden">
                <div className="px-4 py-3 bg-[#EBF0FA] border-b border-[#A0BCE8]">
                  <span className="text-xs font-black text-[#1A50A0] uppercase tracking-widest">🏥 かかりつけ医</span>
                </div>
                {child.doctors.map((d, i) => (
                  <div key={d.id} className={`p-4 ${i < child.doctors.length - 1 ? 'border-b border-[#E0EAE2]' : ''}`}>
                    <div className="font-bold text-[#0E1A12] mb-1">{d.name}</div>
                    <div className="text-sm text-[#7A8E80]">{d.address}</div>
                    <div className="text-sm text-[#7A8E80]">{d.note}</div>
                    {d.phone && (
                      <a href={`tel:${d.phone.replace(/-/g, '')}`} className="inline-block mt-2 bg-[#EBF0FA] text-[#1A50A0] px-4 py-2 rounded-xl font-bold text-sm">
                        📞 {d.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 保育士認証ボタン（未認証の場合） */}
{!staffAuthed && child.nursery_id && (
  <div className="bg-white rounded-2xl p-5 border border-[#E0EAE2] shadow-sm mb-4">
    <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-2">👩‍🏫 保育士の方へ</div>
    <div className="text-sm text-[#7A8E80] mb-4 leading-relaxed">
      緊急連絡先・持薬などの詳細情報を確認するには、保育士用NFCタグが必要です。
    </div>
    <div
      className="bg-[#E6F4EC] rounded-xl p-4 text-center border border-[#B8D9C8] cursor-pointer"
      onClick={() => {
        sessionStorage.setItem('staff_redirect', `/kid/${slug}`)
      }}
    >
      <div className="text-2xl mb-2">🏷️</div>
      <div className="font-bold text-[#1A6640] text-sm">保育士用NFCタグをスマホにかざしてください</div>
      <div className="text-xs text-[#7A8E80] mt-1">かざす前にここをタップしてください</div>
    </div>
  </div>
)}
  

        {/* 緊急通知 */}
        <div className={`rounded-2xl p-5 border mb-4 ${notifyState === 'done' ? 'bg-[#E6F4EC] border-[#C2D4C6]' : 'bg-[#FCEAEA] border-[#E8AAAA]'}`}>
          {notifyState === 'done' ? (
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="font-black text-[#1A6640]">保護者へ通知しました</div>
              <div className="text-sm text-[#7A8E80] mt-1">まもなく連絡が来ます</div>
            </div>
          ) : notifyState === 'confirm' ? (
            <div className="text-center">
              <div className="text-sm font-bold text-[#B83030] mb-4">本当に緊急通知を送りますか？</div>
              <div className="flex gap-3">
                <button onClick={sendNotify} className="flex-1 bg-[#B83030] text-white py-3 rounded-xl font-bold">送信する</button>
                <button onClick={() => setNotifyState('idle')} className="flex-1 bg-white text-[#7A8E80] py-3 rounded-xl font-bold border border-[#E0EAE2]">キャンセル</button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm font-bold text-[#B83030] mb-3">この子が危険な状況ですか？</div>
              <button onClick={() => setNotifyState('confirm')} disabled={notifyState === 'sending'} className="w-full bg-[#B83030] text-white py-4 rounded-xl font-black text-lg">
                🚨 緊急通知を保護者に送る
              </button>
              <div className="text-xs text-[#7A8E80] mt-2">電話番号など個人情報は表示されません</div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center text-xs text-[#7A8E80] space-x-4 py-4">
          <Link href="/terms" className="underline">利用規約</Link>
          <Link href="/privacy" className="underline">プライバシーポリシー</Link>
        </div>
      </div>

      {/* PIN入力モーダル */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">👩‍🏫</div>
              <div className="font-black text-xl text-[#0E1A12] mb-1">保育士認証</div>
              <div className="text-sm text-[#7A8E80]">4桁のPINを入力してください</div>
            </div>

            <div className={`flex justify-center gap-4 mb-4 ${pinShake ? 'animate-bounce' : ''}`}>
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all ${i < pin.length ? 'bg-[#1A6640] border-[#1A6640]' : 'bg-white border-[#E0EAE2]'}`} />
              ))}
            </div>

            {pinError && (
              <div className="bg-[#FCEAEA] text-[#B83030] text-sm font-bold text-center py-2 rounded-xl mb-4">
                {pinError}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-4">
              {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
                <button key={i}
                  onClick={() => d === '⌫' ? setPin(p => p.slice(0,-1)) : d !== '' ? handlePinDigit(String(d)) : null}
                  disabled={pinLoading}
                  className={`h-14 rounded-2xl font-bold text-xl ${d === '' ? 'invisible' : 'bg-[#F4F7F5] border border-[#E0EAE2] text-[#0E1A12] active:bg-[#E6F4EC] active:scale-95 transition-all'}`}>
                  {d}
                </button>
              ))}
            </div>

            {pinLoading && <div className="text-center text-sm text-[#7A8E80] mb-3">認証中...</div>}

            <button onClick={() => { setShowPinModal(false); setPin(''); setPinError('') }} className="w-full text-center text-sm text-[#7A8E80] py-2">
              キャンセル
            </button>
          </div>
        </div>
      )}
    </main>
  )
}