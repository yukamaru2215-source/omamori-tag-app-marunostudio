import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { count } = await request.json()

    if (!count || count < 1 || count > 200) {
      return NextResponse.json({ error: '個数は1〜200の範囲で指定してください' }, { status: 400 })
    }

    const ids = Array.from({ length: count }, () => randomBytes(6).toString('hex'))

    const { data, error } = await supabaseAdmin
      .from('tags')
      .insert(ids.map((id) => ({ id })))
      .select('id, created_at')

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'タグの発行に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ tags: data })
  } catch (err) {
    console.error('generate-tags error:', err)
    return NextResponse.json({ error: '発行中にエラーが発生しました' }, { status: 500 })
  }
}
