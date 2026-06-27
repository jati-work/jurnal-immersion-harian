-- =====================================================================
-- SKEMA DATABASE: Jurnal Immersion Harian
-- Jalanin ini di Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================

-- 1. Tabel PAKET (kumpulan kata, misal "Anime XYZ Eps 1")
create table if not exists paket (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nama text not null,
  tanggal text default '',           -- bebas teks, misal "Januari 2026"
  urutan int not null default 0,     -- buat urutan manual (drag/naik-turun)
  pdf_path text,                     -- path file di Supabase Storage (nullable)
  created_at timestamptz default now()
);

-- 2. Tabel KATA (kosakata di dalam paket)
create table if not exists kata (
  id uuid primary key default gen_random_uuid(),
  paket_id uuid not null references paket(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  jp text not null,
  arti text not null,
  bagian text default '',
  hafal boolean default false,
  created_at timestamptz default now()
);

-- 3. Tabel JURNAL (catatan kalender harian)
create table if not exists jurnal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tanggal date not null,             -- format YYYY-MM-DD
  catatan text not null,
  created_at timestamptz default now(),
  unique(user_id, tanggal)
);

-- =====================================================================
-- ROW LEVEL SECURITY: tiap user cuma bisa liat/edit data miliknya sendiri
-- =====================================================================
alter table paket enable row level security;
alter table kata enable row level security;
alter table jurnal enable row level security;

create policy "paket: akses data sendiri" on paket
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "kata: akses data sendiri" on kata
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "jurnal: akses data sendiri" on jurnal
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================================================================
-- STORAGE BUCKET buat PDF (jalanin manual lewat dashboard, lihat README)
-- Nama bucket: immersion-pdfs (private, bukan public)
-- =====================================================================
