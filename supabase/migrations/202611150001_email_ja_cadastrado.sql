-- Consulta pública que retorna somente existência de conta confirmada.
create or replace function public.email_ja_cadastrado(email_consulta text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  endereco text := lower(btrim(email_consulta));
begin
  if endereco is null or length(endereco) > 254 or position('@' in endereco) < 2 then
    raise exception 'Endereço inválido' using errcode = '22023';
  end if;
  return exists (
    select 1 from auth.users as u
    where lower(u.email) = endereco and u.email_confirmed_at is not null
  );
end;
$$;

revoke all on function public.email_ja_cadastrado(text) from public;
grant execute on function public.email_ja_cadastrado(text) to anon, authenticated;
