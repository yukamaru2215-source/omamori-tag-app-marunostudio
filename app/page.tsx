'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#F4F7F5] pb-16">
      <div className="max-w-md mx-auto">
        {/* ヒーロー画像 */}
        <div className="relative w-full aspect-[1376/768]">
          <Image
            src="/omamoritag.jpg"
            alt="おまもりタグをかざすと、スマホにデジタルカルテが表示される様子"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="p-8 pt-6">
          {/* おまもりタグとは */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#0E1A12] mb-2">
              おまもりタグとは
            </h1>
            <p className="text-sm text-[#5A6E62] leading-relaxed">
              持病やアレルギーなどの情報を、NFCタグ・QRコードで安全に共有できるサービスです。
            </p>
          </div>

          {/* 3ステップ */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E0EAE2] shadow-sm flex items-center justify-center text-2xl">🏷️</div>
              <div className="text-xs font-bold text-[#5A6E62] text-center">タグに情報を登録</div>
            </div>
            <div className="text-[#B8D9C8] text-xl">→</div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E0EAE2] shadow-sm flex items-center justify-center text-2xl">📱</div>
              <div className="text-xs font-bold text-[#5A6E62] text-center">スマホをかざす</div>
            </div>
            <div className="text-[#B8D9C8] text-xl">→</div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E0EAE2] shadow-sm flex items-center justify-center text-2xl">📋</div>
              <div className="text-xs font-bold text-[#5A6E62] text-center">情報がすぐ見える</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg"
            >
              ご登録はこちら
            </Link>
            <Link
              href="/login"
              className="text-center py-2 text-sm font-bold text-[#7A8E80]"
            >
              すでに登録済みの方はログイン
            </Link>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            {loggedIn && (
              <Link
                href="/inbox"
                className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
              >
                📬 受信BOX
              </Link>
            )}
            <Link
              href="/guide"
              className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
            >
              📘 個人利用の方向け使い方ガイド
            </Link>
            <Link
              href="/faq"
              className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
            >
              ❓ よくある質問
            </Link>
            <Link
              href="/pricing"
              className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
            >
              💴 料金表
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
