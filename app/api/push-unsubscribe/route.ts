import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { parent_id, endpoint } = await request.json()

    if (!parent_id) {
      return NextResponse.json({ error: '不正なリクエスト' }, { status: 400 })
    }

    const query = supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('parent_id', parent_id)

    if (endpoint) {
      query.eq('endpoint', endpoint)
    }

    await query

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('push-unsubscribe error:', err)
    return NextResponse.json({ error: '解除に失敗しました' }, { status: 500 })
  }
}
