import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { childId, lat, lng } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1分以内の重複チェック
  const since = new Date(Date.now() - 60_000).toISOString()
  const { count } = await supabase
    .from('notification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('child_id', childId)
    .gte('sent_at', since)

  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: 'TOO_MANY_REQUESTS' }, { status: 429 })
  }

  // 子どもと保護者のメール取得
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('display_name, parent_id')
    .eq('id', childId)
    .single()

  if (childError || !child) {
    console.error('child error:', childError)
    return NextResponse.json({ error: 'NOT_FOUND', detail: childError?.message }, { status: 404 })
  }

  if (!child.parent_id) {
    return NextResponse.json({ error: 'NO_PARENT_ID' }, { status: 400 })
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(child.parent_id)
  const parentEmail = userData?.user?.email

  if (userError || !parentEmail) {
    console.error('user error:', userError)
    return NextResponse.json({ error: 'NO_EMAIL', detail: userError?.message }, { status: 400 })
  }

  const locationText = lat && lng
    ? `<a href="https://www.google.com/maps?q=${lat},${lng}">📍 現在地を地図で見る</a>`
    : '📍 位置情報は取得できませんでした'

  // Resendでメール送信
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'おまもりタグ <noreply@marunostudio.com>',
      to: parentEmail,
      subject: `🚨 ${child.display_name}の緊急通知`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #B83030; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="margin: 0;">🚨 緊急通知</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 12px 12px;">
            <p><strong>${child.display_name}</strong> のおまもりタグがスキャンされ、緊急通知が送信されました。</p>
            <p>${locationText}</p>
            <p style="color: #888; font-size: 12px;">送信時刻: ${new Date().toLocaleString('ja-JP')}</p>
          </div>
        </div>
      `,
    }),
  })

  const resendData = await resendRes.json()

  if (!resendRes.ok) {
    console.error('resend error:', resendData)
    return NextResponse.json({ error: 'MAIL_FAILED', detail: resendData }, { status: 500 })
  }

  // ログ記録
  await supabase.from('notification_logs').insert({ child_id: childId, lat, lng })

  return NextResponse.json({ ok: true, email: parentEmail })
}