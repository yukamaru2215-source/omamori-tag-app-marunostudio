import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { parent_id, subscription } = await request.json()

    if (!parent_id || !subscription?.endpoint) {
      return NextResponse.json({ error: '不正なリクエスト' }, { status: 400 })
    }

    const { endpoint, keys } = subscription

    await supabaseAdmin
      .from('push_subscriptions')
      .upsert(
        {
          parent_id,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
        { onConflict: 'endpoint' }
      )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('push-subscribe error:', err)
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 })
  }
}
