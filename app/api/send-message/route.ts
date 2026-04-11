import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { nursery_id, title, body, send_to, group_ids } = await request.json()

    if (!nursery_id || !title || !body) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    // 園名を取得
    const { data: nursery } = await supabaseAdmin
      .from('nurseries')
      .select('name')
      .eq('id', nursery_id)
      .single()

    if (!nursery) {
      return NextResponse.json({ error: '園が見つかりません' }, { status: 404 })
    }

    // 送信対象の parent_id を収集
    let parentIds: string[] = []

    if (send_to === 'all') {
      const { data: children } = await supabaseAdmin
        .from('children')
        .select('parent_id')
        .eq('nursery_id', nursery_id)
        .not('parent_id', 'is', null)

      parentIds = [...new Set((children ?? []).map((c) => c.parent_id as string))]
    } else {
      // グループ指定
      const { data: childGroupData } = await supabaseAdmin
        .from('child_groups')
        .select('child_id')
        .in('group_id', group_ids ?? [])

      const childIds = (childGroupData ?? []).map((cg) => cg.child_id)
      if (childIds.length > 0) {
        const { data: children } = await supabaseAdmin
          .from('children')
          .select('parent_id')
          .in('id', childIds)
          .eq('nursery_id', nursery_id)
          .not('parent_id', 'is', null)

        parentIds = [...new Set((children ?? []).map((c) => c.parent_id as string))]
      }
    }

    if (parentIds.length === 0) {
      return NextResponse.json({ error: '対象の保護者が見つかりませんでした' }, { status: 400 })
    }

    // parent_id → email を取得（重複排除済みの parentIds を並列処理）
    const emailMap: Record<string, string> = {}
    await Promise.all(
      parentIds.map(async (parentId) => {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(parentId)
        if (user?.email) {
          emailMap[parentId] = user.email
        }
      })
    )

    const recipientCount = Object.keys(emailMap).length
    if (recipientCount === 0) {
      return NextResponse.json({ error: 'メールアドレスが取得できませんでした' }, { status: 400 })
    }

    // メッセージをDBに保存
    const { data: message, error: msgError } = await supabaseAdmin
      .from('messages')
      .insert({
        nursery_id,
        title,
        body,
        send_to,
        group_ids: group_ids ?? [],
        recipient_count: recipientCount,
      })
      .select()
      .single()

    if (msgError || !message) {
      return NextResponse.json({ error: 'メッセージの保存に失敗しました' }, { status: 500 })
    }

    // 受信者ログを保存
    await supabaseAdmin.from('message_recipients').insert(
      Object.entries(emailMap).map(([parentId, email]) => ({
        message_id: message.id,
        parent_id: parentId,
        email,
      }))
    )

    // Resend でメール送信
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${request.nextUrl.protocol}//${request.nextUrl.host}`

    let sentCount = 0
    await Promise.all(
      Object.entries(emailMap).map(async ([parentId, email]) => {
        const trackingUrl = `${baseUrl}/api/read-message/${message.id}?pid=${parentId}`

        const html = buildEmailHtml(nursery.name, title, body, trackingUrl, false)

        const { error } = await resend.emails.send({
          from: 'noreply@marunostudio.com',
          to: email,
          subject: `【${nursery.name}】${title}`,
          html,
        })

        if (!error) sentCount++
      })
    )

    return NextResponse.json({ success: true, sentCount, messageId: message.id })
  } catch (err) {
    console.error('send-message error:', err)
    return NextResponse.json({ error: '送信中にエラーが発生しました' }, { status: 500 })
  }
}

export function buildEmailHtml(
  nurseryName: string,
  title: string,
  body: string,
  trackingUrl: string,
  isReminder: boolean
): string {
  const bannerColor = isReminder ? '#E6A817' : '#1A6640'
  const subLabel = isReminder
    ? `【${nurseryName}】からのお知らせ（リマインド）`
    : `【${nurseryName}】からのお知らせ`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F4F7F5;">
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:${bannerColor};color:white;padding:24px;border-radius:12px 12px 0 0;">
      <div style="font-size:12px;opacity:0.85;margin-bottom:6px;">${subLabel}</div>
      <h2 style="margin:0;font-size:20px;line-height:1.4;">${escapeHtml(title)}</h2>
    </div>
    <div style="background:white;padding:24px;border:1px solid #E0EAE2;border-top:none;border-radius:0 0 12px 12px;">
      <div style="white-space:pre-wrap;color:#0E1A12;line-height:1.8;font-size:14px;">${escapeHtml(body)}</div>
    </div>
    <div style="text-align:center;padding:16px;color:#7A8E80;font-size:11px;">
      このメールは ${escapeHtml(nurseryName)} からomamori-tagを通じて送信されました
    </div>
  </div>
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0;" />
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
