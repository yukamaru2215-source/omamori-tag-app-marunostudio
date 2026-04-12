'use client'

import { useEffect, useState } from 'react'

type Props = { parentId: string }

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output
}

type Status = 'loading' | 'unsupported' | 'ios_browser' | 'denied' | 'subscribed' | 'unsubscribed'

export default function PushManager({ parentId }: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    // プッシュ通知非対応
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      // iOSのSafariブラウザ（ホーム画面未追加）か確認
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      if (isIOS && !isStandalone) {
        setStatus('ios_browser')
      } else {
        setStatus('unsupported')
      }
      return
    }

    // 通知拒否済み
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }

    // 既存の購読を確認
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => {
        setStatus(sub ? 'subscribed' : 'unsubscribed')
      })
    )
  }, [])

  async function subscribe() {
    setWorking(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })

      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: parentId, subscription: sub.toJSON() }),
      })

      setStatus('subscribed')
    } catch (err) {
      console.error('subscribe error:', err)
      if (Notification.permission === 'denied') setStatus('denied')
    } finally {
      setWorking(false)
    }
  }

  async function unsubscribe() {
    setWorking(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        await fetch('/api/push-unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parent_id: parentId, endpoint: sub.endpoint }),
        })
      }
      setStatus('unsubscribed')
    } catch (err) {
      console.error('unsubscribe error:', err)
    } finally {
      setWorking(false)
    }
  }

  if (status === 'loading') return null

  if (status === 'ios_browser') {
    return (
      <div className="bg-[#E6F4EC] border border-[#B2D8C0] rounded-2xl p-4 mb-4">
        <div className="font-bold text-[#1A6640] text-sm mb-1">📲 通知を受け取るには</div>
        <div className="text-xs text-[#4A6E55] leading-relaxed">
          このページをホーム画面に追加すると、連絡が届いたときにプッシュ通知を受け取れます。<br />
          Safari の共有ボタン（<span className="font-bold">⎋</span>）→「ホーム画面に追加」
        </div>
      </div>
    )
  }

  if (status === 'unsupported') return null

  if (status === 'denied') {
    return (
      <div className="bg-[#FFF8E6] border border-[#F0D080] rounded-2xl p-4 mb-4">
        <div className="font-bold text-[#8B6914] text-sm mb-1">🔕 通知がブロックされています</div>
        <div className="text-xs text-[#8B6914]">
          端末の設定からこのサイトの通知を許可してください。
        </div>
      </div>
    )
  }

  if (status === 'subscribed') {
    return (
      <div className="flex items-center justify-between bg-[#E6F4EC] border border-[#B2D8C0] rounded-2xl px-4 py-3 mb-4">
        <div>
          <div className="font-bold text-[#1A6640] text-sm">🔔 プッシュ通知 ON</div>
          <div className="text-xs text-[#4A6E55]">連絡が届くと通知されます</div>
        </div>
        <button
          onClick={unsubscribe}
          disabled={working}
          className="text-xs text-[#7A8E80] border border-[#E0EAE2] bg-white px-3 py-1.5 rounded-xl disabled:opacity-50"
        >
          {working ? '...' : '解除'}
        </button>
      </div>
    )
  }

  // unsubscribed
  return (
    <button
      onClick={subscribe}
      disabled={working}
      className="w-full flex items-center justify-center gap-2 bg-white border border-[#B2D8C0] text-[#1A6640] font-bold text-sm py-3 rounded-2xl mb-4 disabled:opacity-50"
    >
      {working ? '設定中...' : '🔔 プッシュ通知を受け取る'}
    </button>
  )
}
