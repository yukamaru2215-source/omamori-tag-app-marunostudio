import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { buildEmailHtml } from '../send-message/route'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { message_id } = await request.json()

    if (!message_id) {
      return NextResponse.json({ error: 'message_id が必要です' }, { status: 400 })
    }

    // メッセージと園名を取得
    const { data: message } = await supabaseAdmin
      .from('messages')
      .select('*, nurseries(name)')
      .eq('id', message_id)
      .single()

    if (!message) {
      return NextResponse.json({ error: 'メッセージが見つかりません' }, { status: 404 })
    }

    // 受信者一覧を取得
    const { data: recipients } = await supabaseAdmin
      .from('message_recipients')
      .select('parent_id, email')
      .eq('message_id', message_id)

    // 開封済み parent_id を取得
    const { data: reads } = await supabaseAdmin
      .from('message_reads')
      .select('parent_id')
      .eq('message_id', message_id)

    const readParentIds = new Set((reads ?? []).map((r) => r.parent_id))

    // 未開封の受信者だけ抽出
    const unread = (recipients ?? []).filter((r) => !readParentIds.has(r.parent_id))

    if (unread.length === 0) {
      return NextResponse.json({ success: true, sentCount: 0 })
    }

    const nurseryName = (message.nurseries as { name: string } | null)?.name ?? '保育園'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${request.nextUrl.protocol}//${request.nextUrl.host}`

    let sentCount = 0
    await Promise.all(
      unread.map(async ({ parent_id, email }) => {
        const trackingUrl = `${baseUrl}/api/read-message/${message_id}?pid=${parent_id}`
        const html = buildEmailHtml(nurseryName, message.title, message.body, trackingUrl, true)

        const { error } = await resend.emails.send({
          from: 'noreply@marunostudio.com',
          to: email,
          subject: `【リマインド】【${nurseryName}】${message.title}`,
          html,
        })

        if (!error) sentCount++
      })
    )

    return NextResponse.json({ success: true, sentCount })
  } catch (err) {
    console.error('send-reminder error:', err)
    return NextResponse.json({ error: 'リマインド送信中にエラーが発生しました' }, { status: 500 })
  }
}
