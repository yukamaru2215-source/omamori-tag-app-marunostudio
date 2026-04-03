'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase' // { supabase } から変更
import { Child } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  
  // クライアントの初期化
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { 
        router.push('/login')
        return 
      }
      setUserEmail(session.user.email ?? '')
      
      // parent_id (auth.uid) で絞り込み
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', session.user.id)
      
      if (!error) {
        setChildren(data ?? [])
      }
      setLoading(false)
    }
    load()
  }, [router, supabase.auth])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A8E80]">ログイン中</div>
            <div className="font-bold text-[#0E1A12] truncate max-w-[200px]">{userEmail}</div>
          </div>
          <button onClick={handleLogout} className="text-sm text-[#7A8E80] border border-[#E0EAE2] px-3 py-2 rounded-xl bg-white active:bg-gray-50">
            ログアウト
          </button>
        </div>

        <div className="text-xs font-black text-[#7A8E80] uppercase tracking-widest mb-3">
          登録済みのお子様
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E0EAE2] shadow-sm mb-4">
            <div className="text-4xl mb-3">👶</div>
            <div className="text-sm text-[#7A8E80]">まだお子様が登録されていません。<br/>下のボタンから登録してください。</div>
          </div>
        ) : (
          children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl p-4 border border-[#E0EAE2] shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EC] flex items-center justify-center text-2xl">👧</div>
                <div>
                  {/* DBのカラム名に合わせて name に修正 */}
                  <div className="font-black text-[#0E1A12]">{child.name}</div>
                  <div className="text-xs text-[#7A8E80]">血液型: {child.blood_type || '未設定'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/kid/${child.slug}`} className="flex-1 text-center bg-[#E6F4EC] text-[#1A6640] py-2 rounded-xl text-sm font-bold active:opacity-70">
                  情報表示
                </Link>
                <Link href={`/edit/${child.id}`} className="flex-1 text-center bg-[#F4F7F5] text-[#3A4A3E] py-2 rounded-xl text-sm font-bold border border-[#E0EAE2] active:bg-gray-100">
                  編集する
                </Link>
              </div>
            </div>
          ))
        )}

        <Link href="/register" className="block w-full bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg mt-4 active:scale-[0.98] transition-transform">
          ＋ お子様を登録する
        </Link>
      </div>
    </main>
  )
}