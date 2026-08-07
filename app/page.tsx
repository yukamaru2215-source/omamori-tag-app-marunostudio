'use client'

import { useEffect, useState } from 'react'
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
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏷️</div>
          <h1 className="text-3xl font-black text-[#1A6640] mb-2">
            おまもりタグアプリ
          </h1>
          <p className="text-sm text-[#7A8E80]">
            園児の健康情報をNFCタグで安全に管理
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            👨‍👩‍👧 保護者ログイン
          </Link>
          {loggedIn && (
            <Link
              href="/inbox"
              className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
            >
              📬 受信BOX
            </Link>
          )}
          <Link
            href="/faq"
            className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
          >
            ❓ よくある質問・使い方
          </Link>
          <Link
            href="/pricing"
            className="text-center py-3 rounded-2xl font-bold text-sm text-[#1A6640] border border-[#B8D9C8] bg-white"
          >
            💴 料金表
          </Link>
        </div>
      </div>
    </main>
  )
}
