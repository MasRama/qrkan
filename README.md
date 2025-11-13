 # QR Attendance App (Berbasis Laju Framework)

 Aplikasi ini adalah sistem absensi kehadiran berbasis **QR code** yang dibangun di atas boilerplate **Laju** (HyperExpress + Svelte 5 + Inertia.js + TailwindCSS). 

 Use case utama:

 - **Penyelenggara acara** membuat event.
 - Sistem menghasilkan **e-ticket** berisi **QR code unik** untuk tiap peserta.
 - **Gate receiver/operator** menscan QR di pintu masuk.
 - Sistem memverifikasi keabsahan tiket dan mencatat **log kehadiran**.

 ---

 ## 1. Tujuan & Ruang Lingkup

 - **Monitoring kehadiran** peserta acara secara real-time.
 - **Mengurangi pemalsuan tiket** dengan QR unik & sekali pakai.
 - **Mempermudah proses check-in** di pintu masuk dengan scan cepat.
 - **Laporan kehadiran** (siapa yang hadir, kapan, dan di gate mana).

 Fokus awal versi 1:

 - Manajemen event dasar.
 - Manajemen peserta & e-ticket.
 - Halaman scan & verifikasi QR di gate.
 - Dasbor ringkas kehadiran.

 ---

 ## 2. Fitur Utama (Requirement Fungsional)

 ### 2.1 Manajemen Event

 - **Buat event** dengan field minimal:
   - Nama event.
   - Deskripsi singkat.
   - Lokasi.
   - Tanggal & waktu mulai/selesai.
   - Kapasitas maksimal peserta (opsional).
   - Status: `draft` / `published` / `closed`.
 - **Edit & update event** selama belum closed.
 - **Arsip event** yang sudah lewat.

 ### 2.2 Manajemen Peserta & E-Ticket

 - Tambah peserta ke event:
   - Input manual (nama, email, nomor telepon, dsb).
   - (Opsional) Import CSV/Excel.
 - Untuk setiap peserta di suatu event, sistem membuat:
   - ID peserta.
   - **E-ticket** dengan kode/slug unik.
   - **QR code** yang mengenkode token unik (misalnya kombinasi event + ticket + signature).
 - Download e-ticket via web (atau user bisa chat bot telegram).
 - Status tiket:
   - `pending` (belum didownload/tidak aktif).
   - `sent` (sudah dikirim ke peserta).
   - `checked_in` (sudah dipakai masuk).

 ### 2.3 QR Code & Validasi Tiket

 - Generate QR code per tiket, berisi minimal:
   - ID/slug tiket atau token unik.
   - Informasi yang aman untuk diverifikasi server-side (token non-guessable).
 - Saat discan oleh gate receiver:
   - Sistem membaca token dari QR.
   - Verifikasi tiket:
     - Tiket valid untuk event tersebut.
     - Tiket belum pernah dipakai (`checked_in` masih false).
     - Event masih aktif (tidak `closed`).
   - Jika valid:
     - Tandai tiket sebagai `checked_in`.
     - Simpan log check-in (waktu, gate, operator).
   - Jika tidak valid:
     - Tampilkan pesan error: sudah dipakai, tidak ditemukan, atau event ditutup.

 ### 2.4 Halaman Gate Receiver (Scan QR)

 - Halaman web sederhana untuk operator gate:
   - Mendukung scan QR via kamera (browser) atau input manual kode.
   - Menampilkan hasil verifikasi secara real-time:
     - Sukses (warna hijau, info peserta, event).
     - Sudah check-in (warnanya kuning/merah dengan info waktu sebelumnya).
     - Tiket tidak valid (merah).
 - Gate receiver hanya bisa mengakses halaman ini setelah login (role khusus).

 ### 2.5 Dasbor & Laporan

 - Ringkasan per event:
   - Total tiket.
   - Total check-in.
   - Persentase kehadiran.
 - Daftar peserta yang hadir dan yang tidak hadir.
 - (Opsional) Export laporan ke CSV.

 ---

 ## 3. Role & Hak Akses (Requirement Akses)

 Minimal ada beberapa role:

 - **Super Admin**
   - Mengelola semua event dan user.
   - Melihat seluruh laporan.
 - **Event Organizer**
   - Membuat & mengelola event yang ia miliki.
   - Mengelola peserta untuk event tersebut.
   - Melihat laporan event-nya.
 - **Gate Operator**
   - Mengakses halaman scan QR untuk event/gate yang ditugaskan.
   - Hanya bisa melakukan verifikasi tiket, tidak mengubah data event.
 - **Participant (Peserta)**
   - Hanya menerima e-ticket & QR (via email atau halaman publik khusus).

 Implementasi autentikasi/otorisasi dapat memanfaatkan fitur yang sudah ada di boilerplate atau ditambahkan sesuai kebutuhan (contoh: login via email/password atau Google OAuth).

 ---

 ## 4. Requirement Teknis

 ### 4.1 Stack Utama

 - **Backend**: HyperExpress (Node.js), TypeScript, Knex, BetterSQLite3.
 - **Frontend**: Svelte 5 + Inertia.js + TailwindCSS.
 - **View Engine**: Squirrelly untuk server-side template.
 - **Build Tool**: Vite.
 - **Database**: SQLite (default, via BetterSQLite3).
 - **Email**: Nodemailer.
 - **Optional Storage**: Localfile upload saja.
 - **Caching/Queue (opsional)**: Redis melalui `ioredis`.

 ### 4.2 Prasyarat Sistem

 - Node.js (disarankan >= 18).
 - npm.
 - SQLite (sudah di-bundle melalui BetterSQLite3, tidak perlu setup terpisah untuk dev).

 ---

 ## 5. Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan sesuaikan nilai variabel berikut:

```bash
DB_CONNECTION=development      # Profile database (development/production)
NODE_ENV=development           # environment Node
PORT=5555                      # port server backend HyperExpress
VITE_PORT=5173                 # port dev server Vite (frontend)
HAS_CERTIFICATE=false          # true jika menggunakan HTTPS lokal dengan certificate

GOOGLE_REDIRECT_URI=http://localhost:5555/google/callback
GOOGLE_CLIENT_ID=              # opsional, jika pakai login Google
GOOGLE_CLIENT_SECRET=          # opsional, jika pakai login Google

APP_URL=http://localhost:5555  # base URL aplikasi
```

Untuk kebutuhan absensi QR, nilai yang paling penting di-setup:

- `APP_URL`, `PORT`, `VITE_PORT` untuk memastikan endpoint QR & frontend benar.
- `USER_MAILER`, `PASS_MAILER` jika e-ticket akan dikirim via email.
- (Opsional) variabel Wasabi jika QR/e-ticket ingin disimpan di storage eksternal.

 ---

 ## 6. Instalasi & Menjalankan Aplikasi

### 6.1 Langkah Instalasi

1. Clone repository ini.
2. Salin `.env.example` menjadi `.env` dan isi konfigurasi.
3. Install dependency:

   ```bash
   npm install
   ```

4. Jalankan migrasi database (struktur tabel event, peserta, tiket, dsb. akan diatur di folder `migrations/`):

   ```bash
   npx knex migrate:latest
   ```

### 6.2 Menjalankan dalam Mode Development

```bash
npm run dev
```

Script ini akan:

- Membersihkan folder `dist` dan `build`.
- Menjalankan Vite dev server untuk frontend.
- Menjalankan server HyperExpress dengan nodemon.

### 6.3 Build untuk Production

```bash
npm run build
```

Script ini akan:

- Build asset frontend dengan Vite.
- Compile TypeScript ke JavaScript (tsc + tsc-alias).
- Menyalin views dan public asset ke folder `build`.

Deployment production dapat diarahkan ke folder `build` sesuai kebutuhan hosting.

 ---

 ## 7. Arsitektur & Struktur Project (Ringkas)

- **`/app`**
  - `controllers/` – controller web/API, misalnya `EventController`, `TicketController`, `CheckinController`.
  - `services/` – logika bisnis (generate QR, validasi tiket, log check-in, dsb.).
  - `middlewares/` – middleware autentikasi/otorisasi, logging, dll.

- **`/resources`**
  - `views/` – template Squirrelly (layout dasar, file inertia.html/index.html).
  - `js/` – source frontend Svelte + Inertia.
    - `Pages/` – halaman Svelte (mis. halaman event list, detail event, scan gate).
    - `Components/` – komponen UI reusable.

- **`/routes`**
  - Definisi route HTTP (web/API) yang mengarahkan ke controller.

- **`/migrations`**
  - File migrasi Knex untuk mendefinisikan struktur tabel (events, participants, tickets, checkin_logs, users, dll.).

- **`/public`**
  - File statis yang langsung bisa diakses publik.

 ---

 ## 8. Requirement Data & Entitas Utama

Entitas yang minimal dibutuhkan:

- **Event**
  - id, name, description, location.
  - start_at, end_at.
  - capacity (opsional).
  - status (draft/published/closed).

- **Participant**
  - id, name, email, phone.
  - event_id (mengacu ke Event).

- **Ticket**
  - id, participant_id, event_id.
  - token unik (untuk QR).
  - status (pending/sent/checked_in).

- **CheckinLog**
  - id, ticket_id.
  - gate_name / gate_id.
  - checkin_at (timestamp).
  - operator_id (user yang melakukan scan).

- **User**
  - id, name, email.
  - password / auth provider (mis. Google).
  - role (super_admin / organizer / gate_operator).

Struktur di atas dapat disesuaikan saat implementasi migrasi dan model di `app/services/DB`.

 ---

 ## 9. Alur Utama Sistem (High-Level Flow)

1. **Admin/Organizer membuat event** di dashboard.
2. **Organizer menambahkan peserta** (manual/import).
3. Sistem **meng-generate e-ticket & QR** untuk setiap peserta.
4. E-ticket dikirim ke email peserta (opsional) atau peserta mengakses halaman public ticket.
5. Di lokasi acara, **Gate Operator membuka halaman scan** pada device (mobile/desktop) yang punya kamera.
6. Peserta menunjukkan QR dari e-ticket; operator melakukan **scan**.
7. Backend **memverifikasi token**:
   - Jika valid dan belum pernah check-in → tandai `checked_in`, simpan log, tampilkan status "berhasil".
   - Jika sudah pernah check-in → tampilkan informasi waktu check-in sebelumnya.
   - Jika tidak valid → tampilkan pesan error.
8. Organizer dapat **melihat laporan** kehadiran dari dashboard.

 ---

 ## 10. Requirement Keamanan & Validasi

- Token di dalam QR harus **tidak mudah ditebak**:
  - Gunakan UUID v4/v7 atau kombinasi hash (mis. Hashids) + signature.
- Tiket harus **sekali pakai**:
  - Setelah status `checked_in`, scan ulang harus ditolak atau diberi peringatan.
- Validasi di server-side:
  - Jangan mengandalkan informasi yang hanya ada di sisi klien.
  - QR boleh berisi token pendek yang kemudian di-lookup di database.
- Batasi akses halaman scan hanya untuk role **Gate Operator**.
- (Opsional) Tambahkan **rate limiting** pada endpoint scan untuk menghindari brute-force token.

 ---

## 11. Roadmap Pengembangan (Opsional)

- Integrasi dengan printer untuk cetak badge fisik.
- Multi-gate & antrian (queue) dengan monitoring realtime.
- Integrasi notifikasi (WhatsApp/Telegram) untuk peserta.
- Fitur self-checkin dengan validasi tambahan.

---

README ini berfungsi sebagai dokumen _requirement_ awal untuk mengarahkan implementasi fitur di atas boilerplate Laju yang sudah ada.

