'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏷️</div>
          <h1 className="text-3xl font-black text-[#1A6640] mb-2">
            保育園NFCアプリ
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

          <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm">
            <div className="text-xs font-bold text-[#7A8E80] uppercase tracking-widest mb-3">
              デモ：NFCタグ読み取り
            </div>
            <Link
              href="/kid/demo"
              className="block bg-[#E6F4EC] text-[#1A6640] text-center py-3 rounded-xl font-bold"
            >
              👧 園児の医療情報を見る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
