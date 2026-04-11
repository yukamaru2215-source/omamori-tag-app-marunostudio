-- ============================================
-- 一斉連絡機能 マイグレーション
-- Supabase SQL Editor で実行してください
-- ============================================

-- グループテーブル
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nursery_id UUID NOT NULL REFERENCES nurseries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 子ども×グループ中間テーブル
CREATE TABLE IF NOT EXISTS child_groups (
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (child_id, group_id)
);

-- メッセージテーブル
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nursery_id UUID NOT NULL REFERENCES nurseries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  send_to TEXT NOT NULL DEFAULT 'all',
  group_ids UUID[] DEFAULT '{}',
  recipient_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 受信者テーブル（送信ログ・重複排除）
CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL,
  email TEXT NOT NULL,
  UNIQUE(message_id, parent_id)
);

-- 開封記録テーブル
CREATE TABLE IF NOT EXISTS message_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, parent_id)
);

-- ============================================
-- RLS設定
-- ============================================

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

-- groups: 誰でも読める・認証済みユーザーは書ける
CREATE POLICY "groups_select_all"    ON groups FOR SELECT USING (true);
CREATE POLICY "groups_insert_auth"   ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "groups_update_auth"   ON groups FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "groups_delete_auth"   ON groups FOR DELETE USING (auth.role() = 'authenticated');

-- child_groups: 誰でも読める・自分の子どもだけ書ける
CREATE POLICY "child_groups_select_all"  ON child_groups FOR SELECT USING (true);
CREATE POLICY "child_groups_insert_own"  ON child_groups FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM children WHERE children.id = child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "child_groups_delete_own"  ON child_groups FOR DELETE USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = child_id AND children.parent_id = auth.uid())
);

-- messages: 認証済みユーザーは読める（書き込みはサービスロール経由）
CREATE POLICY "messages_select_auth" ON messages FOR SELECT USING (auth.role() = 'authenticated');

-- message_recipients: 認証済みユーザーは読める（書き込みはサービスロール経由）
CREATE POLICY "message_recipients_select_auth" ON message_recipients FOR SELECT USING (auth.role() = 'authenticated');

-- message_reads: トラッキングピクセルのため誰でも挿入可・認証済みは読める
CREATE POLICY "message_reads_select_auth"  ON message_reads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "message_reads_insert_all"   ON message_reads FOR INSERT WITH CHECK (true);
