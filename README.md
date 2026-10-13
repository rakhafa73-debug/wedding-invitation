# Nuptia — Jasa Undangan Pernikahan Online (Wedding Invitation SaaS)

Platform bisnis pembuatan undangan pernikahan online profesional dengan tema eksklusif **Deep Emerald & Soft Gold**, konfirmasi kehadiran RSVP real-time, manajemen buku tamu personalisasi WhatsApp, amplop digital dinamis, musik latar romantis, dan dashboard administrasi lengkap berbasis **Supabase (PostgreSQL, Auth, Storage, & RLS)**.

---

## 🏛️ Tahap 1: Analisis Desain Referensi

Desain undangan dirancang mengacu pada karakteristik spesifikasi visual utama:

### 1. Palet Warna
- **Hijau Gelap (Deep Emerald):** `#2D4038` — Latar belakang Hero utama, aksen tombol utama, dan Footer penutup.
- **Krem Hangat (Pearl Cream):** `#F9F6EE` — Latar belakang bagian isi sambutan, kartu informasi, dan konten body.
- **Emas Lembut (Soft Gold):** `#B6A078` — Garis bingkai arch, teks label aksen, tanggal acara, ikon, divider, dan ornamen mewah.
- **Putih Bersih (Pure White):** `#FFFFFF` — Kartu informasi Akad & Resepsi, buku tamu, dan form RSVP.
- **Abu-abu Teks (Text Muted):** `#77756E` — Warna teks tubuh untuk keterbacaan tinggi dan kenyamanan mata.

### 2. Tipografi
- **Judul Mempelai & Heading:** Serif klasik anggun (*Cormorant Garamond* & *Playfair Display*).
- **Isi Body & Tombol Interaktif:** Sans-serif modern (*Inter* & *Plus Jakarta Sans*).
- **Label Kecil & Overline:** Uppercase dengan letter-spacing halus (`tracking-[0.25em]` s.d. `tracking-[0.3em]`).

### 3. Komposisi & Layout Undangan Publik
1. **Hero Header:** Latar hijau gelap `#2D4038` dengan countdown timer dan dekorasi border emas halus.
2. **Label Atas:** `THE WEDDING OF` dengan font kecil kapital dan tracking renggang.
3. **Bingkai Foto Arch Emas:** Arch melengkung di atas (`rounded-t-[140px]`) dengan garis tepi emas tipis `border border-[#B6A078]`.
4. **Nama Pasangan Mempelai:** Ukuran besar dengan tipografi serif elegan dan tanda ampersand emas.
5. **Tanggal Pernikahan:** Ditulis dalam balutan warna emas lembut.
6. **Bagian Isi Krem:** Ayat suci Ar-Rum 21, salam pembuka, dan kartu profil kedua mempelai.
7. **Kartu Rangkaian Acara:** Akad Nikah dan Resepsi lengkap dengan tanggal, jam, dan lokasi.
8. **Kartu Lokasi & "Buka Peta":** Alamat lengkap dan tautan navigasi langsung ke Google Maps.
9. **Personalisasi Nama Tamu:** Sapaan personal berdasarkan parameter URL `?to=Nama+Tamu`.
10. **Konfirmasi Kehadiran (RSVP):** Formulir kehadiran (Hadir, Tidak Hadir, Masih Ragu), jumlah pax, dan ucapan doa restu live feed.
11. **Amplop Digital:** Salin nomor rekening bank dan dompet digital dalam 1-klik.
12. **Footer Hijau Gelap:** Latar `#2D4038` dengan ucapan terima kasih tulus dari kedua keluarga besar.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Backend & Database:** Supabase PostgreSQL (`supabase/migrations/20261013000001_initial_schema.sql`).
- **Autentikasi:** Supabase Auth + Session storage lokal (mendukung mode demo/offline).
- **Penyimpanan Berkas:** Supabase Storage bucket `wedding-photos` dengan validasi MIME-type (JPG, PNG, WebP) maks 5MB.
- **Keamanan (RLS):** Kebijakan Row Level Security pada 11 tabel PostgreSQL untuk membatasi hak akses pelanggan, publik, dan admin secara ketat.

---

## 📂 Struktur Proyek

```
/
├── supabase/
│   └── migrations/
│       └── 20261013000001_initial_schema.sql  # Skema PostgreSQL lengkap + RLS + Seed data
├── src/
│   ├── components/
│   │   ├── PublicInvitation.tsx    # Halaman undangan publik (100% mengikuti screenshot referensi)
│   │   ├── LandingPage.tsx         # Landing page bisnis Nuptia & katalog template
│   │   ├── CustomerDashboard.tsx   # Dashboard pelanggan (undangan, tamu, RSVP, link WA)
│   │   ├── InvitationEditor.tsx    # Editor form 2-panel dengan Live Mobile Preview
│   │   ├── AdminDashboard.tsx      # Dashboard admin (omset, pesanan, verifikasi pembayaran, paket)
│   │   ├── AuthModal.tsx           # Login, Register, & Demo account quick access
│   │   └── SupabaseModal.tsx       # Pengaturan kredensial Supabase & panduan SQL
│   ├── data/
│   │   └── seedData.ts             # Data starter default (Rina & Dimas, paket, order)
│   ├── services/
│   │   ├── supabase.ts             # Inisialisasi client Supabase & deteksi koneksi
│   │   ├── auth.ts                 # Layanan autentikasi & profil pengguna
│   │   ├── invitations.ts          # CRUD undangan, publikasi, & manajemen tamu
│   │   ├── rsvp.ts                 # Validasi input RSVP & penyimpanan ucapan
│   │   ├── admin.ts                # Operasi manajemen admin & pesanan
│   │   └── storage.ts              # Unggah foto ke storage bucket
│   ├── types/
│   │   └── wedding.ts              # Type definitions TypeScript
│   ├── App.tsx                     # Master routing & URL slug resolver (/i/:slug)
│   ├── index.css                   # Tailwind theme tokens & arch styles
│   └── main.tsx                    # Entry point aplikasi
├── .env.example                    # Template variabel lingkungan Supabase
└── README.md
```

---

## ⚡ Panduan Menjalankan Secara Lokal

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat `http://localhost:3000`.

### 3. Akun Pengujian Cepat
Platform menyediakan tombol login 1-klik di modal login:
- **👰 Pengantin (Rina):** `rina@wedding.id` (Password: `password123`)
- **🛡️ Administrator Bisnis:** `admin@nuptia.id` (Password: `password123`)

### 4. Mengakses Undangan Publik Langsung
- Undangan Standar: `http://localhost:3000/i/rina-dimas`
- Undangan Terpersonalisasi Nama Tamu: `http://localhost:3000/i/rina-dimas?to=Rizky+Ramadhan`

---

## 🗄️ Panduan Integrasi Database Supabase

Aplikasi secara cerdas mendeteksi apakah kredensial Supabase sudah diisi:
- **Jika belum dikonfigurasi:** Aplikasi berjalan dalam mode aman lokal (localStorage) dengan banner transparan memberitahukan status penyimpanan.
- **Jika sudah dikonfigurasi:** Aplikasi langsung bertransaksi dengan Supabase PostgreSQL, Auth, dan Storage.

### Langkah Setup Supabase:
1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor**, buka file `supabase/migrations/20261013000001_initial_schema.sql`, salin seluruh kodenya lalu tekan **Run**.
3. Di menu **Storage**, buat bucket baru bernama `wedding-photos` dan centang opsi **Public bucket**.
4. Di menu **Project Settings → API**, salin **Project URL** dan **anon / public key**.
5. Masukkan ke file `.env` lokal:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```
   *(Atau masukkan melalui tombol "Status Supabase" di bagian atas aplikasi).*

---

## 🧪 Skenario Pengujian

1. **Uji Tampilan Responsif:** Buka undangan di devtools mode iPhone/Android dan Desktop; pastikan rasio bingkai arch emas, tombol "Buka Peta", dan pemutar musik bekerja mulus.
2. **Uji Personalisasi Tamu:** Ubah parameter URL `?to=Budi+Santoso` dan periksa apakah nama sapaan muncul di amplop cover, badan undangan, dan form RSVP.
3. **Uji RSVP & Doa:** Kirim konfirmasi kehadiran baru; periksa apakah ucapan langsung muncul di daftar doa tamu dan counter kehadiran bertambah.
4. **Uji Editor Live Preview:** Ubah nama mempelai atau tanggal di form editor; periksa apakah layar ponsel di sebelah kanan langsung terbarui secara real-time.
5. **Uji Admin & Verifikasi Pembayaran:** Masuk sebagai Admin, verifikasi pesanan yang pending menjadi Lunas, dan amati perubahan omset.

---

## 🚀 Panduan Deployment (Vercel / Netlify)

1. Hubungkan repositori Git ke Vercel atau Netlify.
2. Tetapkan pengaturan build:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Masukkan Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Tekan **Deploy**.
