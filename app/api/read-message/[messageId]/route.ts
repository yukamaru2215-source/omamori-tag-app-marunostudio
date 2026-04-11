import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// 1×1 透明GIF (Base64)
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params
  const parentId = request.nextUrl.searchParams.get('pid')

  if (messageId && parentId) {
    // 開封を記録（重複は UNIQUE 制約で無視）
    const { error } = await supabaseAdmin
      .from('message_reads')
      .upsert(
        { message_id: messageId, parent_id: parentId },
        { onConflict: 'message_id,parent_id', ignoreDuplicates: true }
      )
    if (error) {
      console.error('[read-message] upsert error', { messageId, error: error.message })
    }
  }

  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
