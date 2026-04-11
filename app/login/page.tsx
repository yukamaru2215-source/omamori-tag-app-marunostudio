'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Mode = 'select' | 'signin' | 'signup' | 'reset'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('select')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  async function handleSignIn() {
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  async function handleSignUp() {
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    if (password.length < 8) { setError('パスワードは8文字以上で入力してください'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message.includes('already registered')
        ? 'このメールアドレスは既に登録されています'
        : '登録に失敗しました。もう一度お試しください')
    } else {
      setDone('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。')
    }
    setLoading(false)
  }

  async function handleReset() {
    if (!email) { setError('メールアドレスを入力してください'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    })
    if (error) {
      setError('送信に失敗しました')
    } else {
      setDone('パスワードリセットのメールを送信しました。')
    }
    setLoading(false)
  }

  // ── 方法選択画面 ──────────────────────────────────────
  if (mode === 'select') return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-2xl font-black text-[#0E1A12] mb-2">保護者ログイン</h1>
          <p className="text-sm text-[#7A8E80]">ログイン方法を選択してください</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-[#E0EAE2] text-[#0E1A12] py-4 rounded-2xl font-bold text-base shadow-sm flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン
          </button>

          <button
            onClick={() => setMode('signin')}
            className="w-full bg-[#1A6640] text-white py-4 rounded-2xl font-bold text-base"
          >
            📧 メールアドレスでログイン
          </button>

          <button
            onClick={() => setMode('signup')}
            className="w-full bg-white border border-[#E0EAE2] text-[#1A6640] py-4 rounded-2xl font-bold text-base"
          >
            ✉️ 新規登録（メール）
          </button>
        </div>

        <p className="text-center text-xs text-[#7A8E80] mt-6">
          🔒 SSL暗号化通信で安全に管理されます
        </p>
      </div>
    </main>
  )

  // ── 完了メッセージ ──────────────────────────────────────
  if (done) return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">📬</div>
        <div className="font-black text-xl text-[#0E1A12] mb-3">メールを送信しました</div>
        <div className="text-sm text-[#7A8E80] leading-relaxed mb-6">{done}</div>
        <button onClick={() => { setDone(''); setMode('select') }} className="text-sm text-[#1A6640] font-bold">← ログイン画面に戻る</button>
      </div>
    </main>
  )

  // ── メール/パスワード フォーム ──────────────────────────
  const titles: Record<Mode, string> = {
    select: '',
    signin: 'メールでログイン',
    signup: '新規登録',
    reset: 'パスワードをリセット',
  }

  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{mode === 'reset' ? '🔑' : '📧'}</div>
          <h1 className="text-xl font-black text-[#0E1A12]">{titles[mode]}</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E0EAE2] shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-black text-[#7A8E80] mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
              placeholder="example@email.com"
              autoComplete="email"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-black text-[#7A8E80] mb-1">
                パスワード{mode === 'signup' && '（8文字以上）'}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                className="w-full border border-[#E0EAE2] rounded-xl px-4 py-3 text-sm outline-none"
                placeholder={mode === 'signup' ? '8文字以上のパスワード' : 'パスワード'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
          )}

          {error && (
            <div className="bg-[#FCEAEA] text-[#B83030] text-xs font-bold px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            onClick={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleReset}
            disabled={loading}
            className="w-full bg-[#1A6640] text-white py-4 rounded-xl font-black text-base disabled:opacity-50"
          >
            {loading ? '処理中...' : mode === 'signin' ? 'ログイン' : mode === 'signup' ? '登録する' : 'リセットメールを送信'}
          </button>
        </div>

        {/* サブリンク */}
        <div className="mt-4 space-y-2 text-center">
          {mode === 'signin' && (
            <button onClick={() => { setMode('reset'); setError('') }} className="block w-full text-xs text-[#7A8E80]">
              パスワードを忘れた方はこちら
            </button>
          )}
          {mode === 'signin' && (
            <button onClick={() => { setMode('signup'); setError('') }} className="block w-full text-xs text-[#1A6640] font-bold">
              アカウントをお持ちでない方 → 新規登録
            </button>
          )}
          {mode === 'signup' && (
            <button onClick={() => { setMode('signin'); setError('') }} className="block w-full text-xs text-[#1A6640] font-bold">
              既にアカウントをお持ちの方 → ログイン
            </button>
          )}
          <button onClick={() => { setMode('select'); setError('') }} className="block w-full text-xs text-[#7A8E80]">
            ← 戻る
          </button>
        </div>
      </div>
    </main>
  )
}
