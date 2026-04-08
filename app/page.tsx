'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏷️</div>
          <h1 className="text-3xl font-black text-[#1A6640] mb-2">
            おまもりタグアプリ
          </h1>
          <p className="text-sm text-[#7A8E80]">
            園児の医療情報をNFCタグで安全に管理
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            👨‍👩‍👧 保護者ログイン
          </Link>

          
        </div>
      </div>
    </main>
  )
}
