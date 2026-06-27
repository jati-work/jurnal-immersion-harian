-- =====================================================================
-- SKEMA DATABASE: Jurnal Immersion Harian
-- Jalanin ini di Supabase Dashboard > SQL Editor > New query > Run
--
-- Catatan: app ini gak pakai Supabase Auth sama sekali (gak ada akun/email).
-- Yang ngejaga "privasi" cuma 2 hal: (1) URL Vercel-nya gak disebar,
-- dan (2) kata sandi simpel di halaman pembuka app (dicek di sisi browser,
-- BUKAN keamanan kelas militer, cuma buat nyaring orang random).
-- =====================================================================

-- 1. Tabel PAKET (kumpulan kata, misal "Anime XYZ Eps 1")
create table if not exists paket (
  id uuid primary key default gen_random_uuid(),
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
  jp text not null,
  arti text not null,
  bagian text default '',
  hafal boolean default false,
  created_at timestamptz default now()
);

-- 3. Tabel JURNAL (catatan kalender harian)
create table if not exists jurnal (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null unique,      -- format YYYY-MM-DD
  catatan text not null,
  created_at timestamptz default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY: diaktifkan tapi dibuka buat siapapun yang punya
-- anon key (yang emang udah nempel di kode frontend kamu). Karena cuma
-- 1 orang pengguna dan gak ada akun, gak ada cara bedain "user" di level DB.
-- =====================================================================
alter table paket enable row level security;
alter table kata enable row level security;
alter table jurnal enable row level security;

create policy "paket: bebas akses" on paket for all using (true) with check (true);
create policy "kata: bebas akses" on kata for all using (true) with check (true);
create policy "jurnal: bebas akses" on jurnal for all using (true) with check (true);

-- =====================================================================
-- STORAGE BUCKET buat PDF (jalanin manual lewat dashboard, lihat README)
-- Nama bucket: immersion-pdfs (private, bukan public)
-- =====================================================================

