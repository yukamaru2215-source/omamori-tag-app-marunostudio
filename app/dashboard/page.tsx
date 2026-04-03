'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// 修正後：1つ上の階層（app直下）にある lib を見に行く
import { createClient } from '../../lib/supabase'
import { Child } from '../../lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { 
        router.push('/login')
        return 
      }
      setUserEmail(session.user.email ?? '')
      
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

  if (loading) return <div className="p-10 text-center text-[#7A8E80]">読み込み中...</div>

  return (
    <main className="min-h-screen bg-[#F4F7F5] p-4">
      <div className="max-w-md mx-auto text-[#0E1A12]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-[#1A6640]">{userEmail}</span>
          <button onClick={handleLogout} className="text-xs bg-white border border-[#E0EAE2] px-3 py-1 rounded-lg">ログアウト</button>
        </div>

        <div className="space-y-4">
          {children.length === 0 ? (
            <div className="text-center py-10 text-[#7A8E80]">登録されたお子様はいません</div>
          ) : (
            children.map(child => (
              <div key={child.id} className="bg-white p-4 rounded-2xl border border-[#E0EAE2] shadow-sm">
                <div className="font-black mb-2">{child.name}</div>
                <div className="flex gap-2">
                  <Link href={`/kid/${child.slug}`} className="flex-1 text-center bg-[#E6F4EC] text-[#1A6640] py-2 rounded-xl text-sm font-bold">表示</Link>
                  <Link href={`/edit/${child.id}`} className="flex-1 text-center bg-[#F4F7F5] text-[#3A4A3E] py-2 rounded-xl text-sm font-bold border border-[#E0EAE2]">編集</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <Link href="/register" className="block w-full bg-[#1A6640] text-white text-center py-4 rounded-2xl font-bold mt-6 shadow-lg">
          ＋ お子様を登録する
        </Link>
      </div>
    </main>
  )
}