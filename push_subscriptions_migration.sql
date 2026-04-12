-- プッシュ通知購読情報テーブル
create table if not exists push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz default now()
);

-- RLS: 自分の購読のみ操作可能
alter table push_subscriptions enable row level security;

create policy "own_push_subscription_select" on push_subscriptions
  for select using (auth.uid() = parent_id);

create policy "own_push_subscription_insert" on push_subscriptions
  for insert with check (auth.uid() = parent_id);

create policy "own_push_subscription_delete" on push_subscriptions
  for delete using (auth.uid() = parent_id);
