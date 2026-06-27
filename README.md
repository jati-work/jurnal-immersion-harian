# 🌿 Jurnal Immersion Harian (versi web app)

Versi React + Supabase dari Jurnal Immersion Harian kamu. Panduan ini nuntun
dari nol: bikin Supabase, push ke GitHub, deploy ke Vercel.

## Yang udah ada di v1 ini
- Login (email + password) — datamu privat, gak ketuker sama orang lain
- Daftar paket: search, grouping per tanggal (collapsible), urutan manual (▲▼)
- Flashcard per paket (flip buka/tutup, tandai hafal)
- Tambah kata + **active recall**: kalau kata (kanji/kana) udah ada di paket
  manapun, sistem nahan dan kasih reminder "ayo inget-inget" (gak nampilin arti)
- Upload & lihat PDF per paket (panel full-screen, nutup flashcard pas dibuka)
- Jurnal Kalender (klik tanggal buat isi catatan, ada streak counter)

## Yang BELUM ada (next iteration, nyusul)
- Mode Tes (kuis tebak-tebakan)
- Random / Sembunyikan hafal / Hafal saja (filter tampilan kartu)
- Mode Edit & Mode Hapus kata (drag, klik kartu langsung)
- Bagian (sub-grup kata dalam satu paket)
- Cara Belajar & Fondasi (accordion edukasi)
- Simpan/Muat hafalan manual (gak perlu lagi karena udah live di database)

---

## LANGKAH 1 — Bikin project Supabase

1. Buka [supabase.com](https://supabase.com), bikin akun (gratis), klik **New Project**.
2. Kasih nama (misal `immersion-journal`), pilih region paling dekat (Singapore biasanya paling cepat dari Indonesia), bikin password database (simpen baik-baik, beda sama password login app).
3. Tunggu sampai project siap (~2 menit).
4. Buka tab **SQL Editor** (ikon di sidebar kiri) → **New query**.
5. Copy-paste seluruh isi file `supabase/schema.sql` dari project ini → klik **Run**.
   Ini bikin tabel `paket`, `kata`, `jurnal` + keamanan datanya (Row Level Security).
6. Buka tab **Storage** (sidebar kiri) → **New bucket**.
   - Nama: `immersion-pdfs`
   - **Jangan** dicentang "Public bucket" (biarin private, biar gak sembarang orang bisa akses PDF kamu).
   - Klik **Save**.
7. Buka tab **Project Settings** → **API**.
   - Copy **Project URL** dan **anon public key** — ini bakal dipake di langkah 3.

## LANGKAH 2 — Push ke GitHub

1. Bikin repo baru di GitHub (misal `immersion-journal`), **kosongin** (jangan kasih README otomatis).
2. Di komputer kamu, extract folder project ini, terus jalanin di terminal (folder project):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jurnal Immersion Harian"
   git branch -M main
   git remote add origin https://github.com/USERNAME/immersion-journal.git
   git push -u origin main
   ```
   (Ganti `USERNAME` dengan username GitHub kamu)

> File `.env` **gak akan ke-push** (udah diatur di `.gitignore`), jadi credential Supabase kamu aman, gak keliatan publik di GitHub.

## LANGKAH 3 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com), login pakai akun GitHub kamu.
2. Klik **Add New → Project**, pilih repo `immersion-journal` yang baru di-push.
3. Di halaman **Configure Project**, buka bagian **Environment Variables**, tambahin 2 ini:
   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | (Project URL dari Langkah 1.7) |
   | `VITE_SUPABASE_ANON_KEY` | (anon public key dari Langkah 1.7) |
4. Klik **Deploy**. Tunggu ~1 menit.
5. Selesai! Vercel kasih kamu URL (misal `immersion-journal.vercel.app`) — itu app kamu udah live.

## LANGKAH 4 — Bikin akun & login

1. Buka URL Vercel kamu, klik **"Belum punya akun? Daftar dulu"**.
2. Isi email + password, klik **Daftar**.
3. Supabase ngirim email konfirmasi (cek inbox/spam) — klik link konfirmasinya.
4. Balik ke app, login pakai email+password yang sama.

Sekarang kamu bisa mulai bikin paket dari mana aja, kapan aja, datanya kesimpen aman di Supabase.

---

## Develop lokal (opsional, kalau mau coba-coba/edit dulu sebelum deploy)

```bash
npm install
cp .env.example .env
# isi .env dengan Project URL & anon key dari Supabase
npm run dev
```
Buka `http://localhost:5173`.

## Soal kapasitas (free tier Supabase)
- Database: 500 MB — kosakata teks gak akan makan banyak, aman lama.
- File Storage (buat PDF): 1 GB — kira-kira cukup buat ratusan PDF skrip pendek.
- ⚠️ Project auto-pause kalau **7 hari** gak ada aktivitas sama sekali. Kalau kamu jeda lama, tinggal buka dashboard Supabase dan klik "Resume" — data gak hilang.
