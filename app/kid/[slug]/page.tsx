'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ChildFull } from '@/lib/types'

export default function KidPage({ params }: { params: { slug: string } }) {
  const [child, setChild] = useState<ChildFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifyState, setNotifyState] = useState<'idle' | 'confirm' | 'sending' | 'done' | 'cooldown'>('idle')

  useEffect(() => {
  async function fetchChild() {
    const { data, error } = await supabase
      .from('children')
      .select(`*, allergies(*), conditions(*), medications(*), emergency_contacts(*), doctors(*)`)
      .eq('slug', params.slug)
      .single()
    console.log('data:', data)
    console.log('error:', error)
    if (!error && data) setChild(data)
    setLoading(false)
  }
  fetchChild()
}, [params.slug])
  }, [params.slug])

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

    await supabase.from('notification_logs').insert({
      child_id: child.id, lat, lng
    })

    setNotifyState('done')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  if (!child) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">園児情報が見つかりません</div>
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
        {/* プロフィール */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0EAE2] mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F4EC] flex items-center justify-center text-3xl">👧</div>
          <div>
            <div className="text-2xl font-black text-[#0E1A12]">{child.display_name}</div>
            <div className="text-xs text-[#7A8E80] mt-1">{child.kana}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-[#E6F4EC] text-[#1A6640] px-2 py-1 rounded-full font-bold">{child.age}</span>
              {child.blood_type && (
                <span className="text-xs bg-[#EBF0FA] text-[#1A50A0] px-2 py-1 rounded-full font-bold">血液型 {child.blood_type}</span>
              )}
              {child.has_epipen && (
                <span className="text-xs bg-[#FCEAEA] text-[#B83030] px-2 py-1 rounded-full font-bold">💉 エピペン所持</span>
              )}
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-[#0E1A12]">{a.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    a.severity === '重篤' ? 'bg-[#FCEAEA] text-[#B83030]' :
                    a.severity === '中程度' ? 'bg-[#FDF5E4] text-[#926010]' :
                    'bg-[#E6F4EC] text-[#1A6640]'
                  }`}>{a.severity}</span>
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
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0EAE2] mb-6 overflow-hidden">
          <div className="px-4 py-3 bg-[#FCEAEA] border-b border-[#E8AAAA]">
            <span className="text-xs font-black text-[#B83030] uppercase tracking-widest">💉 エピペン</span>
          </div>
          <div className="p-4">
            <span className={`font-bold px-4 py-2 rounded-xl ${child.has_epipen ? 'bg-[#FCEAEA] text-[#B83030]' : 'bg-[#F2F4F2] text-[#7A8E80]'}`}>
              {child.has_epipen ? '✓ 所持あり' : '所持なし'}
            </span>
          </div>
        </div>

        {/* 緊急通知 */}
        <div className={`rounded-2xl p-5 border ${notifyState === 'done' ? 'bg-[#E6F4EC] border-[#C2D4C6]' : 'bg-[#FCEAEA] border-[#E8AAAA]'}`}>
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
              <button
                onClick={() => setNotifyState('confirm')}
                disabled={notifyState === 'sending'}
                className="w-full bg-[#B83030] text-white py-4 rounded-xl font-black text-lg"
              >
                🚨 緊急通知を保護者に送る
              </button>
              <div className="text-xs text-[#7A8E80] mt-2">電話番号など個人情報は表示されません</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
