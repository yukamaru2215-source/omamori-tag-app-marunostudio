-- ============================================
-- 表示項目の公開/鍵付き設定 マイグレーション
-- Supabase SQL Editor で実行してください
-- ============================================

-- 各項目を「公開（誰でも閲覧可）」「鍵付き（スタッフ認証後のみ閲覧可）」で
-- 保護者が選べるようにする設定カラム。
-- 既存タグの見え方が変わらないよう、これまでの挙動と同じ値をデフォルトにしている。
ALTER TABLE children ADD COLUMN IF NOT EXISTS field_visibility JSONB NOT NULL DEFAULT '{
  "birthdate": "locked",
  "allergies": "public",
  "conditions": "public",
  "epipen_location": "locked",
  "medications": "locked",
  "emergency_contacts": "locked",
  "doctors": "locked"
}'::jsonb;
