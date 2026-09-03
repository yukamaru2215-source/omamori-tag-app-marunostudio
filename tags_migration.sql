-- NFCタグ自己登録用テーブル
-- 販売者が事前に物理タグへ /tag/[id] のURLを書き込み、購入者はかざすだけで登録・閲覧できるようにする
create table if not exists tags (
  id           text primary key,
  child_id     uuid references children(id) on delete set null,
  created_at   timestamptz default now(),
  activated_at timestamptz
);

alter table tags enable row level security;

-- 誰でも参照可能（未ログインでタグをかざした人が /tag/[id] で行き先を判定できるように）
create policy "tags_select_all" on tags
  for select using (true);

-- 認証済みユーザーは、未登録のタグ、または自分のchildrenに紐づくタグのみ更新可能
create policy "tags_update_own" on tags
  for update
  to authenticated
  using (
    child_id is null
    or child_id in (select id from children where parent_id = auth.uid())
  )
  with check (
    child_id is null
    or child_id in (select id from children where parent_id = auth.uid())
  );
