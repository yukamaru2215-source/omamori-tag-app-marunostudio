import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const THEMES = {
  product: 'おまもりタグの商品紹介・特徴・使い方',
  emergency: 'もしもの備え・緊急時の安心について',
  allergy: 'アレルギー・持病のある子を持つ親への共感',
  nfc: 'NFCタグをかざすだけ・デジタルの便利さ',
  tips: '子育てTips・安心して送り出すコツ',
  story: '実際の使用シーンのイメージストーリー',
} as const

type Theme = keyof typeof THEMES

export async function POST(req: NextRequest) {
  const { theme, memo } = await req.json() as { theme: Theme; memo?: string }

  const themeDesc = THEMES[theme] ?? THEMES.product

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `あなたはInstagram投稿のコピーライターです。「おまもりタグ」というサービスのInstagram投稿文を書いてください。

【おまもりタグとは】
未就学児〜小学生の子どもの持ち物につけるNFCタグ付きのお守り型グッズ。スマートフォンをかざすだけで、アレルギー・持病・緊急連絡先などの医療情報にアクセスできる。保護者がアプリで情報を管理し、保育士など認証されたスタッフのみ詳細を閲覧できる仕組み。あくまで「サブのおまもり」として、緊急時は必ず医療機関・救急の指示に従う前提で使うもの。

【ブランドトーン】
・押し付けがましくない、優しく共感的なトーン
・技術の凄さより「子どもを持つ親の安心」を前面に
・シンプルで読みやすい。長すぎない
・キャッチコピー「子どもに新しい安心、始めました。」の世界観に合わせる

【今回のテーマ】
${themeDesc}
${memo ? `\n【補足メモ】\n${memo}` : ''}

【出力形式】
本文（150〜250文字）、改行あり、絵文字を2〜3個自然に使う。
最後にハッシュタグを8〜10個。
本文とハッシュタグの間は空行を入れる。
余計な説明は不要。投稿文だけを出力してください。`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ caption: text })
}
