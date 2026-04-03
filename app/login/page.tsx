'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-2xl font-black text-[#0E1A12] mb-2">
            保護者ログイン
          </h1>
          <p className="text-sm text-[#7A8E80]">
            Googleアカウントでログインしてください
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
        >
          G Googleでログイン
        </button>
        <p className="text-center text-xs text-[#7A8E80] mt-6">
          🔒 SSL暗号化通信で安全に管理されます
        </p>
      </div>
    </main>
  )
}