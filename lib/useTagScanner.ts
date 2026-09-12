'use client'

import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

// Web NFC API（Android Chromeのみ対応）。標準のTypeScript libに型が無いため最小限だけ宣言する。
type NDEFReadingEvent = { message: { records: { recordType: string; data: DataView }[] } }
interface NDEFReaderLike {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>
  onreading: ((event: NDEFReadingEvent) => void) | null
  onreadingerror: ((event: Event) => void) | null
}
declare global {
  interface Window {
    NDEFReader?: new () => NDEFReaderLike
  }
}

export type ScanMode = 'idle' | 'nfc' | 'qr'

// 「かざす/読み取る」で得た文字列から、おまもりタグのURL（/tag/[id]）のIDだけを取り出す
export function extractTagId(text: string): string | null {
  try {
    const url = new URL(text)
    const match = url.pathname.match(/^\/tag\/([a-zA-Z0-9]+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

// NFCタッチ／QRカメラ読み取りで、おまもりタグのIDを取得する共通フック
export function useTagScanner(onScanned: (tagId: string) => void) {
  const [mode, setMode] = useState<ScanMode>('idle')
  const [nfcSupported, setNfcSupported] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const nfcAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setNfcSupported(typeof window.NDEFReader !== 'undefined')
  }, [])

  function handleScannedText(text: string) {
    const tagId = extractTagId(text)
    if (!tagId) {
      alert('おまもりタグのURLではないようです。もう一度お試しください。')
      return
    }
    onScanned(tagId)
  }

  function stop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    nfcAbortRef.current?.abort()
    nfcAbortRef.current = null
    setMode('idle')
  }

  async function startNfc() {
    if (!window.NDEFReader) return
    setMode('nfc')
    try {
      const controller = new AbortController()
      nfcAbortRef.current = controller
      const ndef = new window.NDEFReader()
      await ndef.scan({ signal: controller.signal })
      ndef.onreading = (event) => {
        for (const record of event.message.records) {
          if (record.recordType === 'url') {
            const text = new TextDecoder().decode(record.data)
            stop()
            handleScannedText(text)
            return
          }
        }
      }
      ndef.onreadingerror = () => {
        alert('タグの読み取りに失敗しました。もう一度お試しください。')
      }
    } catch {
      alert('NFCの読み取りを開始できませんでした。端末のNFC設定がオンになっているか確認してください。')
      setMode('idle')
    }
  }

  function tickQr() {
    const video = videoRef.current
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tickQr)
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) { rafRef.current = requestAnimationFrame(tickQr); return }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code) {
      stop()
      handleScannedText(code.data)
    } else {
      rafRef.current = requestAnimationFrame(tickQr)
    }
  }

  async function startQr() {
    setMode('qr')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      tickQr()
    } catch {
      alert('カメラを起動できませんでした。カメラへのアクセスを許可してください。')
      setMode('idle')
    }
  }

  useEffect(() => {
    return () => { stop() }
  }, [])

  return { mode, nfcSupported, videoRef, startNfc, startQr, stop }
}
