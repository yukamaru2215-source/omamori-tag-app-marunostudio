'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TagPage({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = use(params)
  const router = useRouter()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: tag } = await supabase
        .from('tags')
        .select('child_id')
        .eq('id', tagId)
        .single()

      if (!tag) { setNotFound(true); return }

      if (!tag.child_id) {
        router.replace(`/register?tagId=${encodeURIComponent(tagId)}`)
        return
      }

      const { data: child } = await supabase
        .from('children')
        .select('slug')
        .eq('id', tag.child_id)
        .single()

      if (!child) { setNotFound(true); return }
      router.replace(`/kid/${child.slug}`)
    }
    load()
  }, [tagId, router])

  if (notFound) return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-4">❓</div>
      <div className="font-black text-xl text-[#0E1A12] mb-2">タグが見つかりません</div>
      <div className="text-sm text-[#7A8E80]">このタグは登録されていないか、無効になっています。</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
      <div className="text-[#7A8E80]">読み込み中...</div>
    </main>
  )
}
