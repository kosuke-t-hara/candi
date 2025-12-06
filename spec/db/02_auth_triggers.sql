-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, bio)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name', -- メタデータから名前を取得（あれば）
    ''
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
-- auth.users テーブルへの insert をトリガーにする
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
