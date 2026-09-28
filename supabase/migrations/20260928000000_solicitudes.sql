-- Solicitudes del formulario de contacto de la web de VERTIAN SOLUTIONS.
-- Pégalo en Supabase: SQL Editor → New query → Run.

create table if not exists public.solicitudes (
  id        bigint generated always as identity primary key,
  creado    timestamptz not null default now(),
  nombre    text not null check (char_length(nombre) between 1 and 120),
  email     text not null check (char_length(email) between 3 and 200),
  telefono  text check (char_length(telefono) <= 40),
  servicio  text not null check (char_length(servicio) between 1 and 120),
  mensaje   text check (char_length(mensaje) <= 5000),
  pagina    text check (char_length(pagina) <= 80),
  idioma    text not null default 'es' check (idioma in ('es', 'en')),
  -- Para el seguimiento: cámbialo a mano en el Table Editor (presupuestada, cliente, descartada…).
  estado    text not null default 'nueva',
  notas     text
);

comment on table public.solicitudes is 'Solicitudes recibidas desde el formulario de la web';

create index if not exists solicitudes_creado_idx on public.solicitudes (creado desc);
create index if not exists solicitudes_email_idx on public.solicitudes (email, creado desc);

-- Seguridad: RLS activado y sin políticas. Nadie puede leer ni escribir con la clave pública;
-- solo la función «contacto» (con la clave de servicio) y tú desde el panel de Supabase.
alter table public.solicitudes enable row level security;
revoke all on public.solicitudes from anon, authenticated;
